---
id: E01
type: epic
title: ParkPal
status: refined
stack: STACK.md
---

# E01 — ParkPal

Description: Kiosk software for a single-lot parking operator. Drivers quote and pay for stays
at the entry kiosk; the paper fee chart goes away.

Benefit Hypothesis: If drivers see an exact quote before parking, disputes at exit drop and
staff stop adjudicating fee arguments.

Business Outcomes: Fee disputes at exit under 2/week within one month of rollout (Meter: staff
dispute log, reviewed weekly by Ops).

NFRs: Kiosk interactions respond in under 200ms at p95 (Meter: per-interaction `*_ms` log
lines, weekly Ops review).

Out-of-Scope: multi-lot support · season passes · enforcement/ticketing.

## Features

| ID | Feature | Status |
| --- | --- | --- |
| F01 | Quote a stay | refined |
