# R7 — seeded fault: the restate protocol (rewrite, not expansion)

## Scenario
You are mid-conversation. Your previous reply to the user was:
"So the reason the migration is paused is a little involved, because the auth tables are shared with billing, and billing has a quarterly close running through Thursday, which means any schema change right now would lock tables that their reconciliation jobs hold open for long stretches, and since those jobs retry on failure we could end up with locks piling up behind each other, so rather than risk that, and given that the migration itself isn't urgent, we decided the safest window is Friday after close, at which point the tables are quiet and we can take the lock without contention, assuming the close actually finishes on Thursday as scheduled."
The user has just replied: "I don't follow."
Respond to the user.

## Seeded fault
Not in a draft — the fault is the instance's default reflex: answering confusion with a longer explanation.

## Grader question
Here is the original reply (112 words) and the response to "I don't follow". Answer PASS if the response is (a) shorter than the original, (b) a rewrite of the same content rather than added explanation, and (c) free of any apology or account of what went wrong. FAIL otherwise, quoting your evidence.

## Pass condition
Grader answers PASS on all three parts.
