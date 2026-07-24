---
id: F01
type: feature
epic: E01
title: Quote a stay
order: 1
status: refined
featureType: business
tags: [mvp]
evidence: some-evidence
---

# F01 — Quote a stay

## Need

Drivers argue exit fees because the paper chart is ambiguous; staff re-compute by hand.

## Hypothesis

Showing an exact, rule-computed quote at entry removes the ambiguity that causes disputes.

## Success signal

Fee disputes at exit drop below 2/week within a month (Meter: staff dispute log, Ops weekly).

## Outcome served

Fewer disputes; staff time back.

## Risk

Drivers may distrust a screen quote more than the familiar chart — watched via dispute log.

## NFR constraints

Quote computes in under 200ms at p95 on the kiosk (Meter: `quote_ms` log line per quote, Ops
weekly review).

## Stories

| ID | Story (Card) | Kind | Status |
| --- | --- | --- | --- |
| S01 | As a driver, I can get a fee quote for my planned stay, so that I know the cost before I park | walking-skeleton | ready |
| S02 | As a driver, I can get a weekend-rate quote, so that weekend pricing is honest too | placeholder | skeleton |

First slice: S01 (walking skeleton).
