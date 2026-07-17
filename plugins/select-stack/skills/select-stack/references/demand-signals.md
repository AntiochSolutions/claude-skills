# Demand-signal taxonomy — select-stack

The mining engine. **Phase 1 — Derive the demand profile (silent)** runs this taxonomy over
the backlog store (the markdown tree of `epic.md` + feature files + story files —
`backlog-store.md` holds the shapes). **Phase 2 — Confirm the demand profile** uses the
verification questions below. Every signal is cited to the feature/story that implies it;
the store speaks before the founder does.

Format per signal — five parts, always all five:

- **Where to look** — store location as *file > field/section*.
- **Keywords** — literal tokens you can grep across story files (`grep -ri '<token>' <stories>/`).
- **Implication** — services, architecture, cost the signal forces.
- **Tier** — `(a)` / `(b)` / `(c)`, defined under **Demand tiers**.
- **Verification question** — only where founder language is ambiguous; otherwise `none`.

Default response to every signal: **solve it with the house stack first** (`house-stack.md`).
A swap fires only on a cited trigger.

## How to read a store

**Structural signals — guaranteed present in every store** (mine them first; they need no
founder question):

- **Role census → auth shape.** Every story's Card line opens `As a <role>, I can …` with
  real role names; `epic.md > ## NFRs` carries the security constraint ("who must NOT see or
  do what"); feature/story bodies carry value-to-whom tags. Census the distinct roles across
  all Card lines. Implication: **Better Auth + Postgres RLS tenant isolation**; roles beyond
  2–3 tiers stay app-layer, not new auth infrastructure. This is the auth/roles signal below,
  and it is never absent — a store cannot exist without Card lines.
- **Instrumentation demand.** `epic.md > ## Leading Indicators` + `epic.md > ## Open
  Measurements` + each feature's `## Success signal` **Meter** lines. Implication: analytics
  / event capture is a **build requirement even when no story mentions a dashboard** — the
  numbers the epic promises to watch have to be emitted from day one.

**Confirmed absent — MUST be interviewed** (their absence is a *designed* property of the
suite: Mom Test + no-estimates rules, so never treat silence as "no"):

- money **budget**, existing **accounts/vendors**, **team skills**, **timeline**.
- also absent: **brownfield context** and **hosting preference** beyond whatever the
  portability NFR prose states.

These four are the constraint interview's job (Phase 3). The taxonomy never guesses them.

**Maturity → confidence appendix.** Prefer stores whose MVP features are `status: refined`
and stories `ready`, but **any maturity proceeds** — refinement depth changes the
*confirmation burden*, not eligibility. On a skeleton-heavy store, say so up front ("more
confirming questions ahead"). Every STACK.md then carries a **confidence appendix** marking
which demand signals were **derived from refined content** vs. **assumed from skeletons or
defaults** (absent NFRs included — see **NFR thresholds**). When confidence is low, the
read-back recommends running refine-feature / refine-story on the MVP items before the build
session starts.

**Qualifiers to read alongside every signal:** `tags: [mvp]` scopes the profile to the
actual first bet; `evidence` grades and provenance tags (`measured` / `SME-estimate` /
`guess-to-verify`) weight every load/volume number; the evidence checkpoint marks features
that may never be built; Real Options ledger entries are deferral machinery to plug into;
`featureType: enabler-architecture | enabler-infrastructure` features are matched against
proposed stack work so the skill never proposes duplicate work. See **Scoping rules**.

## Demand tiers

- **(a) covered by the house stack** — confirm only, no founder decision. Basic search
  (tsvector), CSV export, RLS multi-tenancy, pgvector RAG, transactional email, cron-grade
  jobs, dashboards from SQL aggregates. Play it back so the founder knows it is handled;
  do not open a choice.
- **(b) service-addition** — a bolt-on the constraint interview prices with a **monthly cost
  line**. Stripe / MoR, R2, Twilio SMS (plus A2P 10DLC registration fees and lead time), the
  portable realtime layer, model APIs (per-token — flagged in budget), Inngest beyond its
  included tier. Each is a commodity bought, not an innovation token spent.
- **(c) architecture-bending — must be settled before scaffold** (retrofit is expensive).
  These get an **explicit decision in Phase 2 even if the founder wants to defer**:
  - offline **writes** / sync engine,
  - i18n route structure,
  - a partner/developer API program **beyond the API-first baseline** (outbound webhooks,
    per-customer rate limits, versioning guarantees),
  - live collaboration (presence / co-editing).

## Signal inventory

Thirteen signals. Structural signals fire from every store; content signals fire on keyword
hits; qualifiers weight them.

### 1. Auth / roles (structural)

- **Where to look:** every `Story #NN … .md` Card line (`As a <role>, I can …`); `epic.md >
  ## NFRs` security constraint; feature/story workspace/invite/admin language and
  value-to-whom tags.
- **Keywords:** `As a `, `As an `, `admin`, `owner`, `member`, `manager`, `invite`, `workspace`, `team`, `organization`, `tenant`, `role`, `permission`, `who can`, `not see`.
- **Implication:** Better Auth + Postgres RLS tenant isolation. Census the distinct roles;
  2–3 tiers is the common shape and needs no extra infrastructure; more roles stay app-layer.
  Never hand-rolled auth, never platform-bound auth (Supabase Auth breaks the portability
  rule).
- **Tier:** (a) covered by the house stack.
- **Verification question:** none — structural. Census the roles, do not ask.

### 2. Instrumentation (structural)

- **Where to look:** `epic.md > ## Leading Indicators`; `epic.md > ## Open Measurements`;
  each feature's `## Success signal` **Meter** line.
- **Keywords:** `Leading Indicator`, `Open Measurement`, `Meter`, `measure`, `track`, `% of`, `per week`, `baseline`, `target`, `conversion`, `retention`.
- **Implication:** event capture / analytics is a **build requirement**, present even when no
  story mentions a dashboard. Every number the epic promises to watch must be emitted; the
  event schema and capture wiring belong in the walking skeleton.
- **Tier:** (a) covered by the house stack.
- **Verification question:** none — structural.

### 3. Payments

- **Where to look:** story files and feature files across the MVP set.
- **Keywords:** `pay`, `payment`, `subscribe`, `subscription`, `plan`, `pricing`, `invoice`, `refund`, `trial`, `checkout`, `billing`, `dues`, `charge`, `card`.
- **Implication:** Stripe Checkout + Billing + a **webhook endpoint** + **idempotent
  fulfillment** on Inngest. Routed through the **product-classification rule** (below).
- **Tier:** (b) service-addition.
- **Verification question:** none for the trigger — but the product-classification rule
  injects the business question into **Phase 3 — Constraint interview** ("who does your
  accounting?"), and its classification answer selects the processor.

**Product-classification rule** (named here; Phase 3 and `house-stack.md` refer to it by this
name). Work it in this order:

1. **Classification first — ask what is being sold:** a **SaaS subscription**, a **digital
   product**, **professional services**, or **physical goods**.
2. **Tax-burden-vs-cost second — the honest discussion:** professional **services** are
   generally **not** sales-taxable; **SaaS** taxability **varies by US state and by country**;
   **digital products** are **widely taxed**. The choice presented:
   - **Merchant-of-record** (Paddle / Lemon Squeezy — they remit the tax, **~5%+50¢**) — buys
     away the tax-filing problem;
   - **Stripe + Stripe Tax** — cheaper, but tax **filing stays the founder's problem**;
   - **plain Stripe** — right when what is sold is **non-taxable** (professional services).
3. **Recommendation third:** name the pick with its reason, tied to the classification and
   the founder's appetite for handling filings.

### 4. Uploads

- **Where to look:** story files.
- **Keywords:** `upload`, `attach`, `attachment`, `photo`, `image`, `document`, `file`, `import`, `PDF`, `scan`, `receipt`, `avatar`.
- **Implication:** **presigned direct-to-bucket** uploads (never proxy bytes through the app
  server). Download-heavy profiles → **Cloudflare R2** for zero egress. Never Vercel Blob or
  Supabase Storage as primary (portability rule).
- **Tier:** (b) service-addition (R2).
- **Verification question:** none.

### 5. Search

- **Where to look:** story files.
- **Keywords:** `search`, `find`, `filter`, `lookup`, `search-as-you-type`, `autocomplete`, `typeahead`, `instant results`, `as they type`.
- **Implication:** basic **find** → Postgres **tsvector** (reuse the one database).
  **search-as-you-type** / typeahead over large corpora → **Meilisearch / Typesense**. The
  verification question decides which.
- **Tier:** (a) covered by the house stack for basic find; escalates to (b) service-addition
  only when search-as-you-type is confirmed.
- **Verification question:** **"find"** vs **"search-as-you-type"** (see **Verification
  questions**).

### 6. Notifications

- **Where to look:** story files and feature files.
- **Keywords:** `notify`, `notification`, `remind`, `reminder`, `alert`, `email`, `text`, `SMS`, `push`, `message them`.
- **Implication:** **Resend** (+ React Email) is the default channel and is covered by the
  house stack; durable send/retry rides Inngest. **"text them"** → an **SMS branch** on
  Twilio, which carries **A2P 10DLC registration fees + days of approval lead time**. Push →
  PWA / web-push.
- **Tier:** (a) email via Resend covered by the house stack; (b) service-addition for SMS.
- **Verification question:** **"notify them"** vs **"text them"** (see **Verification
  questions**).
- **Lead-time injection:** when the SMS branch is live, the A2P 10DLC **days of approval lead
  time** **injects a timeline question into Phase 3 — Constraint interview** — the number
  registration can gate a launch date, so it must surface while timeline is being set.

### 7. Real-time

- **Where to look:** story files; `epic.md > ## NFRs`.
- **Keywords:** `live`, `real-time`, `realtime`, `instantly`, `without refreshing`, `updates automatically`, `see changes`, `presence`, `who's online`, `in real time`.
- **Implication:** the verification question decides. **Polling / fresh-on-load → nothing**
  (house stack). **Live data / fan-out → a portable pub-sub layer (Pusher / Ably)**.
  **Presence / co-editing → the live-collaboration swap** (Liveblocks or PartyKit / Durable
  Objects). **Portability rule: never Supabase Realtime** — it is platform-bound and re-tools
  the Azure path. Use only a portable pub-sub service.
- **Tier:** (a) polling covered by the house stack; (b) service-addition for the pub-sub
  layer; (c) architecture-bending for live collaboration.
- **Verification question:** **"live"** vs **"fresh"** (see **Verification questions**).

### 8. Reporting

- **Where to look:** story files, feature files, `## Success signal` outputs.
- **Keywords:** `report`, `download`, `export`, `chart`, `dashboard`, `CSV`, `PDF`, `summary`, `analytics view`, `spreadsheet`.
- **Implication:** CSV **streaming** is trivial (house stack); **PDF** generation → a
  **background job** on Inngest; **dashboards** → **SQL aggregates + Recharts**. No BI tools
  at founder scale — the one Postgres serves the numbers.
- **Tier:** (a) covered by the house stack.
- **Verification question:** none.

### 9. AI features

- **Where to look:** story files, feature files, `epic.md > ## Benefit Hypothesis` (to test
  whether AI is the *differentiator*).
- **Keywords:** `suggest`, `summarize`, `summary`, `draft`, `chatbot`, `chat`, `extract`, `recommend`, `generate`, `AI`, `search by meaning`, `semantic`, `smart`.
- **Implication:** AI **as a feature** → **Vercel AI SDK** (streaming chat, `generateObject`
  extraction) + a **model-API cost line** (per-token — flagged in budget). "search by
  meaning" → **pgvector RAG** (reuse the one Postgres, under ~10M vectors). AI **as the
  product** (real ML workloads, Python-native libs, cited to the Benefit Hypothesis) → a
  **Python FastAPI sidecar** — a high-threshold tier-1 swap and the one place an innovation
  token may be spent.
- **Tier:** (a) pgvector RAG covered by the house stack; (b) service-addition for model APIs;
  (c) architecture-bending only when AI is the product (the sidecar).
- **Verification question:** none — but classify feature-vs-product against the Benefit
  Hypothesis before spending a token.

### 10. Integrations

- **Where to look:** `epic.md > ## NFRs` compatibility constraint; feature `## Dependencies`
  and `## NFR constraints`; story "syncs with X" language.
- **Keywords:** `sync`, `syncs with`, `integrate`, `integration`, `webhook`, `connect to`, `import from`, `Zapier`, `QuickBooks`, `Salesforce`, `pulls from`, `API of`.
- **Implication:** **inbound webhooks via Inngest** with **signature verification** and
  **idempotency** — no new service. **OAuth-based bidirectional sync** is flagged as a
  **scope multiplier** (token storage, refresh, per-provider quirks), priced in budget, not a
  new stack layer.
- **Tier:** (a) covered by the house stack for inbound webhooks; OAuth sync is a scope
  multiplier flagged in budget, not a new service.
- **Verification question:** none.

### 11. API consumers

- **Where to look:** story files ("our customers' developers", "other tools pull data");
  `epic.md > ## Benefit Hypothesis` / `## NFRs`.
- **Keywords:** `developer`, `developers`, `API access`, `our API`, `pull data`, `third-party`, `partner`, `public API`, `rate limit`, `API key for customers`, `integrate with us`.
- **Implication:** the **API-first baseline already exists** (a non-negotiable — every
  capability is OpenAPI-documented with app-managed API keys). This signal adds **only the
  partner/developer-program extras** from tier (c): outbound webhooks, per-customer rate
  limits, versioning guarantees. **Challenge it** — rarely a genuine MVP need.
- **Tier:** (c) architecture-bending for the partner program; the API-first baseline itself is
  a non-negotiable, not a signal-driven addition.
- **Verification question:** none — but challenge: is this a real first-bet need, or a
  someday? Settle it in Phase 2 regardless.

### 12. i18n

- **Where to look:** story files; `epic.md > ## NFRs`.
- **Keywords:** `Spanish`, `language`, `translate`, `translation`, `locale`, `multi-language`, `multilingual`, `internationalization`, `i18n`, `currency`, `date format`.
- **Implication:** **next-intl + `[locale]` route structure scaffolded day one** — retrofitting
  routing is the expensive part. Distinguish **real UI translation** from **mere currency /
  date formatting** (formatting alone is not i18n routing and needs no route restructure).
- **Tier:** (c) architecture-bending (route structure — settle before scaffold).
- **Verification question:** "Do users need the interface itself in another language, or just
  their local currency and date format?" — translation forces the route structure; formatting
  does not.

### 13. Offline / PWA

- **Where to look:** story files.
- **Keywords:** `offline`, `in the field`, `without signal`, `no connection`, `syncs later`, `on their phone`, `install`, `PWA`, `works on the go`, `add to home screen`.
- **Implication:** **three escalating levels** — **installable shell** (PWA manifest +
  service worker) → **offline reads** (cache data for read-only use) → **offline writes**
  (local writes + a sync/conflict engine). **Offline writes is the most architecture-bending
  signal in the whole taxonomy** and must be settled before scaffold. **"usable on phone"
  alone = responsive design, not a PWA** — do not build offline machinery for a
  small-screen ask.
- **Tier:** (a) responsive "usable on phone" covered by the house stack; installable shell and
  offline reads are additive settings; **offline writes / sync is (c) architecture-bending**.
- **Verification question:** **"works on phone"** vs **"works offline"** (see **Verification
  questions**).

## Verification questions

Fire only for a **detected-ambiguous** signal, in Phase 2, one per turn. Each disambiguates
one axis; the answer picks the branch.

1. **Real-time — "live" vs "fresh":** "When you say it updates live — do you mean the screen
   changes by itself the moment someone else acts (**"live"**), or is it enough that the data
   is up to date whenever they next open or refresh the page (**"fresh"**)?" → *live* →
   portable pub-sub layer; *fresh* → nothing beyond the house stack.
2. **Offline — "works on phone" vs "works offline":** "Does it need to look right on a small
   screen (**"works on phone"**), or actually keep working with no signal at all (**"works
   offline"**)?" → *phone* → responsive design; *offline* → the PWA levels ladder (installable
   shell / offline reads / offline writes).
3. **Search — "find" vs "search-as-you-type":** "When they search, do they type a term and
   get a list of matches (**"find"**), or do results filter as they type each letter
   (**"search-as-you-type"**)?" → *find* → tsvector; *search-as-you-type* → Meilisearch /
   Typesense.
4. **Notifications — "notify them" vs "text them":** "When you say notify them — is email
   enough (**"notify them"**), or does it specifically have to be a phone text (**"text
   them"**)?" → *notify* → Resend email; *text* → the Twilio SMS branch (A2P 10DLC fees +
   the lead-time question injected into Phase 3 — Constraint interview).

## NFR thresholds

Read from `epic.md`'s quantified NFRs. Three columns: what changes nothing, what forces a
setting, what forces the Azure escalation.

| NFR | Changes nothing when | Forces a setting when | Forces Azure (Tier 2) when |
| --- | --- | --- | --- |
| Availability | ≤ 99.9% aspirational | — | contractual SLA or ≥ 99.99% |
| Latency | p95 ≥ 500ms | p95 ≤ 200–300ms intermittent → always-on DB | p95 ≤ 100ms globally → multi-region |
| Scale | ≤ ~1,000 concurrent (≈ ≤ 700 RPS) | sustained beyond → DB compute sizing | — |
| RPO | ≤ 24h (daily backups) | ≤ 1h → PITR (+~$100/mo) | — |
| RTO | — | any stated minutes → challenge; nothing self-serve guarantees it | — |
| Residency | vendor offers the region | — | Canada/EU/sovereignty beyond vendor regions |

**Uptime disambiguation — mandatory whenever the epic carries an availability NFR:** ask
whether the number is **"promised in a contract, or a hope?"** A contractual SLA or ≥ 99.99%
arms the Azure escalation; an aspiration changes nothing.

**Pooling is unconditional, not threshold-gated.** The pooled connection string ships in
every stack regardless of scale — the real ceiling under serverless is **Postgres connections**,
not RPS.

**NFRs absent from the store — never a blocker.** Apply the founder-scale defaults (the
"changes nothing" column: **≤ 99.9% aspirational, p95 ≥ 500ms, RPO 24h**) and ask only the
**1–2 threshold questions the demand profile makes load-bearing**: the uptime
contract-or-hope question if customers are promised anything, and recovery tolerance if the
app holds business-critical data. STACK.md then carries an **assumptions block** — "no NFRs
were recorded; this stack assumes X/Y/Z — re-run refine-epic to firm these up" — and the gaps
appear in the **confidence appendix**.

## Scoping rules

- **mvp-tags only.** Derive the stack from `tags: [mvp]` features only — the actual first bet.
- **Contingent = "stack must not preclude", never sized for.** Contingent features are noted
  so the stack does not paint them into a corner, but they are never sized, priced, or built
  for. (Do not size for the pitch deck.)
- **Provenance-weighted numbers.** Every load / volume number is weighted by its provenance
  tag — `measured` (points at a source) outweighs `SME-estimate` outweighs `guess-to-verify` —
  and by the feature's `evidence` grade. A guess-to-verify volume never forces a paid tier on
  its own.
- **Enabler-feature check.** Match `featureType: enabler-architecture | enabler-infrastructure`
  features against proposed stack work so the skill **never proposes duplicate stack work**;
  the evidence checkpoint also marks features that may never be built at all.
- **Real Options plug-in.** Real Options ledger entries are pre-existing deferral machinery —
  plug tier-(c) "decide-later" calls into them rather than forcing a guess now.
- **Validate-manually ("no-code-yet") flag.** Features whose stack cost **vanishes if
  fulfilled by hand first** (a payment link instead of Stripe, manual onboarding instead of an
  invite flow) get a **"no-code-yet" annotation offered in Phase 2** — the cheapest way to
  keep a service off the bill until the bet is proven.
