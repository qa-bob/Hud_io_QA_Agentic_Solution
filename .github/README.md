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

**What:** Instructions that tell AI agents how to understand and work in this repository. This repo supports two agent tool ecosystems side by side: GitHub Copilot (this folder + root `AGENTS.md`) and Claude Code (root `CLAUDE.md` + `.claude/`).

**Files:**
- [`../AGENTS.md`](../AGENTS.md) — Root-level, tool-agnostic agent instructions following the [AGENTS.md spec](https://agents.md). Read by Copilot CLI, cloud agents, and (via import) Claude Code.
- [`copilot-instructions.md`](./copilot-instructions.md) — Repo-wide Copilot instructions automatically injected into every Copilot prompt in this repository.
- [`../CLAUDE.md`](../CLAUDE.md) — Claude Code's entry point. It imports `AGENTS.md` with `@AGENTS.md` (per [Claude Code's memory docs](https://code.claude.com/docs/en/memory#agentsmd)) and adds Claude-specific pointers.
- [`../.claude/agents/`](../.claude/agents/) — Claude Code project subagents (`page-object-scaffolder`, `qa-test-writer`, `qa-test-reviewer`). Each is a markdown file with YAML frontmatter (`name`, `description`, `tools`, `model`) — see [Claude Code subagent docs](https://code.claude.com/docs/en/sub-agents).
- [`../.claude/settings.json`](../.claude/settings.json) — Claude Code permissions: allows routine `npm`/`playwright`/`tsc` commands, requires confirmation before editing `playwright.config.ts`, `package.json`, or CI workflows, and blocks reading/editing `.env`.

**How agents use these files:**
- `AGENTS.md` is the shared source of truth for conventions — both tool ecosystems point back to it rather than duplicating rules.
- `copilot-instructions.md` is automatically injected into every Copilot prompt (IDE, CLI, code review, cloud agent).
- `CLAUDE.md` is read by Claude Code at the start of every session; because it imports `AGENTS.md`, editing `AGENTS.md` updates both tools at once.

**Guidelines for updating:**
- Keep instructions concise and actionable — not task-specific.
- Focus on architecture patterns, conventions, and how to build/run/test.
- Do not include credentials, environment-specific values, or task-specific steps.
- Prefer editing `AGENTS.md` for anything tool-agnostic; only touch `CLAUDE.md` or `copilot-instructions.md` for genuinely tool-specific behavior.

---

## Skills

**What:** Specialized capabilities that augment an agent's default behavior.

**Files:**
- [`../Skills.md`](../Skills.md) — Documentation of all skills relevant to this project, for both tool ecosystems.
- [`../.claude/skills/`](../.claude/skills/) — Claude Code's real, invocable skills (`new-page-object`, `new-test-suite`, `run-tests`), each a `SKILL.md` with YAML frontmatter. See [Claude Code skills docs](https://code.claude.com/docs/en/skills).

**Built-in Copilot CLI skills are managed via:**
```bash
/skills
```

**Path-specific instructions** (in `instructions/`) act as focused skill injections for specific file types — they add targeted context when an agent is working on files that match a given glob pattern. Copilot reads these via the `applyTo` frontmatter; Claude Code reads the same conventions through `AGENTS.md` and the subagent definitions in `.claude/agents/`.

| File | Applies To | Purpose |
|---|---|---|
| `instructions/playwright.instructions.md` | `tests/**/*.spec.ts` | Playwright test authoring conventions |
| `instructions/pom.instructions.md` | `pages/**/*.ts` | Page Object Model conventions |
| `instructions/testing.instructions.md` | `**/*.spec.ts`, `fixtures/**` | General testing standards, site.config.json usage, test tagging |

---

## Hooks (GitHub Actions Workflows)

**What:** Automated workflows that run on repository events (push, pull request, etc.).

**Directory:** `.github/workflows/`

**Purpose:** Hooks enforce quality gates and automate repetitive tasks. All PRs must pass these checks before merging.

| Workflow File | Trigger | Purpose |
|---|---|---|
| `ci.yml` | Push / Pull Request | Runs the full Playwright test suite against production (`site.config.json`'s `baseUrl`) |
| `staging.yml` | Manual (`workflow_dispatch`) | Runs the full suite against a staging environment via the `BASE_URL` repo secret |

**Workflow responsibilities:**
- Install Node.js and project dependencies
- Install Playwright browsers
- Execute `npx playwright test`
- Upload the Playwright HTML test report as an artifact
- Report pass/fail status back to the PR

**Running against staging:**
1. Add a `BASE_URL` repository secret (Settings → Secrets and variables → Actions → New repository secret) pointing at the staging environment.
2. Go to the Actions tab → "Playwright Tests (Staging)" → Run workflow.

`staging.yml` fails fast with a clear error if `BASE_URL` isn't set, rather than silently testing an empty URL — see the "Testing Constraints" history in `AGENTS.md` for why that check exists. It never runs on push/PR, so it can't affect `ci.yml`'s production-testing pipeline.

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

- Agents must follow `AGENTS.md` (and, for Copilot, `copilot-instructions.md`) at all times.
- Agents must not modify `.env`, workflow files, or `playwright.config.ts` without explicit human approval. For Claude Code this is technically enforced via `ask` rules in `.claude/settings.json`, not just documented.
- Agents must run the test suite before opening a PR.
- Agents must never register, sign up, log in, or submit a lead-generation form against the live site — see "Testing Constraints" in `AGENTS.md`.

---

## Docs

**What:** Documentation that lives in the repository for contributor and agent reference.

| File / Location | Purpose |
|---|---|
| [`../README.md`](../README.md) | Primary repo documentation — purpose, setup, rules |
| [`../AGENTS.md`](../AGENTS.md) | Tool-agnostic agent instructions (spec: [agents.md](https://agents.md)) |
| [`../CLAUDE.md`](../CLAUDE.md) | Claude Code entry point — imports `AGENTS.md` |
| [`../Skills.md`](../Skills.md) | Skills reference for both Copilot and Claude Code |
| [`../site.config.json`](../site.config.json) | Source of truth for the base URL and page paths under test |
| [`.github/README.md`](./) | This file — .github folder guide |
| [`.github/copilot-instructions.md`](./copilot-instructions.md) | Copilot repo-wide instructions |
| [`.github/instructions/`](./instructions/) | Path-specific Copilot instructions |
| [`../.claude/agents/`](../.claude/agents/) | Claude Code project subagents |
| [`../.claude/skills/`](../.claude/skills/) | Claude Code project skills |
| [`../.claude/settings.json`](../.claude/settings.json) | Claude Code permissions |

**Documentation standards:**
- All `.md` files use standard Markdown formatting.
- Code examples in docs must be TypeScript and follow the project's conventions.
- Update relevant docs whenever you change an architectural pattern or contributor rule.

---

## Quick Reference: Agent Instruction Files

| File | Scope | Read By |
|---|---|---|
| `AGENTS.md` (root) | All agent sessions | Copilot CLI, cloud agents, Claude Code (via import), other AI tools |
| `CLAUDE.md` (root) | All Claude Code sessions | Claude Code only |
| `.github/copilot-instructions.md` | All prompts in this repo | Copilot IDE, CLI, code review, cloud agent |
| `.github/instructions/*.instructions.md` | Path-matched files only | Copilot IDE, CLI, cloud agent |
| `.claude/agents/*.md` | Delegated subagent tasks | Claude Code only |
| `.claude/skills/*/SKILL.md` | Invoked via `/name` or auto-loaded | Claude Code only |
| `.claude/settings.json` | Every Claude Code tool call | Claude Code only |
| `$HOME/.copilot/copilot-instructions.md` | Local machine only | Copilot CLI (personal overrides) |
| `$HOME/.claude/CLAUDE.md` | Local machine, all projects | Claude Code (personal overrides) |
