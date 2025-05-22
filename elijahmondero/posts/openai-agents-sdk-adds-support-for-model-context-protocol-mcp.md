---
title: "OpenAI Agents SDK Adds Support for Model Context Protocol (MCP)"
authors:
  - name: 'Elijah Mondero'
date: "2025-03-27T07:27:18.506108Z"
summary: "OpenAI recently announced the integration of Model Context Protocol (MCP) into their Agents SDK. This addition bridges the gap between AI models and various data sources, making AI development more efficient and versatile."
tags:
  - "OpenAI"
  - "Model Context Protocol"
  - "Agents SDK"
  - "AI Development"
image_path: "/posts/images/b83ba0c9-4e21-4ef7-b5c9-2c7f00c832aa.png"
---

The OpenAI Agents SDK has recently integrated support for the Model Context Protocol (MCP), a significant advancement that bridges the gap between large language models (LLMs) and various data sources and tools. This article delves into the specifics of MCP, its implementations, and the potential benefits it brings to AI development.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol designed to standardize how applications provide context to LLMs. Similar to how USB-C standardizes connections between devices and peripherals, MCP provides a consistent way to connect AI models to different tools and data sources. This standardization simplifies the process of providing context to AI applications, enhancing their ability to perform complex tasks using external data and tools.

## Implementing MCP in Agents SDK

The integration of MCP into the OpenAI Agents SDK means developers can now leverage a wide range of MCP servers to equip their AI agents with various tools. MCP servers can be categorized into two types based on their transport mechanism:

- **stdio servers:** These servers run as a subprocess of your application, meaning they operate locally.
- **HTTP over SSE servers:** These servers run remotely and are accessed through a URL.

Developers can use the `MCPServerStdio` and `MCPServerSse` classes to connect to these servers and incorporate their tools into AI agents.

### Using MCP Servers

MCP servers can be seamlessly added to agents in the SDK. Each time the agent runs, it queries the MCP server for a list of available tools, ensuring the LLM is aware of all the functionalities provided by the server. Here’s an example of integrating an MCP server:

```python
agent = Agent(
    name="Assistant",
    instructions="Use the tools to achieve the task",
    mcp_servers=[mcp_server_1, mcp_server_2]
)
```

### Caching and Performance Optimization

To reduce latency, especially when using remote servers, the SDK allows for caching the list of tools provided by an MCP server. By passing `cache_tools_list=True` to `MCPServerStdio` and `MCPServerSse`, developers can ensure the agent retrieves the tool list quickly without repeated calls to the server.

## Benefits of MCP Integration

The inclusion of MCP in the OpenAI Agents SDK provides several benefits:

- **Standardization:** MCP offers a uniform way to connect LLMs to various tools and data sources, streamlining the development process.
- **Flexibility:** Developers can choose between local and remote MCP servers based on their application requirements.
- **Efficiency:** Tool caching and efficient querying reduce latency and improve overall performance.

## Conclusion

The support for MCP within the OpenAI Agents SDK marks a significant milestone in AI development. By standardizing how context is provided to LLMs, MCP simplifies the process of integrating complex tools and data sources, thereby enriching the capabilities of AI agents. As AI continues to evolve, protocols like MCP will play a crucial role in advancing the field and unlocking new possibilities.

For more information, visit the [OpenAI Agents SDK documentation](https://openai.github.io/openai-agents-python/mcp/).
