import os
import json
import sys
import uuid
import re
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import AzureOpenAI
from langchain_community.tools import DuckDuckGoSearchResults
from typing import List, Union
import google.generativeai as genai

load_dotenv()

# LLM Provider configuration
LLM_PROVIDER = os.getenv("LLM_PROVIDER") # This will be 'gemini' for this script
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro-latest")

# Initialize Google Gemini client
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(GEMINI_MODEL)

# Initialize Azure OpenAI DALL-E client (for image generation)
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
dalle_client = AzureOpenAI(api_key=AZURE_OPENAI_API_KEY, azure_endpoint=AZURE_OPENAI_ENDPOINT, api_version="2024-02-01")


# Scraping tool
def scrape_links(links: Union[str, List[str]]) -> str:
    print("Scraping links:", links)

    if isinstance(links, str):
        try:
            # Check if the string is a single URL
            if links.startswith("http://") or links.startswith("https://"):
                links_list = [links]
            else:
                # Parse the JSON string into a list of URLs
                links_list = json.loads(links)
                if not isinstance(links_list, list) or not all(isinstance(link, str) for link in links_list):
                    raise ValueError("Input must be a JSON string representing a list of strings")
        except json.JSONDecodeError as e:
            raise ValueError("Input must be a valid JSON string representing a list of strings") from e
    elif isinstance(links, list):
        links_list = links
    else:
        raise ValueError("Input must be either a JSON string, a single URL string, or a list of strings")

    scraped_content = []
    for link in links_list:
        try:
            response = requests.get(link, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                text = soup.get_text(separator="\n", strip=True)
                scraped_content.append(text[:5000])  # Limit to 5000 chars per link
            else:
                scraped_content.append(f"Failed to scrape {link}: Status {response.status_code}")
        except requests.exceptions.RequestException as e:
             scraped_content.append(f"Error scraping {link}: {e}")


    return "\n\n".join(scraped_content)

def convert_to_json(json_value: dict) -> str:
    print(json_value)
    return json.dumps(json_value)

# DALL-E image generation
def generate_image(prompt: str) -> str:
    try:
        result = dalle_client.images.generate(model="dall-e-3", prompt=prompt, n=1)
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
            return None
    except Exception as e:
        print(f"Error generating image: {e}")
        return None


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
def review_and_edit_blog_post(content: str) -> str:
    print("Reviewing and editing blog post content: ", content)
    # This function will call the LLM to review and edit the blog post content
    review_edit_prompt = f"Review and edit the following blog post content to ensure it is of good quality and professionally written with markdowns:\n\n{content}"
    try:
        response = gemini_model.generate_content(review_edit_prompt)
        print(response.text)
        return response.text
    except Exception as e:
        print(f"Error during review and edit: {e}")
        return content # Return original content if editing fails


# Blog post generation with Gemini ADK
def generate_blog_post_gemini_adk(prompt):
    try:
        # Define tools in a format compatible with google.generativeai
        gemini_tools = [
            {
                "function_declarations": [
                    {
                        "name": "search_topics",
                        "description": "Searches topics online using DuckDuckGo. Pass the search query as a string.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "query": {
                                    "type": "string",
                                    "description": "The search query."
                                }
                            },
                            "required": ["query"]
                        }
                    },
                    {
                        "name": "scrape_links",
                        "description": "Use this to scrap content from web links. Pass a JSON string representing a list of links.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "links": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "A list of URLs to scrape."
                                }
                            },
                            "required": ["links"]
                        }
                    }
                ]
            }
        ]

        # Define agents and their roles
        # We can simulate agents by defining different prompts and orchestrating calls
        # using the generate_content and tool_code capabilities of the Gemini model.

        researcher_prompt = f"""You are a research assistant for a blog writing team. Your task is to gather comprehensive information about the user's requested topic: "{prompt}".
        Utilize the available tools (search_topics, scrape_links) to find relevant articles, data, and insights.
        Synthesize your findings into a detailed summary that will be used by the writing team.
        Focus on providing factual information and diverse perspectives if available.
        """

        writer_prompt = """You are a skilled blog post writer. Your role is to transform the research findings provided by the research team into a compelling and well-structured blog post.
        Craft an engaging title, a concise excerpt, and detailed content using markdown formatting.
        Ensure the content flows logically and is easy for readers to understand.
        Identify relevant tags for the post and list the sources cited in the research findings as a list of **actual URL links**.
        The final output must be a JSON object with the following keys: "title", "excerpt", "content", "datePosted" (use the current UTC date in ISO format), "postedBy" (Elijah Mondero), "tags" (a list of strings), and "sources" (a list of **strings, where each string is a URL**).
        """

        editor_prompt = """You are a professional blog post editor. Your responsibility is to review the blog post draft created by the writer.
        Check for grammatical errors, spelling mistakes, punctuation issues, and overall clarity and coherence.
        Refine the language to ensure it is polished and engaging.
        Provide ONLY the final, edited version of the blog post content, with no introductory or conversational remarks.
        """

        # Orchestration of the agents
        print("Gemini ADK Multi-Agent: Starting research phase...")
        # Research Agent Interaction
        # Start the chat without passing tools to start_chat
        research_conversation = gemini_model.start_chat()
        # Send the initial message with the prompt and tools available for this turn
        research_response = research_conversation.send_message(researcher_prompt, tools=gemini_tools)

        research_findings = []
        # Process potential tool calls from the researcher
        # Continue the conversation until the research agent provides a final text response
        while True:
             if not research_response.candidates or not research_response.candidates[0].content or not research_response.candidates[0].content.parts:
                 print("Gemini ADK Multi-Agent: Research agent did not provide a valid response.")
                 break # Exit loop if no valid response

             part = research_response.candidates[0].content.parts[0]

             if part.function_call:
                function_call = part.function_call
                function_name = function_call.name
                function_args = {k: v for k, v in function_call.args.items()}

                print(f"Gemini ADK Multi-Agent: Research Agent calling tool: {function_name} with args: {function_args}")

                tool_result = "Error executing tool."
                try:
                    if function_name == "search_topics":
                        tool_result = search_topics(query=function_args.get("query"))
                        # Append search results to research findings
                        research_findings.append(f"Search Results for '{function_args.get('query')}':\n{tool_result}")
                    elif function_name == "scrape_links":
                         links_arg = function_args.get("links")
                         if isinstance(links_arg, str):
                             tool_result = scrape_links(links=[links_arg])
                             # Append scraped content to research findings
                             research_findings.append(f"Scraped Content from '{links_arg}':\n{tool_result}")
                         elif isinstance(links_arg, list):
                             tool_result = scrape_links(links=links_arg)
                             # Append scraped content from multiple links
                             for i, link in enumerate(links_arg):
                                 research_findings.append(f"Scraped Content from '{link}':\n{tool_result.split('Error scraping')[i] if 'Error scraping' in tool_result else tool_result.split('Failed to scrape')[i] if 'Failed to scrape' in tool_result else tool_result.split(chr(10)*2)[i] if chr(10)*2 in tool_result else tool_result}") # Basic split, might need refinement
                             if "Error scraping" in tool_result or "Failed to scrape" in tool_result:
                                  research_findings.append(f"Scraping Errors:\n{tool_result}")

                         else:
                             tool_result = "Error: Invalid input for scrape_links tool."
                             print(tool_result)
                             research_findings.append(f"Tool Error: {tool_result}")
                    else:
                        raise ValueError(f"Unknown tool: {function_name}")
                except Exception as e:
                    tool_result = f"Error executing tool {function_name}: {e}"
                    print(tool_result)
                    research_findings.append(f"Tool Execution Error: {tool_result}")


                print(f"Gemini ADK Multi-Agent: Tool {function_name} returned: {tool_result}")

                # Send the tool result back to the research agent to continue the conversation
                research_response = research_conversation.send_message(
                    genai.protos.ToolCodeResult(
                        invocation_id=research_response.candidates[0].content.parts[0].function_call.invocation_id,
                        result=tool_result
                    )
                )
             elif part.text:
                 # If the research agent responds with text, consider it the final research findings summary
                 research_findings.append(part.text)
                 break # Exit loop when text is received
             else:
                 print("Gemini ADK Multi-Agent: Unexpected part type in research response.")
                 break # Exit loop to avoid infinite loop

        final_research_summary = "\n\n".join(research_findings)
        print("Gemini ADK Multi-Agent: Research phase complete.")
        print("Research Findings:", final_research_summary)

        print("Gemini ADK Multi-Agent: Starting writing phase...")
        # Writing Agent Interaction
        writer_conversation = gemini_model.start_chat()
        # Join the research findings into a single string before sending to the writer
        research_findings_string = "\n\n".join(research_findings)
        writer_response = writer_conversation.send_message(f"{writer_prompt}\n\nResearch Findings:\n{research_findings_string}")
        blog_post_draft_json_string = writer_response.text
        print("Gemini ADK Multi-Agent: Writing phase complete.")
        print("Blog Post Draft (JSON string):", blog_post_draft_json_string)

        # Attempt to parse the JSON string from the writer
        parsed_response = {}
        try:
            # Use regex to extract JSON part
            match = re.search(r'\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}', blog_post_draft_json_string, re.DOTALL)
            if match:
                json_string = match.group(0)
                if json_string:
                    try:
                        parsed_response = json.loads(json_string)
                    except json.JSONDecodeError as e:
                        print(f"JSONDecodeError during parsing writer output: {e}")
                        print("Attempting to fix JSON...")
                        # Attempt to fix the JSON by replacing invalid escape sequences
                        json_string = re.sub(r'\\\s*([^"/\\bfnrt])', r'\1', json_string)
                        try:
                            parsed_response = json.loads(json_string)
                            print("JSON fixed successfully.")
                        except json.JSONDecodeError as e:
                            raise ValueError(f"Could not parse JSON even after fixing: {e}")
                else:
                    raise ValueError("Extracted JSON string is empty from writer output")
            else:
                raise ValueError("Could not find JSON in writer output")
        except Exception as e:
            print(f"Error processing writer output: {e}")
            # If JSON parsing fails, we might still have some text content to work with
            parsed_response["content"] = blog_post_draft_json_string
            parsed_response["title"] = "Generated Blog Post" # Placeholder title
            parsed_response["excerpt"] = "Could not parse excerpt." # Placeholder excerpt
            parsed_response["tags"] = []
            parsed_response["sources"] = []


        print("Gemini ADK Multi-Agent: Starting editing phase...")
        # Editor Agent Interaction
        editor_conversation = gemini_model.start_chat()
        editor_conversation = gemini_model.start_chat()
        edited_content_response = editor_conversation.send_message(f"{editor_prompt}\n\nBlog Post Content Draft:\n{parsed_response.get('content', '')}")
        edited_content = edited_content_response.text
        print("Gemini ADK Multi-Agent: Editing phase complete.")

        edited_content_response = editor_conversation.send_message(f"{editor_prompt}\n\nBlog Post Content Draft:\n{parsed_response.get('content', '')}")
        edited_content = edited_content_response.text
        print("Gemini ADK Multi-Agent: Editing phase complete.")

        # Clean up the edited content to remove conversational text
        cleaned_content = edited_content
        lines = edited_content.splitlines()
        cleaned_lines = []
        start_adding = False

        # Look for the first line that seems like the start of the actual content
        for i, line in enumerate(lines):
            # Check for markdown headers
            if line.strip().startswith("#"):
                cleaned_lines = lines[i:]
                start_adding = True
                break
            # Check for a line that looks like a significant paragraph start (not empty, not too short)
            if len(line.strip()) > 30 and len(line.split()) > 4:
                 # Check if the next line is also substantial, to avoid single-line matches
                 if i + 1 < len(lines) and (len(lines[i+1].strip()) > 30 or lines[i+1].strip().startswith("#")):
                    cleaned_lines = lines[i:]
                    start_adding = True
                    break
            # Check for list items
            if line.strip().startswith("* ") or line.strip().startswith("- ") or re.match(r"^\d+\.\s", line.strip()):
                 cleaned_lines = lines[i:]
                 start_adding = True
                 break


        if not start_adding:
            # If no clear start found, use the fallback of removing common introductory phrases
            cleaned_content = edited_content
            intro_phrases = [
                "Okay, here is the edited version of the blog post content, reviewed for clarity, coherence, grammar, spelling, and punctuation.",
                "***\n\nHere is the edited version of your blog post:",
                "Here is the edited version of your blog post:",
                "**Edited Blog Post Content:**", # Added this based on the last output
                "Okay, here is the edited version"
            ]
            for phrase in intro_phrases:
                if cleaned_content.startswith(phrase):
                    cleaned_content = cleaned_content[len(phrase):].strip()
                    break # Assume only one such phrase at the beginning
        else:
            cleaned_content = "\n".join(cleaned_lines).strip()


        parsed_response["content"] = cleaned_content

        # Remove the title from the content if it exists
        title = parsed_response.get("title", "")
        content = parsed_response.get("content", "")
        if title and content:
            # Remove the title from the beginning of the content
            if content.startswith(title):
                content = content[len(title):].strip()
            # Remove the title from the beginning of the content with markdown header formatting
            if content.startswith("# " + title):
                content = content[len("# " + title):].strip()
            parsed_response["content"] = content

        # Generate image using DALL-E
        image_prompt = parsed_response.get("title", "") + " " + parsed_response.get("excerpt", "")
        image_path = generate_image(image_prompt)
        if image_path:
            parsed_response["image_path"] = image_path

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

    blog_data = generate_blog_post_gemini_adk(prompt)
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
