import os
import json
import sys
import time
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from ddgs import DDGS
from typing import List, Dict, Any
import google.generativeai as genai
from google.adk.agents import Agent, SequentialAgent 
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types 

load_dotenv()

# LLM Provider configuration
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash") # Uplifted to 2.5-flash

# Initialize Google Gemini client
if not GOOGLE_GEMINI_API_KEY:
    print("Error: GOOGLE_GEMINI_API_KEY not found in environment variables.")
    sys.exit(1)

genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

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

# Tool to load blog post metadata
def load_blog_posts_metadata_tool(posts_dir_path: str) -> str: 
    """Loads blog post metadata from individual JSON files."""
    print(f"Loading blog post metadata from {posts_dir_path}...")
    posts_metadata = []
    if not os.path.exists(posts_dir_path):
        print(f"Error: Posts directory not found at {posts_dir_path}")
        return json.dumps([]) 

    for filename in os.listdir(posts_dir_path):
        if filename.endswith(".json") and filename != "index.json" and filename != "trending_posts.json":
            file_path = os.path.join(posts_dir_path, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    post_data = json.load(f)
                    if "id" in post_data and "title" in post_data and "excerpt" in post_data:
                        posts_metadata.append({
                            "id": post_data["id"],
                            "title": post_data["title"],
                            "excerpt": post_data["excerpt"],
                            "tags": post_data.get("tags", [])
                        })
            except Exception as e:
                print(f"Error reading file {filename}: {e}")

    print(f"Loaded {len(posts_metadata)} blog posts metadata.")
    return json.dumps(posts_metadata)


# Tool to save trending posts list
def save_trending_posts_list_tool(trending_posts_data_json: str, output_file_path: str) -> str: 
    """Saves the list of trending post data to a JSON file."""
    try:
        trending_posts_data = json.loads(trending_posts_data_json)
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        with open(output_file_path, "w", encoding="utf-8") as f:
            json.dump(trending_posts_data, f, indent=2)
        return f"Successfully saved trending post data to {output_file_path}"
    except Exception as e:
        return f"Error saving trending posts data to {output_file_path}: {e}"

# Tool to clear the trending posts file
def clear_trending_posts_file_tool(output_file_path: str) -> str:
    """Clears the content of the trending posts JSON file."""
    try:
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        with open(output_file_path, "w", encoding="utf-8") as f:
            json.dump([], f) 
        return f"Successfully cleared {output_file_path}"
    except Exception as e:
        return f"Error clearing {output_file_path}: {e}"

# Tool to save a single trending post entry
def save_trending_post_entry_tool(post_id: str, post_title: str, post_excerpt: str, output_file_path: str) -> str:
    """Appends a single trending post entry to the JSON file."""
    try:
        trending_posts_list = []
        if os.path.exists(output_file_path):
            with open(output_file_path, "r", encoding="utf-8") as f:
                try:
                    trending_posts_list = json.load(f)
                    if not isinstance(trending_posts_list, list):
                        trending_posts_list = []
                except json.JSONDecodeError:
                    trending_posts_list = []

        new_entry = {
            "id": post_id,
            "title": post_title,
            "excerpt": post_excerpt
        }
        trending_posts_list.append(new_entry)

        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        with open(output_file_path, "w", encoding="utf-8") as f:
            json.dump(trending_posts_list, f, indent=2)

        return f"Successfully appended trending post '{post_title}' to {output_file_path}"
    except Exception as e:
        return f"Error appending trending post data to {output_file_path}: {e}"


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

file_clearer_agent = Agent(
    name="file_clearer",
    model=GEMINI_MODEL, # This agent doesn't need complex reasoning, but needs a model
    description="Clears the trending posts JSON file before writing.",
    instruction="Clear the `elijahmondero/public/posts/trending_posts.json` file using the `clear_trending_posts_file_tool`. "
                "Call the tool with the file path `elijahmondero/public/posts/trending_posts.json`. "
                "Indicate completion after the tool call.",
    tools=[clear_trending_posts_file_tool],
    output_key="clear_status"
)

output_writer_agent = Agent(
    name="output_writer",
    model=GEMINI_MODEL,
    description="Saves the list of trending post data to a JSON file by appending each entry.",
    instruction="You will receive a JSON array of trending blog post data (id, title, excerpt): {trending_posts_data_json}. "
                "Iterate through this JSON array. For each item in the array, call the `save_trending_post_entry_tool` with the post's `id`, `title`, `excerpt`, and the output file path `elijahmondero/public/posts/trending_posts.json`. "
                "Ensure you call the tool for every item in the list. "
                "Indicate completion after processing all items.",
    tools=[save_trending_post_entry_tool], # Use the new tool
    output_key="save_status"
)


# Agent chain
pipeline = SequentialAgent(
    name="TrendingPostsUpdatePipeline",
    sub_agents=[
        trending_researcher_agent,
        trending_analyzer_agent,
        post_matcher_agent,
        file_clearer_agent, # Add the clearer agent
        output_writer_agent # Use the modified writer agent
    ]
)

# Runner setup
APP_NAME = "trending_update_app"
USER_ID = "github_actions_user"
SESSION_ID = "daily_run"

session_service = InMemorySessionService()
session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID)
runner = Runner(agent=pipeline, app_name=APP_NAME, session_service=session_service)

# Run the pipeline
def run_trending_update_pipeline():
    print("Gemini ADK Sequential Pipeline: Starting trending posts update process...")
    print("--- ADK Runner Events ---")

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
