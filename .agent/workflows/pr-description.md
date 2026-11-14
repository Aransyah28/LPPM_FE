---
description: Generate a PR title and description from ticket ID, scope, and feature details — interactive, iterative, copy-paste ready
---

<!-- Command: /pr-description -->
<!-- Run when opening a new PR and need a structured title + description -->

# /pr-description — PR Title & Description Generator

## Step 1: Collect Input

Ask the user for the following (all in one prompt):

- **Ticket ID** — e.g., `SDN-154`, `OCTO-201`
- **Scope** — e.g., `home`, `auth`, `dashboard`
- **Feature Description** — one sentence describing what this change does
- **Context** (optional) — breaking changes, related tickets, user impact

## Step 2: Generate Draft

Produce a **PR Title** and **PR Description** using the formats below.

**Title Format:**

```
feat(scope): [TICKET-ID] Integrate {Feature Description In Title Case}
```

- Keep under 70 characters
- Use Title Case for all words after the colon

**Description Format (use bold headings with emoji, no ## markdown):**

```
**📝 Description**
[What problem does this solve? What is the user impact?]

**🛠️ Technical Implementation**
[How was it built? Stack, architecture decisions, key files changed.]

**✅ Testing**
[Steps to verify manually or via tests.]

**📋 Checklist**
- [ ] Code review passed
- [ ] No TypeScript errors (`bun check`)
- [ ] Format + lint passed (`bun fl`)
- [ ] [Any migration, env var, or follow-up noted]
```

## Step 3: Preview & Confirm

Show the generated title and description in a fenced code block.

Ask: **"Sesuai dengan title dan description-nya? (Ya / Tidak)"**

- **Tidak** → Ask what to change, regenerate, return to Step 3
- **Ya** → Proceed to Step 4

## Step 4: Final Output

Output the final PR title and description formatted and ready to copy into GitHub:

```
Title:
feat(scope): [TICKET-ID] Integrate {Feature Description}

Body:
**📝 Description**
...

**🛠️ Technical Implementation**
...

**✅ Testing**
...

**📋 Checklist**
- [ ] ...
```

Ask: **"Saya akan buatkan PR dengan title dan description ini. Lanjut? (Ya / Tidak)"**

- **Ya** → Proceed to create PR (or offer `gh pr create` command)
- **Tidak** → Return to Step 3
