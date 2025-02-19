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

load_dotenv()

# Azure OpenAI configuration
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
MODEL = "gpt-4o"  # Update with your Azure deployment name

# Initialize Azure OpenAI client
llm = AzureChatOpenAI(
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_API_KEY,
    api_version="2024-05-01-preview",
    deployment_name=MODEL,
    temperature=0.7
)

# Scraping tool
def scrape_links(links: str) -> str:
    try:
        # Parse the JSON string into a list of URLs
        links_list = json.loads(links)
        if not isinstance(links_list, list) or not all(isinstance(link, str) for link in links_list):
            raise ValueError("Input must be a JSON string representing a list of strings")
    except json.JSONDecodeError as e:
        raise ValueError("Input must be a valid JSON string representing a list of strings") from e

    scraped_content = []
    print(links)
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
    return json.dumps(json_value)

# Blog post generation
def generate_blog_post(prompt):
    tools = [
        Tool(
            name="scrape",
            func=scrape_links,
            description="Useful for scraping content from web links. You need to pass http links as a list."
        ),
        Tool(
            name="blog_json",
            func=convert_to_json,
            description="Converts blog post into json. Pass title, excerpt, fullPost, datePosted, postedBy, tags and sources. Always use this."
        )
    ]

    agent = create_react_agent(
        llm=llm,
        tools=tools,
        prompt=hub.pull("hwchase17/react")
    )

    agent_executor = AgentExecutor(agent=agent, tools=tools, handle_parsing_errors=True)

    prompt = f"{prompt}. Use the tool blog_json to convert the blog post into JSON format and return this output."

    response = agent_executor.invoke({"input": prompt})

    print("Raw LLM output:", response)

    try:
        # Strip the prefix if it exists
        output = response["output"].strip()
        if output.startswith("```json"):
            output = output[7:].strip()
        if output.endswith("```"):
            output = output[:-3].strip()

        parsed_response = json.loads(output)
        return parsed_response
    except json.JSONDecodeError as e:
        print(f"Error parsing LLM output: {str(e)}")
        print("LLM output that caused the error:", response["output"])
        return None

# Save blog post to file
def save_post(title, excerpt, full_post, tags):
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
        "sources": []
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
        blog_data["tags"]
    )

    update_index(post_data["id"], blog_data["title"], blog_data["excerpt"])
    update_sitemap(post_data["id"])
    print(f"Blog post saved: {post_file}")