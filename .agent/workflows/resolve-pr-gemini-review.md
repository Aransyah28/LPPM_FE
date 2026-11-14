---
description: Fetch Gemini Code Assist suggestions from a GitHub PR, review interactively, and generate a prioritized improvement plan document
---

<!-- Command: /resolve-pr-gemini-review -->
<!-- Run after Gemini Code Assist has reviewed a PR to triage and plan fixes -->

# /resolve-pr-gemini-review — Gemini PR Review & Improvement Planner

## Step 1: Collect PR Input

Ask the user for:

- **PR URL or PR Number** — e.g., `https://github.com/owner/repo/pull/42` or just `42`

If the user provides only a number, also ask:

- **Repository** — `owner/repo` format

Parse and extract owner, repo, and PR number from the input.

## Step 2: Fetch PR Data via `gh` CLI

Run the following bash commands in sequence:

```bash
# Fetch PR metadata (title, URL, branch, stats)
gh pr view {PR_NUMBER} --repo {OWNER/REPO} --json title,url,headRefName,additions,deletions,changedFiles
```

```bash
# Fetch all inline review comments (filter for Gemini bot)
gh api repos/{OWNER}/{REPO}/pulls/{PR_NUMBER}/comments --paginate \
  --jq '[.[] | select(.user.login | ascii_downcase | contains("gemini")) | {id: .id, file: .path, line: .line, body: .body, created_at: .created_at}]' > /tmp/gemini_review.json
```

```bash
# Fetch all PR issue comments (filter for Gemini bot)
gh api repos/{OWNER}/{REPO}/issues/{PR_NUMBER}/comments --paginate \
  --jq '[.[] | select(.user.login | ascii_downcase | contains("gemini")) | {id: .id, body: .body, created_at: .created_at}]' > /tmp/gemini_issues.json
```

Parse each Gemini suggestion and extract:

- `file` — file path and line number
- `type` — infer from keywords in body: `bug`, `security`, `performance`, `refactor`, `style`, `test`, `other`
- `summary` — first 1–2 sentences of the suggestion
- `detail` — full suggestion text

If **no Gemini comments found**, inform the user and exit.

## Step 3: Interactive Review Per Suggestion

For each suggestion found, present:

```
Suggestion #{N} of {TOTAL}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 File: {file}:{line}
🏷️  Type: {type}
💡 Suggestion: {summary}

Detailed comment:
{detail}

Options:
[✅] Accept     — I'll implement this fix
[⚠️] Review Later — Low priority, defer for now
[❌] Skip       — Not relevant / Won't fix
[💭] Custom     — I have a different approach
```

Ask the user to choose one option. For each choice:

- **Accept** → Record as "Accepted"
- **Review Later** → Record as "Deferred"
- **Skip** → Record as "Skipped"
- **Custom** → Ask: **"What's your planned approach?"** and record their note

Move to the next suggestion.

## Step 4: Categorize & Prioritize

Group all "Accepted" and "Deferred" suggestions into priority buckets:

| Priority | Emoji | Types                                  |
| -------- | ----- | -------------------------------------- |
| Critical | 🔴    | `security`, `bug`                      |
| High     | 🟠    | `performance`, best practices          |
| Medium   | 🟡    | `refactor`, `style`, `maintainability` |
| Low      | 🔵    | Minor improvements, `other`            |

## Step 5: Generate Improvement Plan Document

Generate and display a Markdown report with this structure:

```
# PR Improvement Plan: {PR Title}

**PR**: {PR URL}
**Branch**: {headRefName}
**Date**: {Today's date}
**Changes**: +{additions} / -{deletions} across {changedFiles} files

## Summary

| Status | Count |
|--------|-------|
| ✅ Accepted | {X} |
| ⚠️ Deferred | {Y} |
| ❌ Skipped | {Z} |
| 💭 Custom | {W} |

## 🔴 Critical Issues

- **{file}:{line}** — {summary}
  → Planned action: {decision or custom note}

[... repeat for each critical suggestion ...]

## 🟠 High Priority

- **{file}:{line}** — {summary}
  → Planned action: {decision or custom note}

[... repeat for each high-priority suggestion ...]

## 🟡 Medium Priority

- **{file}:{line}** — {summary}
  → Planned action: {decision or custom note}

[... repeat for each medium-priority suggestion ...]

## 🔵 Low Priority (Optional)

- **{file}:{line}** — {summary}
  → Planned action: {decision or custom note}

[... repeat for each low-priority suggestion ...]

## Implementation Checklist

- [ ] Address all 🔴 Critical issues before merging
- [ ] Run `bun check` and `bun fl` after changes
- [ ] Request re-review from Gemini Code Assist
- [ ] Update PR description with summary of changes made
- [ ] Address deferred issues in follow-up PRs (if applicable)

## Next Steps

1. Implement changes per priority
2. Commit with descriptive messages
3. Re-run Gemini review if needed
4. Update this document when complete
```

## Step 6: Save & Share Options

Ask: **"Simpan improvement plan sebagai file? (Ya / Tidak)"**

- **Ya** → Save as `docs/pr-reviews/PR-{PR_NUMBER}-gemini-review.md`
  - Create directory if it doesn't exist
  - Confirm the file path to the user

- **Tidak** → Display only in conversation (user can copy-paste manually)

Then ask: **"Post summary ke GitHub PR sebagai comment? (Ya / Tidak)"**

- **Ya** → Post using:

  ```bash
  gh pr comment {PR_NUMBER} --repo {OWNER/REPO} --body "{markdown summary with stats and Critical issues only}"
  ```

- **Tidak** → Done
