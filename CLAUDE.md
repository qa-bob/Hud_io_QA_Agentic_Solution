@AGENTS.md

## Claude Code specifics

- **Subagents** live in `.claude/agents/` (see `.github/README.md` for what each one does). Prefer delegating page-object scaffolding, new test authoring, and test-suite review to them instead of doing it inline.
- **Skills** live in `.claude/skills/`, each a `SKILL.md` with real frontmatter. `Skills.md` at the repo root is the human-readable index; the actual invocable skills are under `.claude/skills/`.
- **`site.config.json`** (repo root) is the single source of truth for the base URL and page paths of the site under test. Update it — not hardcoded strings in tests or Page Objects — when hud.io's site structure changes. `utils/urls.ts` and `playwright.config.ts` both read from it.
- **Permissions**: `.claude/settings.json` allows routine `npm`/`playwright`/`tsc` commands and requires confirmation before editing `playwright.config.ts`, `package.json`, or CI workflow files, matching the "no changes to these without human approval" rule in `AGENTS.md`.
- Run `npx tsc --noEmit` and `npx playwright test --list` after changing tags, fixtures, or config to confirm the suite still resolves before handing off work.
