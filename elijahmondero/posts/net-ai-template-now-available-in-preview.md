---
title: ".NET AI Template Now Available in Preview"
authors:
  - name: 'Elijah Mondero'
date: "2025-03-18T06:34:24.577644Z"
summary: "Microsoft has announced a new AI Chat Web App template, now available in preview. This template is designed to simplify AI development with .NET by providing scaffolding and guidance within Visual Studio, Visual Studio Code, and the .NET CLI."
tags:
  - ".NET"
  - "AI"
  - "Template"
  - "Preview"
  - "Visual Studio"
  - "Visual Studio Code"
image_path: "/posts/images/868ab36a-699e-4174-815b-bcd7bd710e8c.png"
---

## Introduction

Microsoft has released the first preview of the .NET AI Template, designed to make AI development with .NET more accessible. This new template aims to streamline the creation of AI applications by providing scaffolding and guidance within Visual Studio, Visual Studio Code, and the .NET CLI. This marks a significant step forward in simplifying AI integration for developers working within the .NET ecosystem.

## Key Features

The .NET AI Chat template offers several features and configuration options that enhance the AI development experience:

### Chat with Custom Data
The template allows developers to create a chat-based UI that can interact with sample PDFs or user-provided data using the Retrieval Augmented Generation (RAG) pattern.

### Local and Azure Integration
It supports both a local vector store for prototyping and Azure AI Search for more advanced configurations.

### Customizable Code
The generated code includes UI components for chat interactions, citation tracking, and follow-up suggestions, which developers can customize or remove as needed.

### Data Ingestion
The template includes code for data ingestion, caching, and processing, allowing developers to handle various data sources and formats.

## Getting Started

### Installation
To install the first preview of the template, run the following terminal command:

```sh
 dotnet new install Microsoft.Extensions.AI.Templates
```

Once installed, the template can be accessed in Visual Studio, Visual Studio Code (with the C# Dev Kit), or via the command line using:

```sh
 dotnet new aichatweb
```

### Using Visual Studio
After installing the template, developers can start a new project by navigating to `File > New Project…` and searching for AI Chat or selecting the AI project type to find the template. Upon selecting a project name and location, they can choose an AI model provider and vector store.

### Using Visual Studio Code
In Visual Studio Code, the template can be accessed by first installing the C# Dev Kit extension, and then using the ` .NET: New Project… ` command. By default, it creates a new project using the GitHub Models model provider and a local vector store.

## Customizing Your Chat Data

This template includes sample PDF files and data ingestion code to process them. To chat with your own data:

1. Stop the running project.
2. Remove the sample PDF files from the `/wwwroot/Data` folder.
3. Add your PDF files to the `/wwwroot/Data` folder.
4. Restart the application.

On startup, the data ingestion code will process the new files.

## Conclusion

The preview of the .NET AI Template represents a significant step in making AI development more accessible and streamlined within the .NET ecosystem. Developers are encouraged to provide feedback to help shape future versions of the template, ensuring it evolves to meet their needs.

For more information and documentation, visit the [official blog post](https://devblogs.microsoft.com/dotnet/announcing-dotnet-ai-template-preview1/).
