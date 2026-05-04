import os
import json
import sys
import uuid
import re
import asyncio
import time
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from ddgs import DDGS
from typing import List, Union, Dict
import google.generativeai as genai
from google.genai import Client, types as genai_types
from google.adk.agents import Agent, SequentialAgent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types # For creating message Content/Parts

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# LLM Provider configuration
LLM_PROVIDER = os.getenv("LLM_PROVIDER") 
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash") 

# Initialize Google Gemini clients
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)
rephrase_model = genai.GenerativeModel(GEMINI_MODEL)
gemini_client = Client(api_key=GOOGLE_GEMINI_API_KEY) # For Imagen 3


# Configure ADK to use API keys directly
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "False"


# Scraping tool with exponential backoff
def scrape_link(link: str) -> str:
    """Scrapes the content of a given URL and returns the text. Includes exponential backoff."""
    print(f"Attempting to scrape: {link}")
    max_retries = 3
    delay = 5
    for attempt in range(max_retries):
        try:
            response = requests.get(link, timeout=15)
            # If rate limited or server error, trigger retry
            if response.status_code == 429 or 500 <= response.status_code < 600:
                print(f"Scrape rate limited or server error ({response.status_code}) for {link}. Attempt {attempt+1}/{max_retries}. Retrying in {delay}s...")
                time.sleep(delay)
                delay *= 2
                continue

            response.raise_for_status() 
            soup = BeautifulSoup(response.content, 'html.parser')

            # Attempt to find common article content containers
            article_text = ""
            for tag in ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']:
                 for element in soup.find_all(tag):
                     article_text += element.get_text(separator=' ', strip=True) + '\n'

            # Fallback if specific tags don't yield much
            if not article_text.strip():
                 article_text = soup.get_text(separator=' ', strip=True)

            print(f"Scraped content length: {len(article_text)}")
            return article_text.strip()[:8000] # Increased limit to 8000

        except requests.exceptions.RequestException as e:
            print(f"Request error for {link} (attempt {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2
            else:
                return f"Error scraping {link} after {max_retries} attempts: {e}"
        except Exception as e:
            print(f"An unexpected error occurred during scraping {link}: {e}")
            return f"Error scraping {link}: {e}"
    
    return f"Failed to scrape {link} after {max_retries} attempts."

# Gemini (Imagen 3) image generation
def generate_image(prompt: str) -> str:
    """Generates an image using Gemini's Imagen 3 model."""
    if not GOOGLE_GEMINI_API_KEY:
        print("Gemini API Key not found. Skipping image generation.")
        return None
        
    retries = 3
    rephrase_attempts = 2 
    current_prompt = prompt

    for attempt in range(retries):
        try:
            print(f"Generating image with Gemini (Imagen 3). Attempt {attempt+1}/{retries}...")
            # Use imagen-4.0-generate-001 for high quality image generation
            response = gemini_client.models.generate_images(
                model='imagen-4.0-generate-001',
                prompt=current_prompt,
                config=genai_types.GenerateImagesConfig(
                    number_of_images=1,
                    include_rai_reason=True,
                    output_mime_type='image/png'
                )
            )

            if response.generated_images:
                image_data = response.generated_images[0].image.image_bytes
                image_filename = f"{uuid.uuid4()}.png"
                image_path = os.path.join("elijahmondero/public/posts/images", image_filename)
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                
                with open(image_path, "wb") as f:
                    f.write(image_data)
                
                print(f"Image generated and saved to {image_path}")
                return os.path.join("/posts/images", image_filename).replace('\\', '/')
            else:
                print(f"No image generated. RAI reason: {response.generated_images[0].rai_filter_reason if response.generated_images else 'Unknown'}")
                if attempt < retries - 1:
                    continue
                else:
                    return None
        except Exception as e:
            error_message = str(e)
            print(f"Error generating image (Attempt {attempt + 1}): {error_message}")
            if ("content" in error_message.lower() or "policy" in error_message.lower()) and attempt < retries - 1:
                if rephrase_attempts > 0:
                    print("Prompt might have violated policy. Rephrasing...")
                    rephrase_prompt_text = f"Rephrase the following image generation prompt to be safe and descriptive for a blog post: {current_prompt}"
                    try:
                        rephrased_response = rephrase_model.generate_content(rephrase_prompt_text)
                        rephrased_prompt = rephrased_response.text.strip()
                        if rephrased_prompt and rephrased_prompt != current_prompt:
                            current_prompt = rephrased_prompt
                            rephrase_attempts -= 1
                            continue 
                    except Exception as rephrase_err:
                        print(f"Rephrase failed: {rephrase_err}")
                        rephrase_attempts -= 1
                        continue
            else:
                if attempt < retries - 1:
                    time.sleep(5)
                    continue
                return None
    return None 


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

def generate_slug(title: str) -> str:
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    return slug[:50]

# Save blog post to file as Markdown with frontmatter and YAML validation
def save_post(title: str, excerpt: str, content: str, tags: List[str], sources: List[Union[str, Dict[str, str]]], image_path: str = None):
    post_id = generate_slug(title)
    post_date = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')

    authors_yaml = "  - name: 'Elijah Mondero'" # Default author

    # Format tags as a YAML list
    tags_yaml_list = ""
    if tags:
        tags_yaml_list = "\n" + "\n".join(["  - \"{}\"".format(tag.replace('"', '\\"')) for tag in tags])

    # Format sources as a YAML list (handles both string and dict formats)
    sources_yaml_list = ""
    if sources:
        sources_yaml_list = "\nsources:"
        for source in sources:
            if isinstance(source, dict):
                url = source.get('url', '').replace('"', '\\"')
                src_title = source.get('title', 'Untitled').replace('"', '\\"')
                sources_yaml_list += f'\n  - url: "{url}"\n    title: "{src_title}"'
            else:
                url = str(source).replace('"', '\\"')
                sources_yaml_list += f'\n  - "{url}"'

    img_path_yaml = f'\nimage_path: "{image_path}"' if image_path else ""

    # Prepare escaped values to avoid backslashes in f-string expressions
    escaped_title = title.replace('"', '\\"')
    escaped_excerpt = excerpt.replace('"', '\\"')

    frontmatter_str = f"""---\ntitle: \"{escaped_title}\"\nauthors:\n{authors_yaml}\ndate: \"{post_date}\"\nsummary: \"{escaped_excerpt}\"\ntags:{tags_yaml_list}{sources_yaml_list}{img_path_yaml}\n---\n\n"""

    # Combine frontmatter and content
    markdown_content = frontmatter_str + content.strip() + "\n"

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    post_filename = os.path.join(repo_root, "elijahmondero/posts", f"{post_id}.md")
    os.makedirs(os.path.dirname(post_filename), exist_ok=True)

    with open(post_filename, "w", encoding="utf-8") as f:
        f.write(markdown_content)

    return post_id, {"date": post_date, "title": title, "excerpt": excerpt}

# Update blog index (still generates index.json, but will be based on MD files later)
def update_index(post_id: str, title: str, excerpt: str):
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    # Keep index.json in public/posts for now, as the frontend reads it
    index_file = os.path.join(repo_root, "elijahmondero/public/posts/index.json")
    print("Index file:", index_file)
    index_data = []

    if os.path.exists(index_file):
        try:
            with open(index_file, "r", encoding="utf-8") as f:
                index_data = json.load(f)
        except json.JSONDecodeError:
            print(f"Warning: Could not decode JSON from {index_file}. Starting with an empty index.")
            index_data = []

    # Check if post_id already exists and remove it to update
    index_data = [post for post in index_data if post.get("id") != post_id]

    # Insert the new blog post at the beginning of the list
    index_data.insert(0, {"id": post_id, "title": title, "excerpt": excerpt})

    with open(index_file, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2)

# Update sitemap
def update_sitemap(post_id: str, post_date: str):
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sitemap_file = os.path.join(repo_root, "elijahmondero/public/sitemap.xml")
    print("Sitemap file:", sitemap_file)

    new_url = f"https://elijahmondero.github.io/post/{post_id}"
    # Ensure date is in YYYY-MM-DD format
    try:
        # Parse ISO format and reformat
        date_obj = datetime.fromisoformat(post_date.replace('Z', '+00:00'))
        formatted_date = date_obj.strftime('%Y-%m-%d')
    except ValueError:
        print(f"Warning: Could not parse date format {post_date}. Using current date for sitemap.")
        formatted_date = datetime.utcnow().strftime('%Y-%m-%d')

    new_entry = f"""
  <url>
    <loc>{new_url}</loc>
    <lastmod>{formatted_date}</lastmod>
  </url>""" # Changed from <sitemap> to <url> as per standard sitemap.xml structure

    if os.path.exists(sitemap_file):
        with open(sitemap_file, "r", encoding="utf-8") as f:
            sitemap_data = f.read()

        # Check if the URL already exists and replace it
        url_pattern = re.compile(rf"<loc>{re.escape(new_url)}</loc>.*?<\/url>", re.DOTALL)
        if url_pattern.search(sitemap_data):
             print(f"URL {new_url} already exists in sitemap. Replacing entry.")
             sitemap_data = url_pattern.sub(new_entry, sitemap_data)
        else:
            # Find the position to insert the new URL before the closing </urlset> tag
            insert_pos = sitemap_data.rfind("</urlset>")
            if insert_pos != -1:
                sitemap_data = sitemap_data[:insert_pos] + new_entry + sitemap_data[insert_pos:]
            else:
                 # If </urlset> not found, append to the end (less ideal)
                 sitemap_data += new_entry


        with open(sitemap_file, "w", encoding="utf-8") as f:
            f.write(sitemap_data)
    else:
        # Create a new sitemap file if it doesn't exist
        sitemap_data = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{new_entry}
</urlset>""" # Changed root element to <urlset>
        with open(sitemap_file, "w", encoding="utf-8") as f:
            f.write(sitemap_data)

# New function to consolidate publishing steps
def publish_blog_post(title: str, excerpt: str, content: str, tags: List[str], sources: List[str]) -> str:
    """Consolidates all blog post publishing steps."""
    try:
        # Generate image
        image_prompt = title + " " + excerpt
        image_path = generate_image(image_prompt)

        # Save blog post to file (now saves as .md)
        post_id, post_data = save_post(
            title,
            excerpt,
            content, # Use edited content
            tags,
            sources,
            image_path
        )

        # Update blog index (still updates index.json)
        update_index(post_id, title, excerpt)

        # Update sitemap
        update_sitemap(post_id, post_data["date"])

        # Construct and write PR details to GITHUB_ENV
        pr_title = title
        pr_excerpt = excerpt
        pr_content = content # Use edited content for PR body

        pr_body = f"# {pr_title}\n\n{pr_excerpt}\n\n{pr_content}\n\n"

        # Create a slug from the title for the branch name
        title_slug = re.sub(r'[^a-z0-9]+', '-', pr_title.lower()).strip('-')
        branch_name = f"blog-{title_slug}"

        # Write PR details to GITHUB_ENV
        # Check if GITHUB_ENV is available (e.g., running in GitHub Actions)
        if 'GITHUB_ENV' in os.environ:
            with open(os.environ['GITHUB_ENV'], 'a') as env_file:
                env_file.write(f"PR_TITLE={pr_title}\n")
                env_file.write(f"BRANCH_NAME={branch_name}\n")
                # Use a delimiter for multi-line body
                env_file.write("PR_BODY<<EOF\n")
                env_file.write(pr_body)
                env_file.write("EOF\n")
            print("PR details written to GITHUB_ENV.")
        else:
            print("GITHUB_ENV not available. PR details not written.")
            print(f"PR Title: {pr_title}")
            print(f"Branch Name: {branch_name}")
            print(f"PR Body:\n{pr_body}")


        return "Blog post published successfully."

    except Exception as e:
        print(f"Error during publishing: {e}")
        return f"Error during publishing: {e}"

# Define agents for the SequentialAgent pipeline
researcher_agent = Agent(
    name="researcher",
    model=GEMINI_MODEL,
    description="Gathers comprehensive information about a given topic using search and scraping tools.",
    instruction="You are a research assistant for a blog writing team. Your task is to gather comprehensive information about the user's requested topic. "
                "Utilize the available tools (search_topics, scrape_link) to find relevant articles, data, and insights. "
                "Synthesize your findings into a detailed summary that will be used by the writing team. "
                "Focus on providing factual information and diverse perspectives if available. "
                "Once research is complete, provide the summary as your final response.",
    tools=[search_topics, scrape_link],
    output_key="research_findings"
)

writer_agent = Agent(
    name="writer",
    model=GEMINI_MODEL,
    description="Transforms research findings into a compelling and well-structured blog post.",
    instruction="""You are a skilled blog post writer. Your role is to transform the research findings provided into a compelling and well-structured blog post.
    Craft an engaging title, a concise excerpt, and detailed content using markdown formatting.
    Ensure the content flows logically and is easy for readers to understand.
    Identify relevant tags for the post and list the sources cited in the research findings as a list of **actual URL links**.
    
    The final output should be a dictionary containing the following keys: "title", "excerpt", "content" (in markdown), "tags" (list of strings), and "sources" (list of strings).
    Provide the dictionary as your final response.
    
    **Research Findings:**
    {research_findings}
    """,
    tools=[],
    output_key="blog_post_data"
)

editor_agent = Agent(
    name="editor",
    model=GEMINI_MODEL,
    description="A professional blog post editor that reviews and refines content.",
    instruction="""You are a professional blog post editor. Your responsibility is to review and refine the provided blog post content (in markdown).
    Check for grammatical errors, spelling mistakes, punctuation issues, and overall clarity and coherence.
    Refine the language to ensure it is polished and engaging. Remove the title in the content if it is present.
    Provide ONLY the final, edited version of the content (in markdown), with no introductory or conversational remarks.
    
    **Blog Post Content to Edit:**
    {blog_post_data.content}
    """,
    tools=[],
    output_key="edited_content_string"
)

publisher_agent = Agent(
    name="publisher",
    model=GEMINI_MODEL, # Publisher might not need a powerful model, or could be a tool-using agent
    description="Publishes the final blog post using a consolidated publishing tool.",
    instruction="""You are the blog post publisher. Your task is to finalize and publish the blog post using the `publish_blog_post` tool.
    You have access to the blog post data from the writer and the edited content from the editor.
    
    Call the `publish_blog_post` tool with the following arguments:
    - `title`: The blog post title from the writer's output (`blog_post_data.title`).
    - `excerpt`: The blog post excerpt from the writer's output (`blog_post_data.excerpt`).
    - `content`: The edited blog post content from the editor's output (`edited_content_string`).
    - `tags`: The list of tags from the writer's output (`blog_post_data.tags`).
    - `sources`: The list of sources from the writer's output (`blog_post_data.sources`).

    Example tool call:
    `publish_blog_post(title=blog_post_data.title, excerpt=blog_post_data.excerpt, content=edited_content_string, tags=blog_post_data.tags, sources=blog_post_data.sources)`

    After successfully calling the tool, indicate completion once all steps are finished by stating "Blog post published successfully."
    """,
    tools=[publish_blog_post], # Consolidated publishing tool
    output_key="publishing_status"
)

# Agent chain
pipeline = SequentialAgent(
    name="BlogGenerationPipeline",
    sub_agents=[researcher_agent, writer_agent, editor_agent, publisher_agent]
)

# Runner setup
APP_NAME = "blog_generation_app"
USER_ID = "blog_user"
SESSION_ID = "blog_session"

session_service = InMemorySessionService()
runner = Runner(agent=pipeline, app_name=APP_NAME, session_service=session_service)

# Run the pipeline
async def run_blog_generation_pipeline(prompt: str):
    print("Gemini ADK Sequential Pipeline: Starting blog generation process...")
    print("--- ADK Runner Events ---")
    content = types.Content(role="user", parts=[types.Part(text=prompt)])

    # create_session can be sync or async depending on the ADK version
    result = session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID)
    if asyncio.iscoroutine(result):
        await result

    try:
        # Use run_async and async for
        events = runner.run_async(
            user_id=USER_ID,
            session_id=SESSION_ID,
            new_message=content
        )

        final_response_text = "Pipeline finished without final response"
        async for event in events:
            print(event)
            if event.is_final_response():
                final_response_text = event.content.parts[0].text
                print("\n📢 Final Publishing Status:\n", final_response_text)

        print("--- End of ADK Runner Events ---")
        print("Gemini ADK Sequential Pipeline: Pipeline complete.")

    except Exception as e:
        print(f"Error running pipeline: {e}")
        # Handle potential errors during the async run


# Main execution
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_blog_adk_gemini.py '<prompt>'")
        sys.exit(1)

    prompt = sys.argv[1]
    # Use asyncio.run to execute the async function
    asyncio.run(run_blog_generation_pipeline(prompt))
