# Objective Blog Quality & Editorial Scoring Rubric

To prevent evaluative bias and context pollution, this rubric is evaluated by an isolated Editorial Auditor subagent that has no knowledge of drafting prompts, intermediate scratchpads, or author rationalizations.

## Scoring Dimensions (Total: 100 Points)

### 1. Technical Rigor & Depth (Weight: 25 Points)
- **25 - Exceptional:** Explains underlying mechanics, real architectural trade-offs, concrete engineering frameworks, and technical nuances relevant to the topic. Demonstrates genuine senior engineering insight with zero vague hand-waving or marketing fluff.
- **18 - 24 - Good:** Strong technical concepts; minor areas could have used deeper operational examples or clearer architectural definitions.
- **10 - 17 - Average:** Uses buzzwords without thoroughly explaining underlying mechanics; feels somewhat generic.
- **< 10 - Unacceptable:** Shallow summary, superficial or inaccurate technical claims.

### 2. Architecture & Visual Communication (Weight: 20 Points)
- **20 - Exceptional:** Contains a strictly valid, compilable Mermaid flowchart, sequence diagram, or architecture graph that clearly illuminates the core technical concepts. Labels with special characters are safely escaped with quotes.
- **14 - 19 - Good:** Diagram is present, syntactically valid, and helpful, with minor styling or structural improvements possible.
- **8 - 13 - Average:** Diagram is either overly simplistic or has minor parsing friction.
- **< 8 - Unacceptable:** Missing diagram or broken Mermaid syntax.

### 3. Readability & Engineering Voice (Weight: 20 Points)
- **20 - Exceptional:** Natural, authoritative engineering voice characteristic of a senior software engineer. No clichés (e.g. "In today's fast-paced digital world"). Strong section transitions, clear callouts, and actionable takeaways.
- **14 - 19 - Good:** Well-written and engaging; clear flow and tone throughout.
- **8 - 13 - Average:** Readable but exhibits noticeable LLM stylistic tropes.
- **< 8 - Unacceptable:** Disjointed, overly verbose, or hard to follow.

### 4. Metadata & Schema Conformance (Weight: 15 Points)
- **15 - Exceptional:** Exact YAML frontmatter matching Next.js blog structure (`title`, `authors`, `date`, `summary`, `tags`, `sources`, `image_path`). Properly quoted strings, valid ISO date timestamp, and relevant tags.
- **10 - 14 - Good:** Valid YAML with minor tag or formatting discrepancies.
- **< 10 - Unacceptable:** Broken YAML frontmatter or missing required fields.

### 5. Source Integrity & Citations (Weight: 20 Points)
- **20 - Exceptional:** All core assertions, external frameworks, and referenced materials (including videos and technical literature) are explicitly listed in the `sources:` frontmatter with verified direct URLs.
- **14 - 19 - Good:** Sources are present and valid; could include 1-2 additional primary references.
- **< 14 - Unacceptable:** Missing citations, hallucinated links, or empty sources array.

---

## Evaluation Gate Rules
- **Passing Threshold:** Total Score >= 85 / 100.
- **Minimum Floor:** No individual dimension may score below 70% of its available points.
- **Output:** The auditor subagent must produce a structured Markdown scorecard with category scores, total score, pass/fail status, and qualitative feedback.
