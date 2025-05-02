import os
import json
import sys
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_community.tools import DuckDuckGoSearchResults # Import DuckDuckGo search tool
from typing import List, Dict, Any
from google.adk.agents import Agent, SequentialAgent # Import ADK components
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types # For creating message Content/Parts

load_dotenv()

# LLM Provider configuration
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro-latest")

# Initialize Google Gemini client
if not GOOGLE_GEMINI_API_KEY:
    print("Error: GOOGLE_GEMINI_API_KEY not found in environment variables.")
    sys.exit(1)

genai.configure(api_key=GOOGLE_GEMINI_API_KEY)
try:
    # We don't need to initialize the model here if using ADK agents with model specified
    pass
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    sys.exit(1)

# Configure ADK to use API keys directly
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "False"


# --- Tools ---

# DuckDuckGo search tool
def search_topics(query: str) -> str:
    """Searches for topics using DuckDuckGo."""
    print("Searching for:", query)
    try:
        search_results = DuckDuckGoSearchResults().invoke(query)
        print("Search Results:", search_results)
        return search_results
    except Exception as e:
        print(f"Error during search: {e}")
        return f"Error during search: {e}"

# Basic scraping tool (can be enhanced if needed)
def scrape_link(link: str) -> str:
    """Scrapes content from a given URL."""
    print("Scraping link:", link)
    scraped_content = ""
    try:
        response = requests.get(link, timeout=5) # Reduced timeout
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # Extract text from common content areas (can be refined)
            text = ' '.join(p.get_text() for p in soup.find_all('p'))
            text += ' '.join(h.get_text() for h in soup.find_all(['h1', 'h2', 'h3']))
            scraped_content = text[:2000]  # Limit to 2000 chars for analysis
        else:
            scraped_content = f"Failed to scrape {link}: Status {response.status_code}"
    except requests.exceptions.RequestException as e:
        scraped_content = f"Error scraping {link}: {e}"
    except Exception as e:
        scraped_content = f"An unexpected error occurred while scraping {link}: {e}"
    return scraped_content

# Tool to load blog post metadata
def load_blog_posts_metadata_tool(posts_dir_path: str) -> str: # Return type is string for ADK tool output
    """Loads blog post metadata from individual JSON files."""
    print(f"Loading blog post metadata from {posts_dir_path}...")
    posts_metadata = []
    if not os.path.exists(posts_dir_path):
        print(f"Error: Posts directory not found at {posts_dir_path}")
        return json.dumps([]) # Return empty JSON array string

    for filename in os.listdir(posts_dir_path):
        if filename.endswith(".json") and filename != "index.json" and filename != "trending_posts.json":
            file_path = os.path.join(posts_dir_path, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    post_data = json.load(f)
                    # Ensure required fields are present
                    if "id" in post_data and "title" in post_data and "excerpt" in post_data:
                         # Include tags if available
                        posts_metadata.append({
                            "id": post_data["id"],
                            "title": post_data["title"],
                            "excerpt": post_data["excerpt"],
                            "tags": post_data.get("tags", []) # Get tags, default to empty list if not present
                        })
                    else:
                        print(f"Warning: Skipping malformed post file {filename}")
            except json.JSONDecodeError:
                print(f"Error: Could not decode JSON from {filename}")
            except Exception as e:
                print(f"Error reading file {filename}: {e}")

    print(f"Loaded {len(posts_metadata)} blog posts metadata.")
    # Return as a JSON string because ADK tool outputs are typically strings
    return json.dumps(posts_metadata)


# Tool to save trending posts list
def save_trending_posts_list_tool(trending_post_ids_json: str, output_file_path: str) -> str: # Return type is string for ADK tool output
    """Saves the list of trending post IDs to a JSON file."""
    try:
        trending_post_ids = json.loads(trending_post_ids_json)
        os.makedirs(os.path.dirname(output_file_path), exist_ok=True)
        with open(output_file_path, "w", encoding="utf-8") as f:
            json.dump(trending_post_ids, f, indent=2)
        print(f"Successfully saved trending post IDs to {output_file_path}")
        return f"Successfully saved trending post IDs to {output_file_path}"
    except Exception as e:
        print(f"Error saving trending posts list to {output_file_path}: {e}")
        return f"Error saving trending posts list to {output_file_path}: {e}"


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
    model=GEMINI_MODEL, # Can use a less powerful model if just matching
    description="Matches trending keywords to blog posts based on title, excerpt, and tags.",
    instruction="You will receive a JSON array of trending keywords: {trending_keywords_json}. "
                "Load blog post metadata using the `load_blog_posts_metadata_tool` with the path `elijahmondero/public/posts`. "
                "Your task is to identify which blog posts are relevant to the trending keywords. "
                "Match keywords against the title, excerpt, and tags of each post (case-insensitive). "
                "Generate a JSON array containing the IDs of the matching blog posts. "
                "Limit the output to a maximum of 10 post IDs. "
                "Provide the JSON array of post IDs as your final response. Ensure the output is valid JSON.",
    tools=[load_blog_posts_metadata_tool], # Use tool to load post data
    output_key="trending_post_ids_json"
)

output_writer_agent = Agent(
    name="output_writer",
    model=GEMINI_MODEL, # Can use a less powerful model
    description="Saves the list of trending post IDs to a JSON file.",
    instruction="You will receive a JSON array of trending blog post IDs: {trending_post_ids_json}. "
                "Your task is to save this list to the `elijahmondero/public/posts/trending_posts.json` file using the `save_trending_posts_list_tool`. "
                "Call the tool with the JSON array of IDs and the output file path `elijahmondero/public/posts/trending_posts.json`. "
                "Indicate completion after the tool call.",
    tools=[save_trending_posts_list_tool], # Use tool to save the output
    output_key="save_status"
)


# Agent chain
pipeline = SequentialAgent(
    name="TrendingPostsUpdatePipeline",
    sub_agents=[trending_researcher_agent, trending_analyzer_agent, post_matcher_agent, output_writer_agent]
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
