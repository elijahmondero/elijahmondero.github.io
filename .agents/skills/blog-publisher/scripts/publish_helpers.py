#!/usr/bin/env python3
"""
publish_helpers.py - Deterministic publishing utilities for blog-publisher skill.
Uses standard library only (no external pip dependencies).
"""

import os
import sys
import json
import re
from datetime import datetime

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
    return True

def update_sitemap(post_id: str, post_date: str = None, repo_root: str = None) -> bool:
    repo_root = repo_root or get_repo_root()
    sitemap_file = os.path.join(repo_root, "elijahmondero", "public", "sitemap.xml")
    os.makedirs(os.path.dirname(sitemap_file), exist_ok=True)
    
    new_url = f"https://elijah.mondero.nz/post/{post_id}"
    
    # Format date as YYYY-MM-DD
    formatted_date = datetime.utcnow().strftime('%Y-%m-%d')
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
        with open(sitemap_file, "r", encoding="utf-8") as f:
            content = f.read()
            
        url_pattern = re.compile(rf"<url>\s*<loc>{re.escape(new_url)}<\/loc>.*?<\/url>", re.DOTALL)
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

    pr_body = f"""# {title}

> **Summary:** {summary}
{scorecard_block}
---

## 📝 Full Article Content Preview

{body}

---

## 🔗 Referenced Sources
{sources_section}
"""

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
        sys.exit(1)
        
    cmd = sys.argv[1].lower()
    if cmd == "slug" and len(sys.argv) >= 3:
        print(generate_slug(sys.argv[2]))
    elif cmd == "index" and len(sys.argv) >= 5:
        update_index(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == "sitemap" and len(sys.argv) >= 3:
        date_val = sys.argv[3] if len(sys.argv) > 3 else None
        update_sitemap(sys.argv[2], date_val)
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
