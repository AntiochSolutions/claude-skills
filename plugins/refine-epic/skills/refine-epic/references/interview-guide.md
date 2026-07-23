# Interview guide — per-property question bank

Companion to `SKILL.md`. For each property: a plain working definition, the **elicitation move** that gets
a real answer from a business SME, **challenge patterns** to push past vague answers, the **jargon
translation** (say this, not that), and the thought-leader **anchor**. Use these as a bank — pick
**exactly one** question per turn (pure spoken-style dialog: one question, one answer; then branch,
clarify, or challenge on that same thread with your next single question until it's resolved, then
proceed to the next property). Follow the SME's energy, reflect back before your next question. Never
read them out as a checklist, and never stack two questions.

**Delivery:** decision questions (ratifications, gates, trade-offs) go out as single-tab
AskUserQuestion calls — shape, the evidence-question carve-out, and the no-tool fallback are in
`tabbed-questions.md` (this folder). Evidence questions stay open spoken prose.

The spine across all of it is **The Mom Test** (Rob Fitzpatrick): ask about their **concrete past and
present**, not their feelings about your future idea. Good data hides in what they already do, already
spend, and already work around.

---

## General Description
**Definition:** A plain narrative of the problem as it exists today and the change being proposed — in
the SME's own words, no agile vocabulary.
**Elicitation move:** "Walk me through how this works today, start to finish. Where does it get painful,
slow, or error-prone?" Then: "If you had a magic wand, what would be different?"
**Challenge patterns:**
- Solution stated as the problem ("we need a dashboard") → "What would the dashboard let you *do* that
  you can't today?" Get to the underlying problem.
- Abstract pain ("it's inefficient") → "Tell me about the last time that bit you. What happened?"
**Jargon:** there's none to translate here — keep it a story. Capture verbatim phrases; they make the
Title and Benefit Hypothesis ring true later.
**Anchor:** Mike Cohn (epic as a large, plain-language body of work); The Mom Test.

---

## Benefit Hypothesis
**Definition:** A **falsifiable** claim linking the change to a benefit, with the evidence that would
confirm or kill it. Shape: *"We believe <this change> will produce <this benefit> for <whom>; we'll know
we're right (or wrong) when <observable evidence>."*
**Elicitation move (Mom Test — ground in the present):** "How do you handle this *today*? How long does
it take / how often does it happen / what does it cost you when it goes wrong?" Build the hypothesis from
the cost of the status quo, not from the glow of the idea.
**Challenge patterns:**
- Unfalsifiable wish ("it'll make us more competitive") → "What would we *see* that proves it worked —
  and what would we see that proves it didn't?"
- Benefit with no owner → "Better for whom, specifically — which team, customer, or role feels it?"
- Output disguised as benefit ("we'll ship the new portal") → "Suppose the portal exists and nobody's
  behavior changes. Did we win? What *behavior* has to change for this to matter?"
**Jargon translation:** don't say "state your benefit hypothesis." Say: *"Let's write down what we
believe will happen, in a way we could later check — a bet, not a promise."*
**Anchors:** Eric Ries (leap-of-faith / falsifiable, validated learning); Marty Cagan (benefit as a
risky assumption to be tested); The Mom Test.

---

## Business Outcomes
**Definition:** The **measurable change in business health** if the bet pays off — revenue, cost, churn,
market share, cycle time, conversion. **Lagging** (visible months out). A number with a unit and a
direction, ideally a baseline + target.
**Elicitation move:** "If this fully works, what is measurably different 6–12 months out? Pick the one
or two numbers your boss would care about." Then push: "Roughly what is that number *today*, and where
would 'success' put it?"
**Challenge patterns:**
- "It'll save time" → quantify (Hubbard): "Whose time, how many hours a week, times how many people,
  times their loaded rate — ballpark?" A range beats a shrug; even '5–15 hrs/week across 8 reps' is
  progress.
- Output metric masquerading as outcome ("we'll have 100% adoption") → "And if everyone adopts it, what
  business number moves *as a result*?"
- Vanity metric (page views, logins) → "Does that number going up make the business healthier, or just
  busier?"
**Quantifying the "intangible" (Hubbard, *How to Measure Anything*):** anything that matters is
observable; anything observable can be measured at least to a range. If they "can't measure" it, ask
what they'd *see* more or less of — that's the measurement, even as a calibrated estimate or an open
metric to instrument.
**Jargon translation:** *"the results the business would feel — usually money, time, or customers — that
you'd only see after a while."*
**Anchors:** Josh Seiden / Jeff Gothelf (crisp "a change in customer/business behavior"); Teresa Torres
(outcomes over output); Douglas Hubbard (quantification).

---

## Leading Indicators
**Definition:** An **early, predictive** signal that moves **before** the Business Outcome — the
canary, weeks not quarters out — usable as a trigger to double-down or to stop.
**Elicitation move:** "What's the earliest sign — within a few weeks of shipping — that tells us this is
working, before the big number could possibly move? And what early sign would tell us to pull the plug?"
**Challenge patterns:**
- Lagging restatement ("revenue goes up") → "That's the destination. What's the *first* observable thing
  that predicts revenue is *about to* go up?"
- Not actually predictive ("people like it") → "If that's high but the outcome never follows, what does
  that mean? If it's not a reliable predictor, it's not our indicator."
- No stop-condition → always capture the **kill signal**, not just the go signal (Lean Startup: indicators
  exist to enable pivots, not just cheerleading).
**Jargon translation:** *"an early warning light — something you could check in a few weeks that hints
whether the big results are coming."*
**Anchors:** Eric Ries (actionable metrics that drive pivot/persevere); Josh Seiden (leading vs lagging);
Teresa Torres (discovery signals).

---

## Non-Functional Requirements
**Definition:** Quality **constraints**, **quantified** — how well the system must behave, not what it
does. Walk the **ISO/IEC 25010** categories as plain business questions; quantify each that applies
(Gilb / Planguage: every quality claim needs a scale, a target, and a context). Never accept "fast,"
"secure," or "reliable" bare.

Walk these eight as business prompts (skip ones that don't apply; depth per size triage):
1. **Performance efficiency** — "How quickly must it respond, and at what volume / how many users at
   once?" (e.g. "search returns in <2s at 500 concurrent users").
2. **Reliability / availability** — "How much downtime is tolerable? What happens mid-failure — can work
   resume?" (e.g. "99.9% monthly; no data loss on crash").
3. **Security** — "What's sensitive here? Who must *not* see or do what? Any rules you must comply with?"
   (e.g. "PII encrypted at rest; only owners edit billing").
4. **Usability** — "Who uses it, how trained are they, what must they be able to do without help?"
5. **Compatibility** — "What must it work with — existing systems, browsers, devices, data formats?"
6. **Maintainability** — "How often will this change? Who maintains it?" (often light for an epic).
7. **Portability** — "Must it run in specific environments / regions / clouds?"
8. **Functional suitability** — accuracy/correctness constraints ("must reconcile to the penny").
**Challenge pattern:** any adjective ("fast", "scalable", "user-friendly") → "Put a number and a
condition on that — how fast, for how many, measured how?"
**Jargon translation:** *"the 'how well' rules — speed, uptime, security, who-can-do-what — with real
numbers so we can tell if we met them."*
**Anchors:** ISO/IEC 25010 (the taxonomy); Tom Gilb / Planguage (quantified, testable quality).

---

## Out-of-Scope
**Definition:** Explicit boundaries — what this epic deliberately does **not** do — plus deferred items
noted as later candidates. Scope discipline prevents the epic from swallowing everything adjacent.
**Elicitation move:** "What might someone reasonably *assume* is included that we should rule out for
now? What's tempting but belongs in a later epic?"
**Challenge pattern:** scope creep surfacing as a "small addition" → name it, write it to Out-of-Scope as
a deferred candidate rather than absorbing it.
**Jargon translation:** *"the 'not this time' list — so nobody's surprised later about what we left out."*
**Anchor:** Mike Cohn / Roman Pichler (epic-splitting, scope discipline).

---

## Title
**Definition:** A short business-language noun phrase naming the capability — recognizable to a non-agile
stakeholder. **Draft it last**, once the substance exists.
**Elicitation move:** propose 2–3 candidates from the SME's own words; ask which one they'd recognize on
a roadmap. "If your VP saw this title in a list, would they know what it is?"
**Anchor:** Mike Cohn.

---

## Chain-validation logic (run at phase 6, and again at synthesis)
Lay the three out together and test each link out loud with the SME:

1. **Benefit → Outcome:** "Does this outcome actually *prove* the benefit we believe in? If the outcome
   hit its target but the benefit didn't materialize, what broke?" If the outcome doesn't measure the
   benefit, fix the outcome (or sharpen the benefit).
2. **Outcome → Indicator:** "Would this indicator really move *before* the outcome — and reliably predict
   it? If the indicator looked great but the outcome never came, would we be surprised?" If it's just an
   early restatement of the lagging metric, dig for a genuinely predictive early signal.
3. **No dangling links:** every benefit should have a lagging proof; every outcome should have at least
   one early predictor; every indicator should ladder up to an outcome. Surface and fill gaps; **never
   weaken an outcome to rescue a weak indicator** — the belief→proof thread is the point of the epic.

Repair in conversation, not silently. If a link can't be closed because the metric doesn't exist yet,
record it as an **open measurement to establish** (a real, honest output of the interview) rather than
faking a number.
