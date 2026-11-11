# Implementation Plan: Native AGY Blog Pipeline and ADLC Blog Post

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native Antigravity (`agy`) workspace Skill and Plugin for end-to-end autonomous blog publishing with blind rubric scoring, and execute it to publish an authoritative blog post on the "Agentic Development Life Cycle" (ADLC) via a GitHub Pull Request.

**Architecture:** 
- Workspace Customization (`.agents/skills/blog-publisher/` and `.agents/plugins/blog-engine/`) providing progressive-disclosure skill execution within `agy`.
- Subagent isolation to prevent context pollution: independent Researcher, Writer, and Blind Auditor/Reviewer subagents.
- Multi-tier review: Automated 100-point objective rubric evaluation (threshold >= 85) followed by human review on the resulting GitHub Pull Request.
- Native tool orchestration (`search_web`, file tools, `image-generator`, and `run_command` with `git` and `gh`).

**Tech Stack:** Antigravity CLI (`agy`), GitHub CLI (`gh`), Next.js Markdown/Frontmatter parser, Mermaid.js.

---

## Global Constraints
- No external Python scraper dependencies (e.g. `ddgs`, `beautifulsoup4`, `langchain` scripts) required for running the skill.
- Frontmatter must adhere strictly to the repository format: `title`, `authors`, `date`, `summary`, `tags`, `sources`, `image_path`.
- All external claims and references must include direct URLs in the frontmatter `sources:` list.
- Mermaid diagrams must be strictly valid and compilable with quotes around labels containing punctuation or parentheses.

---

## Task Decomposition

### Task 1: Create Workspace Plugin and Skill Customizations
**Files:**
- Create: `.agents/plugins/blog-engine/plugin.json`
- Create: `.agents/skills/blog-publisher/SKILL.md`
- Create: `.agents/skills/blog-publisher/references/rubric.md`
- Create: `.agents/skills/blog-publisher/references/post-template.md`

**Steps:**
- [ ] Create `.agents/plugins/blog-engine/plugin.json` declaring the plugin bundle.
- [ ] Create `.agents/skills/blog-publisher/references/rubric.md` detailing the 5 dimensions, 100-point scale, and strict evaluation prompt.
- [ ] Create `.agents/skills/blog-publisher/references/post-template.md` documenting the YAML frontmatter schema, author format, and Mermaid patterns.
- [ ] Create `.agents/skills/blog-publisher/SKILL.md` specifying the subagent pipeline and automated PR creation instructions.

---

### Task 2: Conduct Isolated Research on Agentic SDLC
**Deliverable:**
- Produce structured Research Dossier covering:
  - YouTube video `https://www.youtube.com/watch?v=21tuT-e4NVo` ("Agentic SDLC Explained for Developers!").
  - The evolution: Waterfall -> Agile -> AI Autocomplete -> Agentic SDLC.
  - The 80/20 rule of engineering (coding is only ~20%; 80% is requirements, tests, context, review, ops).
  - Multi-agent orchestration patterns, specification-driven loops, and verification gates.
  - List of authoritative URLs for the `sources:` metadata.

**Steps:**
- [ ] Use `search_web` to retrieve detailed architectural summaries of the YouTube video and leading ADLC literature.
- [ ] Compile findings into an isolated research briefing for the writer subagent.

---

### Task 3: Draft the ADLC Blog Post
**Deliverable:**
- Complete draft markdown with frontmatter, Mermaid diagram, and deep technical sections.

**Steps:**
- [ ] Craft the blog draft with YAML frontmatter (`title`, `authors`, `date`, `summary`, `tags`, `sources`).
- [ ] Include an architectural Mermaid flowchart comparing the Traditional vs. Agentic SDLC.
- [ ] Ensure depth on spec-driven development, deterministic verification gates, MCP context management, and human governance.

---

### Task 4: Blind Editorial & Rubric Audit
**Deliverable:**
- Independent evaluation of the draft against the 100-point rubric in an isolated context.

**Steps:**
- [ ] Run blind rubric evaluation scoring Technical Rigor (25), Architecture & Visualization (20), Readability & Voice (20), Metadata & Schema (15), and Source Integrity (20).
- [ ] Confirm total score meets or exceeds 85/100 threshold (revise if needed).
- [ ] Generate structured Rubric Scorecard with category grades and qualitative commentary.

---

### Task 5: Generate Cover Artwork and Save Post
**Files:**
- Create: `elijahmondero/public/posts/images/<uuid>.png`
- Create: `elijahmondero/posts/agentic-development-life-cycle.md`

**Steps:**
- [ ] Generate 16:9 modern architectural cover image and save to `elijahmondero/public/posts/images/<uuid>.png`.
- [ ] Update draft frontmatter with the generated `image_path`.
- [ ] Write the complete markdown post to `elijahmondero/posts/agentic-development-life-cycle.md`.

---

### Task 6: Synchronize Site Index and Sitemap
**Files:**
- Modify: `elijahmondero/public/posts/index.json`
- Modify: `elijahmondero/public/sitemap.xml`

**Steps:**
- [ ] Prepend the new post metadata object to `elijahmondero/public/posts/index.json`.
- [ ] Insert `<url><loc>https://elijah.mondero.nz/post/agentic-development-life-cycle</loc><lastmod>YYYY-MM-DD</lastmod></url>` into `elijahmondero/public/sitemap.xml`.
- [ ] Verify JSON and XML syntax validity.

---

### Task 7: Git Branching & GitHub Pull Request Creation
**Steps:**
- [ ] Create and checkout branch `blog/agentic-development-life-cycle`.
- [ ] Stage and commit the new skill files, post, image, index, and sitemap.
- [ ] Push the branch to GitHub origin.
- [ ] Open Pull Request using `gh pr create` containing the summary, post content, and appended Rubric Scorecard.
- [ ] Add an official PR comment with the detailed Rubric Audit breakdown via `gh pr comment`.
