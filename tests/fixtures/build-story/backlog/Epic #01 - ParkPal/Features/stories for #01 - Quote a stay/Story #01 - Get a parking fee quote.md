---
id: S01
type: story
feature: F01
title: Get a parking fee quote
order: 1
status: ready
kind: walking-skeleton
tags: []
---

# S01 — Get a parking fee quote

As a driver, I can get a fee quote for my planned stay, so that I know the cost before I park

## Conversation notes

- Fees are per-entry, computed from minutes parked; the lot bills in started half-hours.
- First 15 minutes are free — grace applies once, at entry.
- Edge case discussed: exactly 15 minutes is still free; 16 minutes bills the first half-hour.
- The quote replaces the kiosk's paper chart; it must name its billing unit so drivers can
  check it against the sign.

## Acceptance criteria

- A stay within the grace period quotes $0.
- Past grace, each started half-hour bills $2.50, counted from minute one of the stay
  (grace is a waiver, not a deduction).
- Example table:

  | minutes | quote | note |
  | --- | --- | --- |
  | 0 | $0.00 | boundary — no stay |
  | 15 | $0.00 | boundary — grace edge |
  | 16 | $2.50 | first billed half-hour |
  | 30 | $2.50 | still one half-hour |
  | 31 | $5.00 | second half-hour starts |
  | 90 | $7.50 | three half-hours |
  | -5 | error: invalid stay | counter-example — negative minutes rejected |

- Given a driver at the kiosk, When they enter a planned stay of 90 minutes, Then the
  quote shows $7.50 and the quote names the billing unit ("3 half-hours").
- Quote computes in under 200ms at p95 on the kiosk. Meter: every quote emits a
  `quote_ms` log line; Ops (Dana) reviews the weekly p95.
- Kiosk quote screen matches the sketch: docs/sketches/quote-screen.png (judge: Dana).

## Not in this story

- Payments, receipts, or the weekend-rate table (S02) — quoting a weekday stay only.

## Open questions

- "Does the lot cap a single day's fee at a maximum?" — owner: Dana (Ops). Non-blocking:
  weekday quotes proceed uncapped; a cap, if confirmed, lands as its own story.

## Knowledge-state report

- **Route:** full conversation — example mining converged in one loop; the cap question is
  open but does not touch these criteria.
- **Agreed:** quote from minutes · started half-hours at $2.50 · 15-minute grace as waiver ·
  the example table is the Confirmation's spine.
- **Known unknowns:** the daily-cap question (Dana, Ops) — non-blocking for weekday quoting.
- **Out-of-scope decisions:** 3 — payments, receipts, weekend rates (S02).

Sizing left to the team; the conversation continues in the sprint.
