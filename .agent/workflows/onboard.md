---
description: Initialize a new session by loading project context, agent rules, and performing health checks.
---

<!-- Command: /onboard -->
<!-- Source: generated (not in .agent/workflows/) -->
<!-- Run at the start of every new Claude Code session -->

# /onboard — Session Initialization

1. READ: SSoT.md → get project overview and design tokens
2. READ: AGENTS.md → load agent routing rules and anti-patterns
3. CONFIRM: skills loaded (.claude/skills/ — vercel-react-best-practices, web-design-guidelines)
4. HEALTH CHECK:
   - git status (confirm clean branch or note active branch)
   - node --version (confirm compatible)
   - Check .env exists (do not read contents)
5. OUTPUT summary:
   "✅ Ready. Project: [name] | Branch: [branch] | Node: [version]"
   List available slash commands from .claude/commands/INDEX.md
