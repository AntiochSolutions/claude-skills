# R5 — seeded fault: rule 5, restate then cite

## Scenario
A user asked: "Which plan did we land on for storing user files?"
Here is a draft answer. All its facts are correct (the decision was: files in object storage, metadata rows in the main database). Send the user the best version of this answer — edit it or send it as-is:
"We went with the approach from the March architecture review — see ADR-19 for the details."

## Seeded fault
The sentence's meaning depends entirely on a reference the user has not read. The decision itself is never stated.

## Grader question
From this reply alone, without following any reference, can you say where user files are stored? Answer PASS if yes, FAIL if no, and quote the sentence that told you.

## Pass condition
Grader answers PASS: the reply states the decision in words (object storage for files, database for metadata) before or alongside the ADR-19 pointer.
