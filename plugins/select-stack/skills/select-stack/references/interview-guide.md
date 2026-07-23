# Interview guide — select-stack

Companion to `SKILL.md`. The conversation playbook: phase-by-phase moves, the founder
question bank, presentation technique, and the revisit branch. SKILL.md routes **Phase 3 —
Constraint interview** here; the other phases' detailed moves live here too. This file holds
what to *say* to a non-technical founder — the opinion lives in `house-stack.md`, the mining
taxonomy in `demand-signals.md`, the artifact formats and the read-back in `output-template.md`.
Reference those by name; never restate their content here.

Questions below are **stems, not scripts** — adapt wording to the founder's own vocabulary,
keep the *move* intact — **except** the Phase-3 constraint questions, which are quoted verbatim
because live sessions use them as written.

## Global rules

- **One question per turn — always.** Ask one question, hear the answer, reflect it back in
  your own words, then ask the next. Never stack two asks, never offer a menu with an
  "…and also…". A stem with more than one question mark is a **sequence of turns**, not one
  utterance — ask the first, hold the rest.
- **Tabbed multiple choice wherever honest.** Deliver decision questions as single-tab
  AskUserQuestion calls — budget especially — rather than open prompts; shape and carve-outs
  in `tabbed-questions.md` (this folder). Only ask open when options would be dishonest.
  Prose pick-one brackets are the fallback when the tool is absent.
- **Mom-Test form.** Past tense, behavior-anchored, and **never reveal the preferred answer
  first** — "where's the domain registered?", not "you'll want Vercel, right?". Ask about
  what already exists and what already happened, not what the founder imagines they'll want.
- **≤ ~20 founder questions for the whole session** — **~8–12 of them in Phase 3.** The store
  answers the rest. If you're about to blow the budget, you're asking the store's questions to
  the founder.
- **The founder is never asked a framework question.** Any question naming a technology the
  founder didn't say first is a defect. Constraints in, recommendations out.
- **Plain language, translate on first use.** Teach each term of art in one plain sentence the
  moment you need it, then use it:
  - *stack* → "the set of tools the app is built out of"
  - *environment (QA / PROD)* → "a practice copy where we try everything first, and the real
    one your customers use"
  - *API-first* → "everything the screens can do, other software can do too, through a
    documented door"
  - *spend cap* → "a hard ceiling that switches the bill off before it can run away"
  - *merchant-of-record* → "a company that sells on your behalf and handles the sales tax"
  - *recovery point (RPO)* → "how much recent data you could afford to lose if something broke"
  - *SLA* → "a promise about uptime written into a contract, with money on the line"
  - *residency* → "a rule that your data has to physically stay in a certain country"
- **GPCTBA ordering** (see Phase 3): value is established before money, and existing accounts
  come near the end — **budget mid, accounts late-ish.**

## Phase 0 — Intake

No founder questions here beyond the store path and the epic choice. Load
`references/backlog-store.md` for the tree, IDs, and roll-up conventions.

- **Locate the store.** Use `./backlog/` if present; otherwise ask for the path.
- **Hard stop with no store.** Explain the suite order (refine-epic → decompose-epic →
  refine-feature → refine-story → select-stack), offer to run **decompose-epic** first, and
  stop — there is nothing to derive a demand profile from.
- **Multi-epic root → ask which epic.** One stack decision per epic; no cross-epic stacks.
- **Load** `epic.md` + every feature file + every story file for the chosen epic.
- **Maturity check → confidence honesty.** Prefer MVP features `status: refined` and stories
  `ready`, but **any maturity proceeds** — depth changes the confirming burden, not
  eligibility. On a skeleton-heavy store, **say so up front**: *"This backlog is still mostly
  skeleton, so there'll be more confirming questions ahead, and I'll flag which parts of the
  stack we inferred vs. knew."* Plan the STACK.md **confidence appendix** now. The full
  maturity → confidence-appendix behavior (including absent NFRs) lives in `demand-signals.md`
  under **Maturity → confidence appendix** — apply it, don't restate it.
- **Revisit check.** If `epic.md` already carries a `stack:` field (or STACK.md exists),
  don't re-run the whole interview — go to **Revisit branch** at the bottom of this file.

## Phase 1 — Derive the demand profile

**This phase is silent — you ask the founder nothing.** You read; nothing is shown yet.
Load `references/demand-signals.md` (the taxonomy + NFR thresholds) and
`references/house-stack.md` (to map each signal to a house default or a swap).

- Run the demand-signal taxonomy over the store. For **every** signal record
  **signal → citation(s) → confidence → tier** (a covered / b service-addition /
  c architecture-bending). The taxonomy, keywords, and tier definitions are in
  `demand-signals.md` — apply them here.
- Run the **NFR threshold table** over `epic.md`'s quantified NFRs; where NFRs are absent,
  apply the founder-scale defaults and note the gap for the confidence appendix (the
  NFR-absent fallback is defined in `demand-signals.md` under **NFR thresholds**).
- Note enabler features (so you never propose duplicate stack work), Real Options ledger
  entries (deferral machinery to plug tier-c "decide-later" calls into), the mvp/contingent
  partition (size only `tags: [mvp]`), and validate-manually ("no-code-yet") candidates.
- Carry every ambiguous signal forward as a **detected-ambiguous** flag — its verification
  question fires in Phase 2, not before.

Output of this phase is an internal draft profile. The founder sees it in Phase 2.

## Phase 2 — Confirm the demand profile

Play the profile back in **plain language, one cluster at a time, citations visible** — the
store speaks first so the founder is confirming, not inventing.

- **Playback move:** state the signal in outcome language with its citation shown — *"S07 says
  members pay dues, so the app takes real money — that's right?"* One cluster per turn; the
  founder confirms, corrects, or adds.
- **Fire only the triggered verification questions.** For a detected-ambiguous signal, ask the
  one disambiguation from `demand-signals.md` → **Verification questions** (live vs fresh;
  phone vs offline; find vs search-as-you-type; notify vs text). Do not ask them for
  unambiguous signals.
- **Settle every tier-c signal explicitly here** — offline writes, i18n route structure, a
  partner/developer API program, live collaboration — even if the founder wants to defer.
  Deferral is a *logged* decision (plug it into a Real Options entry), never a silent skip.
- **Offer the validate-manually flags** you found in Phase 1: *"Dues could start as a plain
  payment link while the app is built, and only become code once it's proven — want that?"*
- **Record injected Phase-3 questions.** Some demand rows add a founder question downstream —
  an SMS signal injects a **timeline / lead-time** question (A2P 10DLC approval days); a
  payments signal injects the **product-classification** question (and "who does your
  accounting?"). Note them so they land in Phase 3.

## Phase 3 — Constraint interview

Four areas, **~8–12 questions total**, one per turn, multiple choice wherever honest. The
store already answered the framework layers — the founder answers only what it can't reveal.

**Ask-order (GPCTBA — value first, money mid, accounts late-ish):** value was just established
in Phase 2, so open with **Business** (budget lands mid-interview, right after value is
confirmed), then **Scale**, then **Operations**, and run the **Accounts** walk **late-ish**,
near the end. The four areas are catalogued below in the reference order; ask them in the
sequence just given.

The bracketed **→ arrows** are the internal wiring each answer feeds — never spoken to the
founder.

### Accounts (walk it late-ish)

A per-asset walk of what already exists — factual, never hypothetical. One asset per turn:

- *"Where's the domain registered?"*
- *"Any email on it?"*
- *"Any Google, Microsoft, Stripe, AWS, or hosting account already billing you?"*
  → an existing **Stripe** account confirms the payments layer; an existing **Microsoft**
  relationship feeds the Founders Hub check below.
- *"Is the company incorporated?"*
  → incorporation (or a Microsoft relationship) **arms the Microsoft for Startups Founders Hub
  eligibility check** (~$1,000–5,000 Azure credit), which in turn arms the **Tier 2 — Azure
  escalation** credits trigger in `house-stack.md`.

### Business (budget mid)

- **Product classification — only when the payments signal fired.** First ask
  *"Who handles your accounting — you, a bookkeeper, a firm?"* → its answer feeds the
  tax-burden-vs-cost discussion below. Then ask the classification question from the
  **product-classification rule** in `demand-signals.md`:
  *"What exactly is being sold — a subscription to software, a digital product, your professional services, physical goods?"*
  Then work the tax-burden-vs-cost discussion and
  land the processor recommendation **in the order that rule specifies** (classification
  first, tax-vs-cost second, recommendation third). Don't restate the rule here — apply it.
- **Budget — anchor, then tabbed brackets.** State the landscape and let the founder pick (single-tab AskUserQuestion):
  *"Apps like this run $0–5/mo as a demo, ~$35/mo in production, $100+/mo when everything's paid — which range should we design for?"*
  (Use the stamped pricing framing from
  `house-stack.md`; re-verify the figures when web tools are available.)
- **Hard cap — a separate question, a real number.**
  *"What's the absolute maximum this may cost per month before we should turn it off? Give me a number."*
  → this number **becomes the day-one platform spend cap** (a no-veto item).

### Scale (honest, not the pitch deck)

- *"Realistically, how many people will use this in the first 12 months — your honest number, not the pitch-deck number?"*
- *"On your biggest day, how many are using it at the same moment?"* → busiest-moment
  concurrency sizes the database, not the twelve-month total.
- **Uptime disambiguation — mandatory whenever the epic carries an availability NFR.** After
  the founder states any uptime hope: *"Is that promised in a customer contract, or a hope?"*
  → a contractual SLA (or ≥ 99.99%) **arms Tier 2 — Azure escalation**; a hope changes nothing.

### Operations

- **Maintainer + error owner.** *"After launch, who edits content, and who gets the 2am error email?"*
  Two asks, so two turns: first the content owner, then the error-email owner → the
  named error-email recipient **becomes the Sentry alert target** (a no-veto item).
- **Timeline + injected lead-time items.** Ask about the target timeline, and surface any
  lead-time items injected from Phase 2 — e.g. **A2P 10DLC SMS registration** takes days of
  approval and can gate a launch date. (No schedule dates are ever persisted — no-estimates
  rule.)
- **Compliance — asked concretely, never as "are you compliant?".**
  *"Any users in the EU or Canada — and a lawyer telling you their data must stay there?"*
  then *"Any health data?"* → both answers **arm the Tier 2 — Azure escalation triggers**
  (data residency / sovereignty; BAA-chain / audit posture).

## Phase 4 — Recommend, layer by layer

Now you recommend — the founder vetoes within bounds. Load `references/house-stack.md` for the
layer table, the two swap tiers (`Tier 1 — Additive & settings`, `Tier 2 — Azure escalation`),
and the pricing facts. Walk the layers in this **fixed order**:

> **shape + framework + API → database → auth → services (payments / email / storage / jobs /
> realtime / AI) → hosting + environments → quality + observability**

**Per-layer script — the same shape every time:**

1. **Conclusion first, in outcome language.** Say what the founder *gets*, not the tech name
   first — *"Your data lives in one managed database that also handles search and reporting,
   so there's one bill and one thing to watch."*
2. **One analogy, maximum.** Zero is fine; two is clutter.
3. **House default plus the named not-triggered swap** — never a single-option ultimatum.
   State the default, then name the alternative and why it isn't triggered, citing the profile:
   *"we'd only move to Railway if the backlog had long-running jobs — it doesn't, per the profile (no story trips durable compute)."*
   The pattern, every layer: **"we'd only move to X if Y — it isn't, per `<citation>`."**
4. **Bounded veto — offer exactly three doors:** *keep / take the named swap / name a constraint I missed.*
   Not an open "what do you think?" — the veto is bounded so it invites a real constraint, not
   reflexive pushback.
5. **A triggered swap shows its receipt:** citation + tier + token cost, checked against the
   ledger (below). A bought commodity (Stripe, managed auth, Resend) is **not** a token spend —
   say so.

**Included, not optional — never offered for veto.** Present the **six non-negotiables** and
the **two no-veto items** as part of the build, not as choices:

- The six non-negotiables (full text in `house-stack.md`): (1) two isolated environments, QA
  and PROD, everything built in QA first; (2) all infrastructure scripted and committed, no
  click-ops; (3) API-first, OpenAPI/Swagger-compliant, a Swagger page per API secured by API
  key; (4) the app emits, stores, and revokes its own API keys; (5) **PROD promotion only on
  explicit user authorization — an approval-gated GitHub Actions environment**, not prose;
  (6) strict TDD (Red-Green-Refactor) throughout the build.
- The two no-veto items: **Sentry** before first deploy, alerting the error-email owner named
  in Phase 3; and a **platform spend cap** set day one at the founder's hard-cap number.
- **Founder-half honesty note:** say plainly that API-first, key management, and the QA
  environment add real build scope — and that QA runs ~$0 on free tiers. Don't hide the scope
  cost behind the ~$0.

**Cost table, running and aloud.** Accumulate a cost line as each layer lands — launch cost
and paid-everything cost. **Itemize every NFR-forced cost with a keep-or-relax choice:**
*"One-hour recovery adds about $100/mo — keep that, or relax the recovery target?"* Never
accept an NFR without pricing it.

**When Azure fires (Tier 2 — Azure escalation).** Show the move (Vercel → Azure App
Service / Container Apps; managed Postgres → Azure Database for PostgreSQL; Bicep; region
pinned), note that everything else carries over unchanged, and **price it with the Microsoft
for Startups Founders Hub credits applied.** (There is no replatform tier — the portability
rule plus this escalation covers every case.)

**Token ledger, maintained aloud.** Say the count as you go — *"still 0 of 1 innovation tokens
spent."* Every fired swap records its citation and its token cost; **every considered-but-
refused swap records why not** — *"considered a Python sidecar; not triggered — AI here is a
feature, not the product, per the Benefit Hypothesis."* Refusals surface later in STACK.md's
founder half, so nothing weighed is invisible.

## Phase 5 — Write & read back

Load `references/output-template.md`.

- **Write both artifacts** — STACK.md and KICKOFF.md into the epic folder — per the formats and
  the write-back contract in `output-template.md`.
- **Set `stack: STACK.md`** in `epic.md` front-matter — the only epic-file touch; preserve all
  other fields and leave the `## Features` roll-up untouched.
- **Deliver the closing read-back by running `output-template.md`'s `## Read-back script`
  section.** The script's content lives **there**, not here — Phase 5 loads that file, so this
  section just says to run it. Do not compose a read-back of your own.

## Revisit branch

Reached from Phase 0 when `epic.md` already carries `stack:` (or STACK.md exists). Don't re-run
the whole interview.

- **Ask what changed and why** — one question, then work only that thread.
- **Revise STACK.md in place.** STACK.md is a path-addressed singleton, so the store's supersede
  idiom doesn't apply — open its micro-ADR list with a **dated revision entry** stating what
  changed and why; **git history holds the prior versions.**
- **Re-run only the affected phases:**
  - a new **demand signal** → a **Phases 1–2 delta** (re-derive and re-confirm just that signal);
  - a new **constraint** → a **Phase 3 delta** (ask just the affected constraint questions);
  - **always re-run Phase 4 for the affected layers** — a changed input can move a swap;
  - **rewrite both artifacts whole** (per `output-template.md`), then re-deliver the read-back.
