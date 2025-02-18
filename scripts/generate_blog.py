import os
import json
import sys
import uuid
from datetime import datetime
from langchain_openai import AzureChatOpenAI
from langchain.agents import create_react_agent
from langchain.tools import Tool
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import requests
from bs4 import BeautifulSoup

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
def scrape_links(links):
    scraped_content = []
    for link in links:
        try:
            response = requests.get(link, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                text = soup.get_text(separator="\n", strip=True)
                scraped_content.append(text[:5000])  # Limit to 5000 chars per link
            else:
                scraped_content.append(f"Failed to scrape {link}: Status {response.status_code}")
        except Exception as e:
            scraped_content.append(f"Error scraping {link}: {str(e)}")
    return "\n\n".join(scraped_content)

# Blog post generation
def generate_blog_post(prompt):
    tools = [
        Tool(
            name="scrape",
            func=scrape_links,
            description="Useful for scraping content from web links."
        )
    ]

    # Create agent with structured output
    parser = JsonOutputParser()
    format_instructions = parser.get_format_instructions()

    prompt_template = PromptTemplate(
        template="""
        Generate a blog post in JSON format with the following structure:
        {format_instructions}

        Prompt: {prompt}
        Tools: {tools}
        Tool Names: {tool_names}
        Agent Scratchpad: {agent_scratchpad}
        """,
        input_variables=["prompt", "tools", "tool_names", "agent_scratchpad"],
        partial_variables={"format_instructions": format_instructions}
    )

    agent = create_react_agent(
        llm=llm,
        tools=tools,
        prompt=prompt_template
    )

    response = agent.invoke({"prompt": prompt})
    return parser.parse(response["output"])

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

    post_filename = f"public/posts/{post_id}.json"
    os.makedirs(os.path.dirname(post_filename), exist_ok=True)

    with open(post_filename, "w") as f:
        json.dump(post_data, f, indent=2)

    return post_filename, post_data

# Update blog index
def update_index(post_id, title, excerpt):
    index_file = "public/posts/index.json"
    index_data = []

    if os.path.exists(index_file):
        with open(index_file, "r") as f:
            index_data = json.load(f)

    index_data.append({"id": post_id, "title": title, "excerpt": excerpt})

    with open(index_file, "w") as f:
        json.dump(index_data, f, indent=2)

# Main execution
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_blog.py '<prompt>'")
        sys.exit(1)

    prompt = sys.argv[1]

    try:
        blog_data = generate_blog_post(prompt)
        required_keys = {"title", "excerpt", "fullPost", "tags"}
        
        if not all(key in blog_data for key in required_keys):
            raise ValueError("Generated blog post is missing required fields.")

        post_file, post_data = save_post(
            blog_data["title"],
            blog_data["excerpt"],
            blog_data["fullPost"],
            blog_data["tags"]
        )

        update_index(post_data["id"], blog_data["title"], blog_data["excerpt"])
        print(f"Blog post saved: {post_file}")

    except Exception as e:
        print(f"Error generating blog post: {str(e)}")
        sys.exit(1)