---
description: Detect drift between the codebase and the Single Source of Truth (SSoT.md) documentation.
---

<!-- Command: /sync-ssot -->
<!-- Source: generated -->
<!-- Run weekly or after major refactor -->

# /sync-ssot — SSoT Drift Detection

Detect drift between current codebase and SSoT.md:

- Hardcoded values that should use design tokens
- Folder structure deviations from SSoT §architecture
- Naming convention violations
- Deprecated packages still in use (cross-ref SSoT §deprecated)
- Missing TypeScript types on exported functions
- Missing a11y attributes on interactive elements

Output per finding: file | line | violation | correct approach per SSoT
