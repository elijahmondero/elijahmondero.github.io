import os
import json
import sys
import uuid
from datetime import datetime
from langchain_openai import AzureChatOpenAI
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from langchain import hub
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import AzureOpenAI
from langchain_community.tools import DuckDuckGoSearchResults
from typing import Any, Dict, List, Union
from langchain_core.callbacks import BaseCallbackHandler
from langchain_core.messages import BaseMessage
from langchain_core.outputs import LLMResult

load_dotenv()

# Azure OpenAI configuration
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
MODEL = os.getenv("LLM_MODEL", "gpt-4o")

# Initialize Azure OpenAI client
llm = AzureChatOpenAI(
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-05-01-preview",
    deployment_name=MODEL
)

# Initialize Azure OpenAI DALL-E client
dalle_client = AzureOpenAI(api_key=AZURE_OPENAI_API_KEY, azure_endpoint=AZURE_OPENAI_ENDPOINT, api_version="2024-02-01")

# Custom callback handler
class LoggingHandler(BaseCallbackHandler):
    def on_chat_model_start(
        self, serialized: Dict[str, Any], messages: List[List[BaseMessage]], **kwargs
    ) -> None:
        print("Chat model started")

    def on_llm_end(self, response: LLMResult, **kwargs) -> None:
        print(f"Chat model ended, response: {response}")

    def on_chain_start(
        self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs
    ) -> None:
        print(f"Chain {serialized.get('name')} started")

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs) -> None:
        print(f"Chain ended, outputs: {outputs}")

callbacks = [LoggingHandler()]

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
        response = requests.get(link, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            text = soup.get_text(separator="\n", strip=True)
            scraped_content.append(text[:5000])  # Limit to 5000 chars per link
        else:
            scraped_content.append(f"Failed to scrape {link}: Status {response.status_code}")
    
    return "\n\n".join(scraped_content)

def convert_to_json(json_value: dict) -> str:
    print(json_value)
    return json.dumps(json_value)

# DALL-E image generation
def generate_image(prompt: str) -> str:
    result = dalle_client.images.generate(model="dall-e-3", prompt=prompt, n=1)
    image_url = json.loads(result.model_dump_json())['data'][0]['url']
    
    image_response = requests.get(image_url)
    if image_response.status_code == 200:
        image_filename = f"{uuid.uuid4()}.png"
        image_path = os.path.join("elijahmondero/public/posts/images", image_filename)
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        with open(image_path, "wb") as f:
            f.write(image_response.content)
        return os.path.join("../posts/images", image_filename)  # Return relative path
    else:
        print(f"Error downloading image: {image_response.status_code}")
        return None

# DuckDuckGo search tool
def search_topics(query: str) -> str:
    print("Searching for:", query)
    search_results = DuckDuckGoSearchResults().invoke(query, config={"callbacks": callbacks})
    print(search_results)
    return search_results

# Blog post review and editing tool
def review_and_edit_blog_post(content: str) -> str:
    print("Reviewing and editing blog post content: ", content)
    # This function will call the LLM to review and edit the blog post content
    review_edit_prompt = f"Review and edit the following blog post content to ensure it is of good quality and professionally written with markdowns:\n\n{content}"
    response = llm.invoke(review_edit_prompt, config={"callbacks": callbacks})
    print(response)
    return response.content

# Blog post generation
def generate_blog_post(prompt):
    tools = [
        Tool(
            name="search",
            func=search_topics,
            description="Searches topics online using DuckDuckGo. Pass the search query as a string."
        ),
        Tool(
            name="scrape",
            func=scrape_links,
            description="Use this to scrap content from web links. Pass a single link."
        ),
        # Tool(
        #     name="review_edit",
        #     func=review_and_edit_blog_post,
        #     description="Reviews and edits the blog post content to ensure it is of good quality and professionally written. Pass the content as a string."
        # ),
        # Tool(
        #     name="blog_json",
        #     func=convert_to_json,
        #     description="Converts blog post into json. Pass json {title, excerpt, fullPost, datePosted, postedBy, tags, sources}. Always use this."
        # )
    ]

    agent = create_react_agent(
        llm=llm,
        tools=tools,
        prompt=hub.pull("hwchase17/react")
    )

    agent_executor = AgentExecutor(agent=agent, tools=tools, handle_parsing_errors=True)

    prompt = f"{prompt}. The result should be json with properties title, excerpt, fullPost with markdowns, datePosted, postedBy, tags, sources."

    response = agent_executor.invoke({"input": prompt}, config={"callbacks": callbacks})

    print("Raw LLM output:", response)

    try:
        # Strip the prefix if it exists
        output = response["output"].strip()
        if output.startswith("```json"):
            output = output[7:].strip()
        if output.endswith("```"):
            output = output[:-3].strip()

        parsed_response = json.loads(output)
        
        # Generate image using DALL-E
        image_prompt = parsed_response.get("title", "") + " " + parsed_response.get("excerpt", "")
        image_path = generate_image(image_prompt)
        if image_path:
            parsed_response["image_path"] = image_path
        
        return parsed_response
    except json.JSONDecodeError as e:
        print(f"Error parsing LLM output: {str(e)}")
        print("LLM output that caused the error:", response["output"])
        return None

# Save blog post to file
def save_post(title, excerpt, full_post, tags, sources, image_path=None):
    post_id = str(uuid.uuid4())[:8]
    post_date = datetime.utcnow().isoformat() + "Z"

    post_data = {
        "id": post_id,
        "title": title,
        "excerpt": excerpt,
        "fullPost": full_post,
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
        with open(index_file, "r") as f:
            index_data = json.load(f)

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
        print("Usage: python generate_blog.py '<prompt>'")
        sys.exit(1)

    prompt = sys.argv[1]

    # try:
    blog_data = generate_blog_post(prompt)
    required_keys = {"title", "excerpt", "fullPost", "tags"}

    print(blog_data)
    
    if not all(key in blog_data for key in required_keys):
        raise ValueError("Generated blog post is missing required fields.")

    post_file, post_data = save_post(
        blog_data["title"],
        blog_data["excerpt"],
        blog_data["fullPost"],
        blog_data["tags"],
        blog_data.get("sources", []),
        blog_data.get("image_path")
    )

    update_index(post_data["id"], blog_data["title"], blog_data["excerpt"])
    update_sitemap(post_data["id"], post_data["datePosted"])
    print(f"Blog post saved: {post_file}")