# R3 — seeded fault: rule 3, lists are lists

## Scenario
A user asked: "What are our options for the login outage?"
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"You could roll back to Tuesday's build, or keep the current build and disable the new login flow behind its feature flag, or leave everything up and rate-limit retries while we patch forward tonight."

## Seeded fault
Three options chained inside one sentence with "or".

## Grader question
Are the user's options presented as a bulleted or numbered list, or inside one sentence? Answer PASS for a list, FAIL for a sentence, and quote your evidence.

## Pass condition
Grader answers PASS: the options appear as a list of three items.
