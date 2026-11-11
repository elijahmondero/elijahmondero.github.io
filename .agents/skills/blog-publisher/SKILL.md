---
name: blog-publisher
description: Researches, writes, audits against an objective scoring rubric, generates cover art, updates site indexing, and opens a GitHub Pull Request for elijahmondero.github.io.
---

# Blog Publisher Skill

Use this skill whenever you need to publish a high-quality, technically rigorous blog post to `elijahmondero.github.io`.

## Pipeline Stages

```
   1. Researcher Subagent     --> Deep web search & source gathering (Dossier)
   2. Writer Subagent         --> Technical drafting & Mermaid diagrams (Draft)
   3. Blind Auditor Subagent  --> Evaluates against 100-point Rubric (Score >= 85)
   4. Image Generator         --> Creates 16:9 modern cover artwork
   5. Site Indexing           --> Updates posts/<slug>.md, index.json, sitemap.xml
   6. PR Automation           --> Git branch, commit, push, gh pr create
```

### Stage 1: Isolated Research
- Launch a subagent with `search_web` to collect architectural concepts, core arguments, related industry practices, and primary source links.
- Assemble a clean **Research Dossier** without conversational noise.

### Stage 2: Technical Drafting
- Write the post following [post-template.md](./references/post-template.md).
- Emphasize deep architectural principles, real workflows, and valid Mermaid diagrams.
- Ensure the frontmatter contains complete metadata and verified source URLs.

### Stage 3: Blind Rubric Audit (Context-Isolated Review)
- Launch an independent subagent with a fresh context.
- Supply ONLY the draft Markdown and [rubric.md](./references/rubric.md).
- Score the post across the 5 dimensions (Technical Rigor 25, Architecture & Diagrams 20, Readability & Voice 20, Schema 15, Sources 20).
- If total score < 85, loop back to the Writer subagent with specific revision requests.
- Retain the final Rubric Scorecard for the PR report.

### Stage 4: Cover Image Generation
- Generate a 16:9 modern tech illustration for the article.
- Save image directly to `elijahmondero/public/posts/images/<uuid>.png`.
- Link image path in post frontmatter: `/posts/images/<uuid>.png`.

### Stage 5: Save & Index
- Save post to `elijahmondero/posts/<slug>.md`.
- Deterministic helpers (works across Linux/Termux, macOS, and Windows with zero pip dependencies):
  ```bash
  python3 .agents/skills/blog-publisher/scripts/publish_helpers.py index "<slug>" "<title>" "<excerpt>"
  python3 .agents/skills/blog-publisher/scripts/publish_helpers.py sitemap "<slug>" "<iso_date>"
  python3 .agents/skills/blog-publisher/scripts/publish_helpers.py validate "<slug>"
  ```

### Stage 6: Git Branch & Pull Request Automation
- Create branch: `git checkout -b blog/<slug>`
- Stage files: `git add elijahmondero/posts/<slug>.md elijahmondero/public/posts/images/ elijahmondero/public/posts/index.json elijahmondero/public/sitemap.xml`
- Commit: `git commit -m "feat(blog): publish <title>"`
- Push: `git push -u origin blog/<slug>`
- Create PR:
  ```bash
  gh pr create --title "feat: <title>" --body "<PR Body with Summary, Content, and Rubric Scorecard>"
  ```
- Post detailed rubric audit comment:
  ```bash
  gh pr comment <pr-number> --body "<Detailed Rubric Breakdown & Qualitative Commentary>"
  ```

---

## Cross-Platform & Android Termux Compatibility
This skill is built to run natively in Linux environments, including **Android Termux**:
- **Zero Third-Party Pip Packages**: All scripts rely solely on Python 3 standard library (`os`, `sys`, `json`, `re`, `datetime`). In Termux, only `pkg install python git gh` is needed.
- **POSIX & UTF-8 Compliant**: Line endings are strictly LF (`\n`), shebangs use `#!/usr/bin/env python3`, and paths use POSIX forward slashes.
- **Tool Independence**: Uses Antigravity's internal tools (`search_web`, `image-generator`, file tools) without external scraping scripts.
