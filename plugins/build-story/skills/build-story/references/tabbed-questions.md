# Tabbed question delivery — AskUserQuestion in the interview

How this interview delivers its questions when the host environment provides the
AskUserQuestion tool (Claude Code does). The one-question-per-turn rule is untouched —
this reference changes only the *delivery* of questions whose answers can be enumerated.

## The rule

- **One call, one tab.** The interview's cadence is one question per turn, so an
  AskUserQuestion call here carries exactly ONE tab. Never batch several interview
  questions into one multi-tab call.
- **Decision questions go tabbed.** Any question that asks the user to *choose among
  futures* — an approval or gate ("Looks right?"), a ratification, a keep-or-relax
  trade-off, a budget bracket, a priority, a classification, a path — is delivered as
  an AskUserQuestion call, not as prose pick-one brackets.
- **Evidence questions stay spoken.** Any question that asks about the user's *past or
  present behavior* — walkthroughs ("walk me through the last time…"), workaround
  mining, "what happened next?" — stays open spoken prose. Offering canned answers to
  a behavior question leads the witness and contaminates the evidence.

## The shape of a tabbed question

- 2–4 **opinionated options**, each with a consequence-bearing description — what it
  costs, what it commits them to, what happens next — never bare labels.
- Your recommendation first, labeled "(Recommended)", whenever you have one.
- `multiSelect: true` when the choices aren't mutually exclusive.
- Add a "Let's talk it through" option whenever discussion is a plausible path; the UI
  adds a free-text "Other" tab automatically, so open answers are never blocked.

## Excuses (do not accept these from yourself)

| Excuse | Reality |
|---|---|
| "Conversational prose is more natural" | The options ARE the conversation — you would have spoken them anyway; tabs make them clickable. |
| "Answers don't fit preset options" | Options are suggestions, not enums. "Other" is always there. |
| "The interview is spoken-style dialog; tabs would break the flow" | A tab IS one spoken question. The cadence is unchanged: one question, one answer, reflect it back. |

## Fallback

If AskUserQuestion is not available in the host environment, fall back to prose
pick-one brackets — same options, same consequence notes, same "(Recommended)" label.
