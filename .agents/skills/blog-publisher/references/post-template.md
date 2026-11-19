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
2. **Diagrams (Optional — SVG When Needed)**: The website's markdown pipeline (`remark` + `remark-html`) converts standard CommonMark markdown to HTML without `remark-gfm`, KaTeX, or Mermaid.
   - **Optional Vector SVGs**: Only create a diagram when the article explains an architecture, multi-stage pipeline, or system topology that genuinely benefits from visual explanation. If a post does not need a diagram, do not include one. When a diagram is needed, save a responsive vector SVG to `elijahmondero/public/posts/images/<slug>-architecture.svg` (and a matching `.png` companion if syndicating via RSS) and embed it with `![Alt](/posts/images/<slug>-architecture.svg)`.
   - **Mobile-Safe Formatting**: Never use wide ASCII/Unicode box-drawing diagrams (`+---+`, `┌───┐`)—they overflow mobile screens. Do not use raw `mermaid` code blocks, GFM pipe tables (`| col | col |`), raw LaTeX (`$...$`, `$$...$$`), or GitHub alert markers (`> [!IMPORTANT]`), since `remark-html` will not render them. Use subheadings, bullet lists, inline formatting, and blockquote pipelines (`> **Step 1** &rarr; **Step 2**`) instead.
3. **Engineering Depth**: Focus on concrete mechanisms: specifications as source of truth, test-driven verification, context preservation, security guardrails, and human-in-the-loop governance.
4. **Rendered References & Sources Section**: At the bottom of the article markdown body, always include a `### References & Sources` section with clickable Markdown links and descriptions. This ensures site visitors see the citations on the rendered page, in addition to the YAML frontmatter `sources:` list.
