---
description: Audit the codebase for hardcoded values that should be replaced with design tokens.
---

<!-- Command: /token-audit [path] -->
<!-- Source: generated -->
<!-- Run before PR -->

# /token-audit — Design Token Audit

Scan all files in [path] for hardcoded values that should use SSoT tokens:

- Hex color values (#xxxxxx or rgb())
- px spacing values matching SSoT spacing tokens
- font-family strings
- Hardcoded font-size values

Output per finding: file | line | hardcoded value | correct token name
