import os
import json
import sys
import uuid
import re
import asyncio
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import AzureOpenAI
from langchain_community.tools import DuckDuckGoSearchResults
from typing import List, Union
import google.generativeai as genai
from google.adk.agents import Agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types # For creating message Content/Parts

load_dotenv()

# LLM Provider configuration
LLM_PROVIDER = os.getenv("LLM_PROVIDER") # This will be 'gemini' for this script
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro-latest")

# Initialize Google Gemini client
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)


# Configure ADK to use API keys directly (not Vertex AI for this multi-model setup)
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "False"

# Initialize Azure OpenAI DALL-E client (for image generation)
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
dalle_client = AzureOpenAI(api_key=AZURE_OPENAI_API_KEY, azure_endpoint=AZURE_OPENAI_ENDPOINT, api_version="2024-02-01")


# Scraping tool
def scrape_link(link: str) -> str:
    print("Scraping link:", link)

    scraped_content = ""
    try:
        response = requests.get(link, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            text = soup.get_text(separator="\n", strip=True)
            scraped_content = text[:5000]  # Limit to 5000 chars
        else:
            scraped_content = f"Failed to scrape {link}: Status {response.status_code}"
    except requests.exceptions.RequestException as e:
        scraped_content = f"Error scraping {link}: {e}"
    except Exception as e:
        scraped_content = f"An unexpected error occurred while scraping {link}: {e}"

    return scraped_content

def convert_to_json(json_value: dict) -> str:
    print(json_value)
    return json.dumps(json_value)

# DALL-E image generation
def generate_image(prompt: str) -> str:
    retries = 3
    rephrase_attempts = 2 # Limit rephrasing attempts
    current_prompt = prompt

    for attempt in range(retries):
        try:
            result = dalle_client.images.generate(model="dall-e-3", prompt=current_prompt, n=1)
            image_url = json.loads(result.model_dump_json())['data'][0]['url']

            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                image_filename = f"{uuid.uuid4()}.png"
                image_path = os.path.join("elijahmondero/public/posts/images", image_filename)
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                with open(image_path, "wb") as f:
                    f.write(image_response.content)
                return os.path.join("/posts/images", image_filename)  # Return relative path
            else:
                print(f"Error downloading image: {image_response.status_code}")
                # If download fails, try generating again
                if attempt < retries - 1:
                    print(f"Attempt {attempt + 1} failed, retrying...")
                    continue
                else:
                    print("Max retries reached for image download.")
                    return None
        except Exception as e:
            error_message = str(e)
            print(f"Error generating image (Attempt {attempt + 1}): {error_message}")
            if "content_policy_violation" in error_message and attempt < retries - 1:
                print("Content policy violation detected.")
                if rephrase_attempts > 0:
                    print(f"Attempting to rephrase prompt using Gemini (Rephrasing attempts left: {rephrase_attempts})...")
                    rephrase_prompt_text = f"Rephrase the following image generation prompt to avoid content policy violations: {current_prompt}"
                    try:
                        rephrased_response = gemini_model.generate_content(rephrase_prompt_text)
                        rephrased_prompt = rephrased_response.text.strip()
                        if rephrased_prompt and rephrased_prompt != current_prompt:
                            print(f"Prompt rephrased to: {rephrased_prompt}")
                            current_prompt = rephrased_prompt
                            rephrase_attempts -= 1
                            continue # Retry with the new prompt
                        else:
                            print("Gemini returned an empty or identical rephrased prompt.")
                            rephrase_attempts -= 1
                            if rephrase_attempts == 0:
                                print("Max rephrasing attempts reached.")
                                return None # Give up if rephrasing fails
                            else:
                                continue # Try rephrasing again if attempts remain
                    except Exception as gemini_e:
                        print(f"Error rephrasing prompt with Gemini: {gemini_e}")
                        rephrase_attempts -= 1
                        if rephrase_attempts == 0:
                            print("Max rephrasing attempts reached.")
                            return None # Give up if rephrasing fails
                        else:
                            continue # Try rephrasing again if attempts remain
                else:
                    print("Max rephrasing attempts reached.")
                    return None # Give up if rephrasing attempts are exhausted
            else:
                print("Max retries reached or non-content policy violation error.")
                return None
    return None # Return None if all retries fail


# DuckDuckGo search tool
def search_topics(query: str) -> str:
    print("Searching for:", query)
    try:
        search_results = DuckDuckGoSearchResults().invoke(query)
        print(search_results)
        return search_results
    except Exception as e:
        print(f"Error during search: {e}")
        return f"Error during search: {e}"


# Blog post review and editing tool
async def review_and_edit_blog_post(content: str) -> str:
    print("Reviewing and editing blog post content: ", content)
    # This function will call the LLM to review and edit the blog post content
    # using an ADK Agent.
    editor_agent = Agent(
        name="editor_tool_agent",
        model=GEMINI_MODEL,
        description="A professional blog post editor that reviews and refines content.",
        instruction="You are a professional blog post editor. Your responsibility is to review the provided content. "
                    "Check for grammatical errors, spelling mistakes, punctuation issues, and overall clarity and coherence. "
                    "Refine the language to ensure it is polished and engaging. "
                    "Provide ONLY the final, edited version of the content, with no introductory or conversational remarks.",
        tools=[], # No tools needed for editing
    )

    session_service = InMemorySessionService()
    APP_NAME = "blog_editor_tool"
    USER_ID = "tool_user"
    SESSION_ID = "editor_session"

    session = session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID
    )

    runner = Runner(
        agent=editor_agent,
        app_name=APP_NAME,
        session_service=session_service
    )

    review_edit_prompt = f"Review and edit the following content:\n\n{content}"
    edited_content = content # Default to original content in case of error

    try:
        content_obj = types.Content(role='user', parts=[types.Part(text=review_edit_prompt)])
        async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content_obj):
            if event.is_final_response():
                if event.content and event.content.parts:
                    edited_content = event.content.parts[0].text
                elif event.actions and event.actions.escalate:
                    print(f"Editor agent escalated: {event.error_message or 'No specific message.'}")
                break
        print("Review and edit complete.")
        return edited_content
    except Exception as e:
        print(f"Error during review and edit with Agent: {e}")
        return content # Return original content if editing fails


# Blog post generation with Gemini ADK
async def generate_blog_post_gemini_adk(prompt):
    try:
        # Setup Session Service
        session_service = InMemorySessionService()
        APP_NAME = "blog_generation_app"
        USER_ID = "blog_user"
        SESSION_ID = "blog_session"

        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=SESSION_ID
        )

        # Define specialized agents
        researcher = Agent(
            name="researcher",
            model=GEMINI_MODEL,
            description="Gathers comprehensive information about a given topic using search and scraping tools.",
            instruction="You are a research assistant for a blog writing team. Your task is to gather comprehensive information about the user's requested topic. "
                        "Utilize the available tools (search_topics, scrape_link) to find relevant articles, data, and insights. "
                        "Synthesize your findings into a detailed summary that will be used by the writing team. "
                        "Focus on providing factual information and diverse perspectives if available. "
                        "Once research is complete, provide the summary as your final response.",
            tools=[search_topics, scrape_link],
        )

        writer = Agent(
            name="writer",
            model=GEMINI_MODEL,
            description="Transforms research findings into a compelling and well-structured blog post in JSON format.",
            instruction="""You are a skilled blog post writer. Your role is to transform the research findings provided into a compelling and well-structured blog post.
            Craft an engaging title, a concise excerpt, and detailed content using markdown formatting.
            Ensure the content flows logically and is easy for readers to understand.
            Identify relevant tags for the post and list the sources cited in the research findings as a list of **actual URL links**.
            The final output must be a JSON object with the following keys: "title", "excerpt", "content", "datePosted" (use the current UTC date in ISO format), "postedBy" (Elijah Mondero), "tags" (a list of strings), and "sources" (a list of **strings, where each string is a URL**).
            IMPORTANT: The "content" field should contain the main body of the blog post in markdown format and MUST NOT include the blog post title. The title is provided in the "title" field separately.
            Provide the JSON object as your final response.
            """,
            tools=[], # No tools needed for writing
        )

        editor = Agent(
            name="editor",
            model=GEMINI_MODEL,
            description="A professional blog post editor that reviews and refines content.",
            instruction="You are a professional blog post editor. Your responsibility is to review the provided blog post content. "
                        "Check for grammatical errors, spelling mistakes, punctuation issues, and overall clarity and coherence. "
                        "Refine the language to ensure it is polished and engaging. "
                        "Provide ONLY the final, edited version of the content, with no introductory or conversational remarks. "
                        "Provide the edited content as your final response.",
            tools=[], # No tools needed for editing
        )

        # Define the root agent that orchestrates the process
        root_agent = Agent(
            name="blog_orchestrator",
            model=GEMINI_MODEL, # Root agent can use the same or a different model
            description="Orchestrates the blog post generation process by delegating to specialized researcher, writer, and editor agents.",
            instruction="You are the Blog Orchestrator. Your task is to manage the creation of a blog post based on the user's request. "
                        "You have a team of specialized agents: 'researcher', 'writer', and 'editor'. "
                        "Follow these steps:\n"
                        "1. Delegate the initial user request to the 'researcher' agent to gather information.\n"
                        "2. Once the researcher provides the findings, delegate these findings to the 'writer' agent to draft the blog post in JSON format.\n"
                        "3. Once the writer provides the JSON draft, extract the 'content' field and delegate it to the 'editor' agent for review and refinement.\n"
                        "4. Once the editor provides the final content, combine it with the other fields from the writer's JSON output and provide the complete blog post data (including title, excerpt, tags, sources, and edited content) as your final response in a structured format (e.g., a dictionary or JSON string).",
            tools=[], # Root agent primarily delegates, might not need specific tools itself
            sub_agents=[researcher, writer, editor] # Link the specialized agents
        )

        # Setup Runner for the root agent
        runner = Runner(
            agent=root_agent,
            app_name=APP_NAME,
            session_service=session_service
        )

        print("Gemini ADK Multi-Agent Team: Starting blog generation process...")

        # Step 1: Send initial prompt to the root agent (delegates to researcher)
        print("Gemini ADK Multi-Agent Team: Initiating research phase via orchestrator...")
        research_findings = ""
        content_obj = types.Content(role='user', parts=[types.Part(text=prompt)])
        async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content_obj):
             if event.is_final_response():
                if event.content and event.content.parts:
                   research_findings = event.content.parts[0].text
                elif event.actions and event.actions.escalate:
                   print(f"Orchestrator/Researcher agent escalated during research: {event.error_message or 'No specific message.'}")
                   return None # Stop if research fails
                break # Stop after getting the research findings

        print("Gemini ADK Multi-Agent Team: Research phase complete.")
        print("Research Findings:", research_findings)

        if not research_findings:
            print("Gemini ADK Multi-Agent Team: No research findings received. Aborting.")
            return None

        # Step 2: Send research findings back to the root agent (delegates to writer)
        print("Gemini ADK Multi-Agent Team: Initiating writing phase via orchestrator...")
        blog_post_draft_json_string = ""
        content_obj = types.Content(role='user', parts=[types.Part(text=f"Based on the following research findings, draft a blog post in JSON format:\n{research_findings}")])
        async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content_obj):
             if event.is_final_response():
                if event.content and event.content.parts:
                   blog_post_draft_json_string = event.content.parts[0].text
                elif event.actions and event.actions.escalate:
                   print(f"Orchestrator/Writer agent escalated during writing: {event.error_message or 'No specific message.'}")
                   return None # Stop if writing fails
                break # Stop after getting the JSON draft

        print("Gemini ADK Multi-Agent Team: Writing phase complete.")
        print("Blog Post Draft (JSON string):", blog_post_draft_json_string)

        # Attempt to parse the JSON string from the writer
        parsed_response = {}
        json_string = ""
        try:
            # Attempt to find the JSON object within the response text
            first_brace = blog_post_draft_json_string.find('{')
            last_brace = blog_post_draft_json_string.rfind('}')

            if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
                json_string = blog_post_draft_json_string[first_brace : last_brace + 1]
                try:
                    parsed_response = json.loads(json_string)
                    print("JSON parsed successfully.")
                except json.JSONDecodeError as e:
                    print(f"JSONDecodeError during parsing writer output: {e}")
                    print("Attempting to fix JSON...")
                    # Attempt to fix common issues like escaped newlines or extra commas
                    json_string = re.sub(r'\\\n', '', json_string) # Remove escaped newlines
                    json_string = re.sub(r',\s*([}\]])', r'\1', json_string) # Remove trailing commas before } or ]
                    try:
                        parsed_response = json.loads(json_string)
                        print("JSON fixed successfully.")
                    except json.JSONDecodeError as e:
                        raise ValueError(f"Could not parse JSON even after fixing: {e}")
            else:
                raise ValueError("Could not find a valid JSON object in writer output")
        except Exception as e:
            print(f"Error processing writer output: {e}")
            # If JSON parsing fails, we might still have some text content to work with
            # Attempt to extract potential markdown content as a fallback
            content_match = re.search(r'##.*?(\n|$)', blog_post_draft_json_string, re.DOTALL)
            if content_match:
                 parsed_response["content"] = blog_post_draft_json_string[content_match.start():].strip()
            else:
                 parsed_response["content"] = blog_post_draft_json_string.strip() # Use entire output as content fallback

            parsed_response["title"] = "Generated Blog Post" # Placeholder title
            parsed_response["excerpt"] = "Could not parse excerpt." # Placeholder excerpt
            parsed_response["tags"] = []
            parsed_response["sources"] = []

        blog_content_to_edit = parsed_response.get('content', '')
        if not blog_content_to_edit:
             print("Gemini ADK Multi-Agent Team: No content found in writer's draft for editing. Aborting.")
             return None

        # Step 3: Send blog content to the root agent (delegates to editor)
        print("Gemini ADK Multi-Agent Team: Initiating editing phase via orchestrator...")
        edited_content = ""
        content_obj = types.Content(role='user', parts=[types.Part(text=f"Review and edit the following blog post content:\n{blog_content_to_edit}")])
        async for event in runner.run_async(user_id=USER_ID, session_id=SESSION_ID, new_message=content_obj):
             if event.is_final_response():
                if event.content and event.content.parts:
                   edited_content = event.content.parts[0].text
                elif event.actions and event.actions.escalate:
                   print(f"Orchestrator/Editor agent escalated during editing: {event.error_message or 'No specific message.'}")
                   # Continue with unedited content if editing fails
                   edited_content = blog_content_to_edit
                break # Stop after getting the edited content

        print("Gemini ADK Multi-Agent Team: Editing phase complete.")

        # Step 4: Combine results and return
        parsed_response["content"] = edited_content

        # Generate image using DALL-E (This part remains outside the ADK agent flow for now)
        image_prompt = parsed_response.get("title", "") + " " + parsed_response.get("excerpt", "")
        image_path = generate_image(image_prompt)
        if image_path:
            parsed_response["image_path"] = image_path

        print("Gemini ADK Multi-Agent Team: Blog generation process complete.")
        return parsed_response

    except Exception as e:
        print(f"Error generating blog post with Gemini ADK: {str(e)}")
        return None

def generate_slug(title: str) -> str:
    # Convert to lowercase
    slug = title.lower()
    # Remove non-alphanumeric characters (except for hyphens and spaces)
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    # Replace spaces and hyphens with a single hyphen
    slug = re.sub(r'[\s-]+', '-', slug)
    # Trim hyphens from the start and end
    slug = slug.strip('-')
    return slug

# Save blog post to file
def save_post(title, excerpt, content, tags, sources, image_path=None):
    post_id = generate_slug(title)
    post_date = datetime.utcnow().isoformat() + "Z"

    post_data = {
        "id": post_id,
        "title": title,
        "excerpt": excerpt,
        "content": content,
        "datePosted": post_date,
        "postedBy": "Elijah Mondero",
        "tags": tags,
        "sources": sources,
        "image_path": image_path
    }

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    post_filename = os.path.join(repo_root, "elijahmondero/public/posts", f"{post_id}.json")
    print("Post filename:", post_filename)
    os.makedirs(os.path.dirname(post_filename), exist_ok=True)

    with open(post_filename, "w") as f:
        json.dump(post_data, f, indent=2)

    return post_filename, post_data

# Update blog index
def update_index(post_id, title, excerpt):
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    index_file = os.path.join(repo_root, "elijahmondero/public/posts/index.json")
    print("Index file:", index_file)
    index_data = []

    if os.path.exists(index_file):
        try:
            with open(index_file, "r") as f:
                index_data = json.load(f)
        except json.JSONDecodeError:
            print(f"Warning: Could not decode JSON from {index_file}. Starting with an empty index.")
            index_data = []


    # Insert the new blog post at the beginning of the list
    index_data.insert(0, {"id": post_id, "title": title, "excerpt": excerpt})

    with open(index_file, "w") as f:
        json.dump(index_data, f, indent=2)

# Update sitemap
def update_sitemap(post_id, post_date):
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    sitemap_file = os.path.join(repo_root, "elijahmondero/public/sitemap.xml")
    print("Sitemap file:", sitemap_file)

    new_url = f"https://elijahmondero.github.io/post/{post_id}"
    post_date = post_date.split("T")[0]  # Extract the date in YYYY-MM-DD format
    new_entry = f"""
  <sitemap>
    <loc>{new_url}</loc>
    <lastmod>{post_date}</lastmod>
  </sitemap>"""

    if os.path.exists(sitemap_file):
        with open(sitemap_file, "r") as f:
            sitemap_data = f.read()
        
        # Find the position to insert the new URL
        insert_pos = sitemap_data.rfind("</sitemapindex>")
        if insert_pos != -1:
            sitemap_data = sitemap_data[:insert_pos] + new_entry + sitemap_data[insert_pos:]

        with open(sitemap_file, "w") as f:
            f.write(sitemap_data)
    else:
        # Create a new sitemap file if it doesn't exist
        sitemap_data = f"""<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{new_entry}
</sitemapindex>"""
        with open(sitemap_file, "w") as f:
            f.write(sitemap_data)


# Main execution
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_blog_adk_gemini.py '<prompt>'")
        sys.exit(1)

    prompt = sys.argv[1]

    # Run the async blog generation function
    blog_data = asyncio.run(generate_blog_post_gemini_adk(prompt))

    required_keys = {"title", "excerpt", "content", "tags"}

    print(blog_data)

    if blog_data is None or not all(key in blog_data and blog_data[key] is not None for key in required_keys):
        print("Error: Generated blog post is missing required fields or generation failed.")
        sys.exit(1)


    post_file, post_data = save_post(
        blog_data["title"],
        blog_data["excerpt"],
        blog_data["content"],
        blog_data["tags"],
        blog_data.get("sources", []),
        blog_data.get("image_path")
    )

    update_index(post_data["id"], blog_data["title"], blog_data["excerpt"])
    update_sitemap(post_data["id"], post_data["datePosted"])
    print(f"Blog post saved: {post_file}")
    # Construct PR details
    pr_title = blog_data.get("title", "New Blog Post")
    pr_excerpt = blog_data.get("excerpt", "No excerpt available.")
    pr_content = blog_data.get("content", "No content available.")

    pr_body = f"# {pr_title}\n\n{pr_excerpt}\n\n{pr_content}"

    # Create a slug from the title for the branch name
    title_slug = re.sub(r'[^a-z0-9]+', '-', pr_title.lower()).strip('-')
    branch_name = f"blog-{title_slug}"

    # Write PR details to GITHUB_ENV
    with open(os.environ['GITHUB_ENV'], 'a') as env_file:
        env_file.write(f"PR_TITLE={pr_title}\n")
        env_file.write(f"BRANCH_NAME={branch_name}\n")
        # Use a delimiter for multi-line body
        env_file.write("PR_BODY<<EOF\n")
        env_file.write(pr_body)
        env_file.write("EOF\n")
