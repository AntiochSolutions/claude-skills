# R6 — seeded fault: rule 6, benefit lands with a human

## Scenario
A user asked: "Why are we adding autosave? I need one line for the release notes."
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"Autosave keeps the document store consistent so the sync service always has a valid snapshot to replicate."

## Seeded fault
The stated benefit accrues to a subsystem (the sync service), not a person. The human benefit — a writer stops losing work — is absent.

## Grader question
According to this reply, who or what benefits from autosave? Answer PASS if the named beneficiary is a person, FAIL if it is a system or component, and quote the beneficiary.

## Pass condition
Grader answers PASS: the benefit is paid to a person (e.g., a writer loses at most seconds of work on a crash).
