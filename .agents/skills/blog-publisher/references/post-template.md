# Blog Post Template & Formatting Guidelines

## Frontmatter Schema
Each blog post markdown file in `elijahmondero/posts/<slug>.md` must strictly follow this YAML format:

```markdown
---
title: "Article Title Here"
authors:
  - name: 'Elijah Mondero'
date: "YYYY-MM-DDTHH:MM:SSZ"
summary: "A crisp 2-3 sentence technical synopsis explaining the core thesis and practical value of the article."
tags:
  - "Software Engineering"
  - "AI Agents"
  - "Architecture"
sources:
  - "https://www.youtube.com/watch?v=..."
  - "https://example.com/reference-article"
image_path: "/posts/images/<uuid>.png"
---

[Post body in GitHub Flavored Markdown]
```

## Content Guidelines
1. **No H1 in Content**: The title in the frontmatter serves as the main heading. Start body content directly with the introduction, followed by `###` or `##` subheadings.
2. **Architecture Visuals (SVG Preferred)**: The website's markdown pipeline (`remark-html`) converts standard markdown to HTML. 
   - **Vector SVGs**: Provide architectural workflows as clean vector SVGs saved to `elijahmondero/public/posts/images/<slug>-architecture.svg` and embedded via `![Alt](/posts/images/<slug>-architecture.svg)`. This guarantees crisp, responsive rendering with exact colors across GitHub PRs, local markdown editors, and the live Next.js website without client-side script dependencies.
   - **No Raw LaTeX**: Do not use `$$...$$` or `\longrightarrow` as KaTeX is not bundled. Use blockquotes and Unicode arrows (`→` / `&rarr;`) for pipeline flows.
3. **Engineering Depth**: Focus on concrete mechanisms: specifications as source of truth, test-driven verification, context preservation, security guardrails, and human-in-the-loop governance.
4. **Rendered References & Sources Section**: At the bottom of the article markdown body, always include a `### References & Sources` section with clickable Markdown links and descriptions. This ensures site visitors see the citations on the rendered page, in addition to the YAML frontmatter `sources:` list.
