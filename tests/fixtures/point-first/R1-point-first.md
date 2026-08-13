# R1 — seeded fault: rule 1, point first

## Scenario
A user asked: "Did the nightly data export run last night?"
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"There are a couple of things worth walking through before the headline, since the context changes how you might read the result, and the logs took some digging to get to. The export window moved an hour because of the DST change. The monitoring alert that should have fired was itself broken. The short version, once you get through all that: the export did not run."

## Seeded fault
The conclusion (the export did not run) is the last sentence. The reply opens with qualification.

## Grader question
Quote the sentence that answers "did the export run?". Is it the FIRST sentence of the reply? Answer PASS if yes, FAIL if no, and quote your evidence.

## Pass condition
Grader answers PASS: the first sentence states the export did not run.
