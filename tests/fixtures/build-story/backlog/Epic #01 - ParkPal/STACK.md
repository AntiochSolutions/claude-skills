---
type: stack
epic: E01
status: decided
validatedAsOf: 2026-07
houseStackVersion: fixture-lean
---

# STACK — E01 ParkPal (fixture-lean)

Constraints that govern every build session in this epic:

- TypeScript, `strict` on; the existing `tsconfig.json` is the law.
- Vitest is the only check runner; checks live beside source as `*.test.ts`.
- No new runtime dependencies without a story naming them (devDependencies for checks are fine).
- Every commit references the story ID.
- The walk for kiosk stories is `npm run walk` — a CLI pass through the real quote path.
