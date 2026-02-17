# Development Workflow (TDD + Approvals)

## Rules (see .cursor/rules for authoritative list)

- Always TDD: test first (fail) → implement → refactor
- Keep tasks small (15–60 minutes), independently testable, user-approved before start
- After each task: ensure tests pass, write summary in `docs/development/{phase-name}/{task-name}.md`, ask user to commit/push

## Verification examples

- TypeScript: `npx tsc -p <config> --noEmit`
- Unit: `pnpm test`
- Watch: `pnpm test:watch`
- Formatting: `pnpm format`

## What counts as verifiable

- Command with clear expected output
- Visible UI state
- Documented manual checklist
