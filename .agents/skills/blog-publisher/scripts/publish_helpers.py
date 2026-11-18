#!/usr/bin/env python3
"""
publish_helpers.py - Deterministic publishing utilities for blog-publisher skill.
Uses standard library only (no external pip dependencies).
"""

import os
import sys
import json
import re
from html import escape as html_escape
from datetime import datetime, timezone
from email.utils import format_datetime
from xml.sax.saxutils import escape as xml_escape

def get_repo_root() -> str:
    current = os.path.abspath(os.path.dirname(__file__))
    # Walk up until finding .git or elijahmondero directory
    while current and current != os.path.dirname(current):
        if os.path.exists(os.path.join(current, ".git")) or os.path.exists(os.path.join(current, "elijahmondero")):
            return current
        current = os.path.dirname(current)
    return os.getcwd()

def generate_slug(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    return slug[:50]

def _unquote_yaml_scalar(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        inner = value[1:-1]
        if value[0] == '"':
            return inner.replace('\\"', '"')
        return inner.replace("''", "'")
    return value


def _parse_iso_datetime(date_str: str) -> datetime:
    if date_str:
        try:
            dt = datetime.fromisoformat(date_str.strip().replace('Z', '+00:00'))
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except Exception:
            pass
    return datetime.now(timezone.utc)


def _load_markdown_posts(repo_root: str = None) -> list:
    repo_root = repo_root or get_repo_root()
    posts_dir = os.path.join(repo_root, "elijahmondero", "posts")
    posts = []
    if not os.path.exists(posts_dir):
        return posts

    for filename in sorted(os.listdir(posts_dir)):
        if not filename.endswith(".md"):
            continue
        post_id = filename[:-3]
        file_path = os.path.join(posts_dir, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            raw = f.read()
        if not raw.startswith("---"):
            continue
        parts = raw.split("---", 2)
        if len(parts) < 3:
            continue
        fm = parts[1]

        title = post_id
        m_title = re.search(r'^title:\s*(.+)$', fm, re.MULTILINE)
        if m_title:
            title = _unquote_yaml_scalar(m_title.group(1))

        summary = ""
        m_summary = re.search(r'^summary:\s*(.+)$', fm, re.MULTILINE)
        if m_summary:
            summary = _unquote_yaml_scalar(m_summary.group(1))

        date_str = ""
        m_date = re.search(r'^date:\s*(.+)$', fm, re.MULTILINE)
        if m_date:
            date_str = _unquote_yaml_scalar(m_date.group(1))

        tags = []
        m_tags = re.search(r'^tags:\s*\n((?:\s*-\s*.*\n?)+)', fm, re.MULTILINE)
        if m_tags:
            for line in m_tags.group(1).splitlines():
                raw_tag = re.sub(r'^\s*-\s*', '', line).strip()
                if raw_tag:
                    tags.append(_unquote_yaml_scalar(raw_tag))

        dt = _parse_iso_datetime(date_str)
        image_path = ""
        m_img = re.search(r'^image_path:\s*(.+)$', fm, re.MULTILINE)
        if m_img:
            image_path = _unquote_yaml_scalar(m_img.group(1))

        posts.append({
            "id": post_id,
            "title": title,
            "summary": summary,
            "date": date_str,
            "dt": dt,
            "tags": tags,
            "image_path": image_path,
            "body": parts[2].strip(),
        })

    posts.sort(key=lambda p: p["dt"], reverse=True)
    return posts


def _absolutize_site_url(url: str, for_image: bool = False) -> str:
    url = url.strip()
    if for_image and url.lower().endswith(".svg") and (
        url.startswith("/posts/images/") or url.startswith("https://elijah.mondero.nz/posts/images/")
    ):
        url = url[:-4] + ".png"
    if url.startswith("/"):
        return f"https://elijah.mondero.nz{url}"
    return url


def _format_inline_markdown(text: str) -> str:
    code_spans = []

    def _stash_code(match):
        code_spans.append(f"<code>{html_escape(match.group(1))}</code>")
        return f"\x00CODE{len(code_spans) - 1}\x00"

    text = re.sub(r'`([^`]+)`', _stash_code, text)
    text = re.sub(
        r'(?<!\\)\$(?!\s)([^$\n]{1,40}?)(?<!\s)\$',
        lambda m: m.group(1).replace(r'\%', '%'),
        text,
    )
    escaped = html_escape(text, quote=True)

    # Images before links
    escaped = re.sub(
        r'!\[([^\]]*)\]\(([^)\s]+)\)',
        lambda m: f'<img src="{html_escape(_absolutize_site_url(m.group(2), for_image=True), quote=True)}" alt="{m.group(1)}" />',
        escaped,
    )
    escaped = re.sub(
        r'\[([^\]]+)\]\(([^)\s]+)\)',
        lambda m: f'<a href="{html_escape(_absolutize_site_url(m.group(2)), quote=True)}">{m.group(1)}</a>',
        escaped,
    )
    escaped = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', escaped)
    escaped = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', escaped)

    for idx, code_html in enumerate(code_spans):
        escaped = escaped.replace(f"\x00CODE{idx}\x00", code_html)
    return escaped


def _markdown_to_rss_html(md_text: str, image_path: str = "", title: str = "") -> str:
    """Converts article Markdown to clean HTML with absolute site URLs for RSS readers and Dev.to."""
    blocks = []
    if image_path:
        abs_hero = html_escape(_absolutize_site_url(image_path, for_image=True), quote=True)
        blocks.append(f'<p><img src="{abs_hero}" alt="{html_escape(title, quote=True)}" /></p>')

    code_blocks = []

    def _stash_fenced(match):
        code_body = html_escape(match.group(2))
        code_blocks.append(f"<pre>{code_body}</pre>")
        return f"\n\x00CODEBLOCK{len(code_blocks) - 1}\x00\n"

    normalized = md_text.replace("\r\n", "\n")
    normalized = re.sub(r'```([^\n]*)\n(.*?)```', _stash_fenced, normalized, flags=re.DOTALL)

    lines = normalized.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        m_cb = re.fullmatch(r'\x00CODEBLOCK(\d+)\x00', stripped)
        if m_cb:
            blocks.append(code_blocks[int(m_cb.group(1))])
            i += 1
            continue

        if re.fullmatch(r'(?:-{3,}|\*{3,}|_{3,})', stripped):
            blocks.append("<hr />")
            i += 1
            continue

        m_heading = re.match(r'^(#{1,4})\s+(.+)$', stripped)
        if m_heading:
            level = len(m_heading.group(1))
            blocks.append(f"<h{level}>{_format_inline_markdown(m_heading.group(2).strip())}</h{level}>")
            i += 1
            continue

        if stripped.startswith(">"):
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_lines.append(re.sub(r'^>\s?', '', lines[i].strip()))
                i += 1
            quote_text = " ".join(quote_lines).strip()
            quote_text = re.sub(
                r'^\[!(IMPORTANT|NOTE|TIP|WARNING|CAUTION)\]\s*',
                lambda m: f"**{m.group(1).title()}:** ",
                quote_text,
            )
            blocks.append(f"<blockquote><p>{_format_inline_markdown(quote_text)}</p></blockquote>")
            continue

        if re.match(r'^[-*]\s+', stripped):
            items = []
            while i < len(lines) and re.match(r'^[-*]\s+', lines[i].strip()):
                item_text = re.sub(r'^[-*]\s+', '', lines[i].strip())
                items.append(f"<li>{_format_inline_markdown(item_text)}</li>")
                i += 1
            blocks.append("<ul>\n" + "\n".join(items) + "\n</ul>")
            continue

        if re.match(r'^\d+\.\s+', stripped):
            items = []
            while i < len(lines) and re.match(r'^\d+\.\s+', lines[i].strip()):
                item_text = re.sub(r'^\d+\.\s+', '', lines[i].strip())
                items.append(f"<li>{_format_inline_markdown(item_text)}</li>")
                i += 1
            blocks.append("<ol>\n" + "\n".join(items) + "\n</ol>")
            continue

        para_lines = []
        while i < len(lines):
            cur = lines[i].strip()
            if (
                not cur
                or re.fullmatch(r'\x00CODEBLOCK\d+\x00', cur)
                or re.fullmatch(r'(?:-{3,}|\*{3,}|_{3,})', cur)
                or re.match(r'^#{1,4}\s+', cur)
                or cur.startswith(">")
                or re.match(r'^[-*]\s+', cur)
                or re.match(r'^\d+\.\s+', cur)
            ):
                break
            para_lines.append(cur)
            i += 1
        if para_lines:
            blocks.append(f"<p>{_format_inline_markdown(' '.join(para_lines))}</p>")

    html_out = "\n".join(blocks)
    html_out = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', html_out)
    return html_out.replace("]]>", "]]]]><![CDATA[>")


def generate_rss(repo_root: str = None) -> bool:
    repo_root = repo_root or get_repo_root()
    rss_file = os.path.join(repo_root, "elijahmondero", "public", "rss.xml")
    os.makedirs(os.path.dirname(rss_file), exist_ok=True)
    posts = _load_markdown_posts(repo_root)

    last_build = format_datetime(posts[0]["dt"] if posts else datetime.now(timezone.utc))
    items_xml = []
    for post in posts:
        link = f"https://elijah.mondero.nz/post/{post['id']}/"
        pub_date = format_datetime(post["dt"])
        categories_xml = "\n".join(
            f"      <category>{xml_escape(tag)}</category>" for tag in post["tags"]
        )
        cat_block = f"\n{categories_xml}" if categories_xml else ""
        content_html = _markdown_to_rss_html(
            post.get("body", ""),
            image_path=post.get("image_path", ""),
            title=post["title"],
        )
        items_xml.append(
            f"""    <item>
      <title>{xml_escape(post['title'])}</title>
      <link>{xml_escape(link)}</link>
      <guid isPermaLink="true">{xml_escape(link)}</guid>
      <pubDate>{xml_escape(pub_date)}</pubDate>
      <description>{xml_escape(post['summary'])}</description>
      <content:encoded><![CDATA[{content_html}]]></content:encoded>{cat_block}
    </item>"""
        )

    rss_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Monderings: Beyond the Prompt</title>
    <link>https://elijah.mondero.nz/</link>
    <description>Practical engineering insights on AI agents, .NET, AWS, and modern software architecture by Elijah Mondero.</description>
    <language>en-us</language>
    <lastBuildDate>{xml_escape(last_build)}</lastBuildDate>
    <atom:link href="https://elijah.mondero.nz/rss.xml" rel="self" type="application/rss+xml" />
{chr(10).join(items_xml)}
  </channel>
</rss>
"""
    with open(rss_file, "w", encoding="utf-8") as f:
        f.write(rss_content)
    print(f"Successfully generated {rss_file} with {len(posts)} posts")
    return True


def generate_llms_txt(repo_root: str = None) -> bool:
    repo_root = repo_root or get_repo_root()
    llms_file = os.path.join(repo_root, "elijahmondero", "public", "llms.txt")
    os.makedirs(os.path.dirname(llms_file), exist_ok=True)
    posts = _load_markdown_posts(repo_root)

    lines = [
        "# Monderings: Beyond the Prompt",
        "",
        "> Personal engineering blog by Elijah Mondero (Staff Software Engineer & AI Augmented Engineer). Covers agentic coding workflows, eval-driven development, GraphRAG, cloud architecture (AWS/Azure), and .NET/React systems.",
        "",
        "- Website: https://elijah.mondero.nz/",
        "- Career Story: https://elijah.mondero.nz/career-story/",
        "- RSS Feed: https://elijah.mondero.nz/rss.xml",
        "- Sitemap: https://elijah.mondero.nz/sitemap.xml",
        "",
        "## Articles",
        "",
    ]
    for post in posts:
        url = f"https://elijah.mondero.nz/post/{post['id']}/"
        lines.append(f"- [{post['title']}]({url}): {post['summary']}")

    with open(llms_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Successfully generated {llms_file} with {len(posts)} posts")
    return True


def normalize_sitemap(repo_root: str = None) -> bool:
    repo_root = repo_root or get_repo_root()
    sitemap_file = os.path.join(repo_root, "elijahmondero", "public", "sitemap.xml")
    if not os.path.exists(sitemap_file):
        return False
    with open(sitemap_file, "r", encoding="utf-8") as f:
        content = f.read()

    normalized = re.sub(
        r'(<loc>https://elijah\.mondero\.nz/post/[^<>/]+)(</loc>)',
        r'\1/\2',
        content,
    )
    if normalized != content:
        with open(sitemap_file, "w", encoding="utf-8") as f:
            f.write(normalized)
        print(f"Normalized trailing slashes in {sitemap_file}")
    return True


def update_index(post_id: str, title: str, excerpt: str, repo_root: str = None) -> bool:
    repo_root = repo_root or get_repo_root()
    index_file = os.path.join(repo_root, "elijahmondero", "public", "posts", "index.json")
    os.makedirs(os.path.dirname(index_file), exist_ok=True)
    
    index_data = []
    if os.path.exists(index_file):
        try:
            with open(index_file, "r", encoding="utf-8") as f:
                index_data = json.load(f)
        except Exception as e:
            print(f"Warning reading existing index.json: {e}")
            index_data = []
            
    # Remove existing entry if updating
    index_data = [p for p in index_data if p.get("id") != post_id]
    # Prepend new post
    index_data.insert(0, {
        "id": post_id,
        "title": title,
        "excerpt": excerpt
    })
    
    with open(index_file, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    print(f"Successfully updated {index_file} with post '{post_id}'")
    generate_rss(repo_root)
    generate_llms_txt(repo_root)
    return True

def update_sitemap(post_id: str, post_date: str = None, repo_root: str = None) -> bool:
    repo_root = repo_root or get_repo_root()
    sitemap_file = os.path.join(repo_root, "elijahmondero", "public", "sitemap.xml")
    os.makedirs(os.path.dirname(sitemap_file), exist_ok=True)
    
    new_url = f"https://elijah.mondero.nz/post/{post_id}/"
    
    # Format date as YYYY-MM-DD
    formatted_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    if post_date:
        try:
            cleaned_date = post_date.replace('Z', '+00:00')
            formatted_date = datetime.fromisoformat(cleaned_date).strftime('%Y-%m-%d')
        except Exception:
            pass

    new_entry = f"""  <url>
    <loc>{new_url}</loc>
    <lastmod>{formatted_date}</lastmod>
  </url>"""

    if os.path.exists(sitemap_file):
        normalize_sitemap(repo_root)
        with open(sitemap_file, "r", encoding="utf-8") as f:
            content = f.read()
            
        url_pattern = re.compile(
            rf"<url>\s*<loc>https://elijah\.mondero\.nz/post/{re.escape(post_id)}/?<\/loc>.*?<\/url>",
            re.DOTALL,
        )
        if url_pattern.search(content):
            content = url_pattern.sub(new_entry, content)
        else:
            insert_pos = content.rfind("</urlset>")
            if insert_pos != -1:
                content = content[:insert_pos] + new_entry + "\n" + content[insert_pos:]
            else:
                content += "\n" + new_entry
    else:
        content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{new_entry}
</urlset>"""

    with open(sitemap_file, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Successfully updated {sitemap_file} with URL '{new_url}'")
    return True

def validate_post(post_id: str, repo_root: str = None) -> bool:
    repo_root = repo_root or get_repo_root()
    post_file = os.path.join(repo_root, "elijahmondero", "posts", f"{post_id}.md")
    
    if not os.path.exists(post_file):
        print(f"Error: Post file {post_file} not found.")
        return False
        
    with open(post_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    if not content.startswith("---"):
        print("Error: Missing frontmatter start '---'")
        return False
        
    parts = content.split("---", 2)
    if len(parts) < 3:
        print("Error: Malformed frontmatter (missing closing '---')")
        return False
        
    frontmatter = parts[1]
    required_keys = ["title:", "authors:", "date:", "summary:", "tags:", "sources:"]
    for key in required_keys:
        if key not in frontmatter:
            print(f"Error: Missing required frontmatter key '{key}'")
            return False
            
    print(f"Post {post_id}.md validated successfully.")
    return True

def open_in_browser(url: str) -> bool:
    """Opens a URL in the user's default browser cross-platform (Termux, Linux, macOS, Windows)."""
    import shutil
    import subprocess
    import webbrowser

    # 1. Android Termux support
    if shutil.which("termux-open-url"):
        try:
            subprocess.run(["termux-open-url", url], check=True)
            print(f"Opened {url} via termux-open-url")
            return True
        except Exception:
            pass

    # 2. Linux xdg-open support
    if shutil.which("xdg-open"):
        try:
            subprocess.run(["xdg-open", url], check=True)
            print(f"Opened {url} via xdg-open")
            return True
        except Exception:
            pass

    # 3. macOS open support
    if sys.platform == "darwin" and shutil.which("open"):
        try:
            subprocess.run(["open", url], check=True)
            print(f"Opened {url} via open")
            return True
        except Exception:
            pass

    # 4. Windows native shell support
    if sys.platform == "win32":
        try:
            os.startfile(url)
            print(f"Opened {url} via os.startfile")
            return True
        except Exception:
            pass

    # 5. Standard Python webbrowser fallback
    try:
        opened = webbrowser.open(url)
        if opened:
            print(f"Opened {url} in default browser")
            return True
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

    return False

def build_pr_body(post_id: str, scorecard_file: str = None, output_file: str = None, repo_root: str = None) -> str:
    """Builds a complete, professional PR description containing Summary, Scorecard, Full Article Content, and Sources."""
    repo_root = repo_root or get_repo_root()
    post_file = os.path.join(repo_root, "elijahmondero", "posts", f"{post_id}.md")
    
    if not os.path.exists(post_file):
        raise FileNotFoundError(f"Post file not found: {post_file}")
        
    with open(post_file, "r", encoding="utf-8") as f:
        raw = f.read()
        
    parts = raw.split("---", 2)
    frontmatter = parts[1] if len(parts) > 2 else ""
    body = parts[2].strip() if len(parts) > 2 else raw
    
    # Extract title
    title = post_id
    title_match = re.search(r'title:\s*["\']?(.*?)["\']?\s*$', frontmatter, re.MULTILINE)
    if title_match:
        title = title_match.group(1).strip()
        
    # Extract summary
    summary = ""
    summary_match = re.search(r'summary:\s*["\']?(.*?)["\']?\s*$', frontmatter, re.MULTILINE)
    if summary_match:
        summary = summary_match.group(1).strip()

    # Extract sources
    sources_match = re.search(r'sources:\s*\n((?:\s*-\s*.*?\n)+)', frontmatter)
    sources_lines = []
    if sources_match:
        for line in sources_match.group(1).splitlines():
            url_match = re.search(r'-\s*["\']?(https?://[^\s"\']+)["\']?', line)
            if url_match:
                sources_lines.append(f"- {url_match.group(1)}")
    sources_section = "\n".join(sources_lines) if sources_lines else "None listed."

    # Load scorecard if present
    scorecard_md = ""
    if scorecard_file and os.path.exists(scorecard_file):
        with open(scorecard_file, "r", encoding="utf-8") as sf:
            scorecard_md = sf.read().strip()

    scorecard_block = f"\n---\n\n{scorecard_md}\n" if scorecard_md else ""

    canonical_url = f"https://elijah.mondero.nz/post/{post_id}/"
    social_kit = f"""---

## 📣 Social Distribution Kit

**LinkedIn Draft:**
```text
{title}

{summary}

Read the full breakdown (with architecture notes): {canonical_url}
```

**Hacker News / X Headline:**
```text
{title} — {canonical_url}
```
"""

    pr_body = f"""# {title}

> **Summary:** {summary}
{scorecard_block}
---

## 📝 Full Article Content Preview

{body}

---

## 🔗 Referenced Sources
{sources_section}

{social_kit}"""

    if output_file:
        os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as out:
            out.write(pr_body)
        print(f"PR body written to {output_file}")
    else:
        print(pr_body)

    return pr_body

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python publish_helpers.py slug '<title>'")
        print("  python publish_helpers.py index <post_id> '<title>' '<excerpt>'")
        print("  python publish_helpers.py sitemap <post_id> [iso_date]")
        print("  python publish_helpers.py validate <post_id>")
        print("  python publish_helpers.py open-browser '<url>'")
        print("  python publish_helpers.py pr-body <post_id> [scorecard_file] [output_file]")
        print("  python publish_helpers.py feeds")
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    if cmd == "slug" and len(sys.argv) >= 3:
        print(generate_slug(sys.argv[2]))
    elif cmd == "index" and len(sys.argv) >= 5:
        update_index(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == "sitemap" and len(sys.argv) >= 3:
        date_val = sys.argv[3] if len(sys.argv) > 3 else None
        update_sitemap(sys.argv[2], date_val)
    elif cmd == "feeds":
        normalize_sitemap()
        generate_rss()
        generate_llms_txt()
    elif cmd == "validate" and len(sys.argv) >= 3:
        if not validate_post(sys.argv[2]):
            sys.exit(1)
    elif cmd in ("open-browser", "open-url") and len(sys.argv) >= 3:
        open_in_browser(sys.argv[2])
    elif cmd in ("pr-body", "body") and len(sys.argv) >= 3:
        post_id = sys.argv[2]
        sc_file = sys.argv[3] if len(sys.argv) > 3 else None
        out_file = sys.argv[4] if len(sys.argv) > 4 else None
        build_pr_body(post_id, sc_file, out_file)
    else:
        print(f"Unknown or incomplete command: {cmd}")
        sys.exit(1)
