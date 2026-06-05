# .github Folder — GitHub Copilot Configuration Guide

This document explains the purpose and contents of every file and directory in this `.github` folder. It is the authoritative reference for how this repository configures GitHub Copilot, CI/CD automation, and contributor tooling.

---

## Directory Structure

```
.github/
├── copilot-instructions.md     # Repo-wide Copilot custom instructions
├── instructions/               # Path-specific Copilot instructions
│   ├── playwright.instructions.md
│   ├── pom.instructions.md
│   └── testing.instructions.md
├── workflows/                  # GitHub Actions CI/CD pipelines (Hooks)
│   └── ci.yml
└── README.md                   # This file
```

---

## Agents

**What:** Instructions that tell AI agents how to understand and work in this repository.

**Files:**
- [`../AGENTS.md`](../AGENTS.md) — Root-level agent instructions read by Copilot CLI, cloud agents, and other AI tools. This is the primary file.
- [`copilot-instructions.md`](./copilot-instructions.md) — Repo-wide Copilot instructions automatically injected into every Copilot prompt in this repository.

**How agents use these files:**
- `AGENTS.md` is the primary agent instruction file per the [AGENTS.md spec](https://github.com/agentsmd/agents.md). It is read by Copilot CLI and cloud agents.
- `copilot-instructions.md` is automatically injected into every Copilot prompt (IDE, CLI, code review, cloud agent).
- Both files complement each other and are both used when present.

**Guidelines for updating:**
- Keep instructions concise and actionable — not task-specific.
- Focus on architecture patterns, conventions, and how to build/run/test.
- Do not include credentials, environment-specific values, or task-specific steps.

---

## Skills

**What:** Specialized capabilities that augment Copilot's default behavior.

**Files:**
- [`../Skills.md`](../Skills.md) — Documentation of all skills relevant to this project.

**Built-in Copilot CLI skills are managed via:**
```bash
/skills
```

**Path-specific instructions** (in `instructions/`) act as focused skill injections for specific file types — they add targeted context when Copilot is working on files that match a given glob pattern.

| File | Applies To | Purpose |
|---|---|---|
| `instructions/playwright.instructions.md` | `tests/**/*.spec.ts` | Playwright test authoring conventions |
| `instructions/pom.instructions.md` | `pages/**/*.ts` | Page Object Model conventions |
| `instructions/testing.instructions.md` | `**/*.spec.ts`, `fixtures/**` | General testing standards |

---

## Hooks (GitHub Actions Workflows)

**What:** Automated workflows that run on repository events (push, pull request, etc.).

**Directory:** `.github/workflows/`

**Purpose:** Hooks enforce quality gates and automate repetitive tasks. All PRs must pass these checks before merging.

| Workflow File | Trigger | Purpose |
|---|---|---|
| `ci.yml` | Push / Pull Request | Runs the full Playwright test suite |

**Workflow responsibilities:**
- Install Node.js and project dependencies
- Install Playwright browsers
- Execute `npx playwright test`
- Upload the Playwright HTML test report as an artifact
- Report pass/fail status back to the PR

**Adding a new workflow:**
1. Create a new `.yml` file in `.github/workflows/`
2. Follow the existing `ci.yml` as a template
3. Document the new workflow in this README under the Hooks section

---

## Rules

**What:** Policies that govern how code changes are accepted into the repository.

### Branch Protection Rules (configured in GitHub repository settings)

| Branch | Rules |
|---|---|
| `main` | Require PR reviews (min 1), require all status checks to pass, no direct push |
| `develop` | Require PR reviews (min 1), require CI to pass |

### Code Ownership (CODEOWNERS)

A `CODEOWNERS` file can be added to `.github/CODEOWNERS` to automatically assign reviewers based on file paths:

```
# All test files require QA review
/tests/        @qa-bob

# Page Objects require framework owner review
/pages/        @qa-bob

# CI/CD changes require DevOps review
/.github/workflows/  @qa-bob
```

### Contributor Guidelines

- See [`../README.md`](../README.md) for full contributor rules.
- Key rules: TypeScript only, POM required, no hardcoded credentials, atomic tests.

### AI Agent Rules

- Agents must follow `AGENTS.md` and `copilot-instructions.md` at all times.
- Agents must not modify `.env`, workflow files, or `playwright.config.ts` without explicit human approval.
- Agents must run the test suite before opening a PR.

---

## Docs

**What:** Documentation that lives in the repository for contributor and agent reference.

| File / Location | Purpose |
|---|---|
| [`../README.md`](../README.md) | Primary repo documentation — purpose, setup, rules |
| [`../AGENTS.md`](../AGENTS.md) | Agent instructions for AI tools |
| [`../Skills.md`](../Skills.md) | Skills reference for Copilot and contributors |
| [`.github/README.md`](./) | This file — .github folder guide |
| [`.github/copilot-instructions.md`](./copilot-instructions.md) | Copilot repo-wide instructions |
| [`.github/instructions/`](./instructions/) | Path-specific Copilot instructions |

**Documentation standards:**
- All `.md` files use standard Markdown formatting.
- Code examples in docs must be TypeScript and follow the project's conventions.
- Update relevant docs whenever you change an architectural pattern or contributor rule.

---

## Quick Reference: Copilot Instruction Files

| File | Scope | Read By |
|---|---|---|
| `.github/copilot-instructions.md` | All prompts in this repo | Copilot IDE, CLI, code review, cloud agent |
| `AGENTS.md` (root) | All agent sessions | Copilot CLI, cloud agents, other AI tools |
| `.github/instructions/*.instructions.md` | Path-matched files only | Copilot IDE, CLI, cloud agent |
| `$HOME/.copilot/copilot-instructions.md` | Local machine only | Copilot CLI (personal overrides) |
