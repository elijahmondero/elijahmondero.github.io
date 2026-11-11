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

    # 4. Standard Python webbrowser fallback
    try:
        opened = webbrowser.open(url)
        if opened:
            print(f"Opened {url} in default browser")
            return True
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

    return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python publish_helpers.py slug '<title>'")
        print("  python publish_helpers.py index <post_id> '<title>' '<excerpt>'")
        print("  python publish_helpers.py sitemap <post_id> [iso_date]")
        print("  python publish_helpers.py validate <post_id>")
        print("  python publish_helpers.py open-browser '<url>'")
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
    else:
        print(f"Unknown or incomplete command: {cmd}")
        sys.exit(1)
