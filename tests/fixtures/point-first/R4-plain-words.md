# R4 — seeded fault: rule 4, plain words only

## Scenario
A user (a marketing manager, not an engineer) asked: "Where did the signup numbers go? The dashboard shows zero for the week."
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"The dashboard itself is fine — the ingest job went dark on Sunday, so the numbers are hydrating now and should catch up by tonight."

## Seeded fault
Two metaphors where plain words exist: "went dark" (stopped) and "hydrating" (loading back in). The named reader is a non-engineer.

## Grader question
You are a marketing manager with no engineering background. List any word or phrase in this reply you would stop at or misread. Answer PASS if there are none, FAIL if there are any, and quote them.

## Pass condition
Grader answers PASS: no metaphor or engineering-private vocabulary remains.
