---
name: tabbed-questions
description: Use when about to ask the user two or more questions in one reply, or when drafting a numbered or bulleted list of clarifying questions in prose — before sending it.
---

# Tabbed Questions

## Overview

Two or more questions in prose is a wall the user must answer by essay. The AskUserQuestion tool renders each question as a tab with clickable options — the user answers in clicks, not paragraphs. When you catch yourself numbering questions in prose, that reply should be an AskUserQuestion call instead.

## The shape

One AskUserQuestion call:

- Each question = one tab (max 4 per call). Short header (≤12 chars).
- 2–4 **opinionated suggestions** per question, each with a consequence-bearing description (what happens if they pick it), not bare labels.
- Put your recommendation first, labeled "(Recommended)", when you have one.
- `multiSelect: true` when choices aren't mutually exclusive.
- More than 4 questions? Ask the 4 that gate the work; follow up in a second round after answers land — say so in the lead-in text.
- Want discussion to stay open? Add an option like "Let's talk it through" — and the UI always adds a free-text "Other" tab automatically, so open-ended answers are never blocked.

## "But my questions are open-ended"

That's the standard reason to fall back to prose — resist it. Nearly every "open-ended" question has a short head of likely answers you can predict (current platform? → Confluence / Notion / SharePoint / self-hosted). Predicting them IS the value: the user confirms in one click instead of typing. The auto-"Other" tab covers the tail. If one question truly has no plausible options, that question alone can stay prose — the rest still go in tabs.

| Excuse | Reality |
|---|---|
| "Conversational prose is more natural" | For 2+ questions, prose costs the user an essay; tabs cost a few clicks. |
| "Answers don't fit preset options" | Options are suggestions, not enums. "Other" is always there. |
| "I'll just ask quickly inline" | One trivial question inline is fine. Two or more = tabs. |

## When NOT to use

- A single quick question mid-flow.
- The user explicitly asked for open discussion.
- Rhetorical/no-response-needed questions.
