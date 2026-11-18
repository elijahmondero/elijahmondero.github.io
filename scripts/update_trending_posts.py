import os
import json
import re
import sys
import time
import asyncio
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from ddgs import DDGS
from typing import List, Dict, Any

try:
    import yaml
except ImportError:
    yaml = None
from google.adk.agents import Agent, SequentialAgent 
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types 

load_dotenv()

# LLM Provider configuration
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash") # Uplifted to 2.5-flash

# Configure ADK to use API keys directly
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "False"


# --- Tools ---

# DuckDuckGo search tool with exponential backoff and fixed parameter
def search_topics(query: str) -> str:
    """Searches for news using DuckDuckGo Search and returns a formatted string of results. Includes exponential backoff."""
    print(f"Searching news for: {query}")
    max_retries = 5
    delay = 2
    results: list = []
    for attempt in range(max_retries):
        try:
            with DDGS() as ddgs:
                # Use query= instead of keywords=
                for r in ddgs.news(query=query, max_results=5):
                    results.append(r)
            break
        except Exception as e:
            print(f"Error during DuckDuckGo search (attempt {attempt+1}): {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2
            else:
                return f"Error during search after {max_retries} attempts: {e}"
    
    if not results:
        return "No news results found."
        
    formatted_results = "News Search Results:\n\n"
    for i, r in enumerate(results):
        formatted_results += f"{i+1}. Title: {r['title']}\n   Link: {r['url']}\n   Snippet: {r['body']}\n\n"
    return formatted_results

# Basic scraping tool with exponential backoff
def scrape_link(link: str) -> str:
    """Scrapes content from a given URL with exponential backoff."""
    print("Scraping link:", link)
    max_retries = 3
    delay = 5
    for attempt in range(max_retries):
        try:
            response = requests.get(link, timeout=10)
            if response.status_code == 429 or 500 <= response.status_code < 600:
                time.sleep(delay)
                delay *= 2
                continue
            
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            text = ' '.join(p.get_text() for p in soup.find_all('p'))
            text += ' '.join(h.get_text() for h in soup.find_all(['h1', 'h2', 'h3']))
            return text[:2000]
            
        except requests.exceptions.RequestException as e:
            if attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2
            else:
                return f"Error scraping {link}: {e}"
        except Exception as e:
            return f"An unexpected error occurred while scraping {link}: {e}"
    
    return f"Failed to scrape {link} after {max_retries} attempts."

def _get_repo_root() -> str:
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


def _resolve_repo_path(target_path: str) -> str:
    if os.path.isabs(target_path):
        return target_path
    return os.path.join(_get_repo_root(), target_path)


def _parse_markdown_frontmatter(raw_content: str) -> Dict[str, Any]:
    """Parse YAML frontmatter from a markdown post, with a regex fallback if PyYAML is unavailable."""
    if not raw_content.startswith("---"):
        return {}
    parts = raw_content.split("---", 2)
    if len(parts) < 3:
        return {}
    frontmatter_str = parts[1]

    if yaml is not None:
        try:
            parsed = yaml.safe_load(frontmatter_str)
            if isinstance(parsed, dict):
                return parsed
        except Exception as e:
            print(f"Warning: PyYAML parse failed, using fallback parser: {e}")

    data: Dict[str, Any] = {}
    for key in ("title", "summary", "excerpt"):
        match = re.search(rf'^{key}:\s*["\']?(.*?)["\']?\s*$', frontmatter_str, re.MULTILINE)
        if match:
            data[key] = match.group(1).strip()

    tags_match = re.search(r'^tags:\s*\n((?:\s*-\s*.*\n?)+)', frontmatter_str, re.MULTILINE)
    if tags_match:
        tags = []
        for line in tags_match.group(1).splitlines():
            item = re.sub(r'^\s*-\s*', '', line).strip().strip('"\'')
            if item:
                tags.append(item)
        data["tags"] = tags
    return data


# Tool to load blog post metadata
def load_blog_posts_metadata_tool(posts_dir_path: str = "elijahmondero/posts") -> str:
    """Loads blog post metadata from markdown posts and any legacy JSON files."""
    repo_root = _get_repo_root()
    md_dir = os.path.join(repo_root, "elijahmondero", "posts")
    json_dir = _resolve_repo_path(posts_dir_path)

    print(f"Loading blog post metadata from {md_dir} (and legacy JSON in {json_dir})...")
    posts_metadata: List[Dict[str, Any]] = []
    seen_ids = set()

    if os.path.exists(md_dir):
        for filename in sorted(os.listdir(md_dir)):
            if not filename.endswith(".md"):
                continue
            post_id = filename[:-3]
            file_path = os.path.join(md_dir, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    fm = _parse_markdown_frontmatter(f.read())
                title = fm.get("title")
                excerpt = fm.get("summary") or fm.get("excerpt")
                if title and excerpt:
                    posts_metadata.append({
                        "id": post_id,
                        "title": title,
                        "excerpt": excerpt,
                        "tags": fm.get("tags", []) or []
                    })
                    seen_ids.add(post_id)
            except Exception as e:
                print(f"Error reading markdown file {filename}: {e}")

    if os.path.exists(json_dir):
        for filename in sorted(os.listdir(json_dir)):
            if filename.endswith(".json") and filename not in ("index.json", "trending_posts.json"):
                file_path = os.path.join(json_dir, filename)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        post_data = json.load(f)
                    post_id = post_data.get("id")
                    if post_id and post_id not in seen_ids and "title" in post_data and "excerpt" in post_data:
                        posts_metadata.append({
                            "id": post_id,
                            "title": post_data["title"],
                            "excerpt": post_data["excerpt"],
                            "tags": post_data.get("tags", [])
                        })
                        seen_ids.add(post_id)
                except Exception as e:
                    print(f"Error reading file {filename}: {e}")

    print(f"Loaded {len(posts_metadata)} blog posts metadata.")
    return json.dumps(posts_metadata)


# Tool to save trending posts list atomically
def save_trending_posts_list_tool(trending_posts_data_json: str, output_file_path: str = "elijahmondero/public/posts/trending_posts.json") -> str:
    """Validates and atomically saves the list of trending post data to a JSON file."""
    try:
        cleaned_json = trending_posts_data_json.strip()
        if cleaned_json.startswith("```"):
            cleaned_json = re.sub(r'^```(?:json)?\s*|\s*```$', '', cleaned_json, flags=re.DOTALL).strip()

        trending_posts_data = json.loads(cleaned_json)
        if not isinstance(trending_posts_data, list):
            return "Error: trending_posts_data_json must decode to a JSON list."

        validated_posts = []
        for item in trending_posts_data:
            if isinstance(item, dict) and item.get("id") and item.get("title") and item.get("excerpt"):
                validated_posts.append({
                    "id": str(item["id"]),
                    "title": str(item["title"]),
                    "excerpt": str(item["excerpt"]),
                })

        if not validated_posts:
            return "Error: No valid trending post entries found; leaving existing file unchanged."

        resolved_output = _resolve_repo_path(output_file_path)
        output_dir = os.path.dirname(resolved_output)
        os.makedirs(output_dir, exist_ok=True)
        tmp_path = f"{resolved_output}.tmp"
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(validated_posts, f, indent=2)
        os.replace(tmp_path, resolved_output)

        return f"Successfully saved {len(validated_posts)} trending posts to {resolved_output}"
    except Exception as e:
        return f"Error saving trending posts data to {output_file_path}: {e}"


# --- ADK Agents ---

trending_researcher_agent = Agent(
    name="trending_researcher",
    model=GEMINI_MODEL,
    description="Researches current trending tech topics using search.",
    instruction="Your task is to find current trending tech topics relevant to LLM/AI/GenAI, Machine Learning, .NET, ReactJS, Docker, and containers. "
                "Use the `search_topics` tool with a relevant query. "
                "Synthesize the search results into a concise summary of the top trending themes and keywords. "
                "Provide this summary as your final response.",
    tools=[search_topics],
    output_key="trending_data_summary"
)

trending_analyzer_agent = Agent(
    name="trending_analyzer",
    model=GEMINI_MODEL,
    description="Analyzes trending data summary to extract key trending keywords.",
    instruction="You will receive a summary of trending tech data: {trending_data_summary}. "
                "Your task is to analyze this summary and identify the most important trending keywords and topics related to LLM/AI/GenAI, Machine Learning, .NET, ReactJS, Docker, and containers. "
                "List these keywords as a JSON array of strings. Only include the keywords themselves in the JSON array. Ensure the output is valid JSON.",
    tools=[], # This agent uses the LLM directly for analysis
    output_key="trending_keywords_json"
)

post_matcher_agent = Agent(
    name="post_matcher",
    model=GEMINI_MODEL,
    description="Matches trending keywords to blog posts and extracts their metadata.",
    instruction="You will receive a JSON array of trending keywords: {trending_keywords_json}. "
                "Use the `load_blog_posts_metadata_tool` with the path `elijahmondero/public/posts` to get all blog post metadata. "
                "Analyze the loaded blog post metadata and identify which posts are most relevant to the trending keywords. "
                "Match keywords against the title, excerpt, and tags of each post (case-insensitive). "
                "From the matching posts, extract their `id`, `title`, and `excerpt`. "
                "Generate a JSON array of these objects (id, title, excerpt) for the trending posts. "
                "Limit the output to a maximum of 10 trending post objects. "
                "Provide the JSON array of trending post metadata as your final response. Ensure the output is valid JSON.",
    tools=[load_blog_posts_metadata_tool],
    output_key="trending_posts_data_json" # Change output key to reflect full data
)

output_writer_agent = Agent(
    name="output_writer",
    model=GEMINI_MODEL,
    description="Saves the list of trending post data atomically to a JSON file.",
    instruction="You will receive a JSON array of trending blog post data (id, title, excerpt): {trending_posts_data_json}. "
                "Call `save_trending_posts_list_tool` once with `trending_posts_data_json` set to the full JSON array string "
                "and `output_file_path` set to `elijahmondero/public/posts/trending_posts.json`. "
                "Indicate completion after the tool call succeeds.",
    tools=[save_trending_posts_list_tool],
    output_key="save_status"
)


# Agent chain
pipeline = SequentialAgent(
    name="TrendingPostsUpdatePipeline",
    sub_agents=[
        trending_researcher_agent,
        trending_analyzer_agent,
        post_matcher_agent,
        output_writer_agent
    ]
)

# Runner configuration
APP_NAME = "trending_update_app"
USER_ID = "github_actions_user"
SESSION_ID = "daily_run"


# Run the pipeline
def run_trending_update_pipeline():
    if not GOOGLE_GEMINI_API_KEY:
        print("Error: GOOGLE_GEMINI_API_KEY not found in environment variables.")
        sys.exit(1)

    print("Gemini ADK Sequential Pipeline: Starting trending posts update process...")
    print("--- ADK Runner Events ---")

    session_service = InMemorySessionService()
    result = session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID)
    if asyncio.iscoroutine(result):
        asyncio.run(result)
    runner = Runner(agent=pipeline, app_name=APP_NAME, session_service=session_service)

    # Initial prompt for the researcher agent
    initial_prompt = "Find current trending tech topics relevant to LLM/AI/GenAI, Machine Learning, .NET, ReactJS, Docker, and containers."
    content = types.Content(role="user", parts=[types.Part(text=initial_prompt)])

    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)

    for event in events:
        print(event)
        if event.is_final_response():
            print("\n📢 Final Status:\n")
            print(event.content.parts[0].text)

    print("--- End of ADK Runner Events ---")
    print("Gemini ADK Sequential Pipeline: Pipeline complete.")


# Main execution
if __name__ == "__main__":
    run_trending_update_pipeline()
