# Board mode — optional Miro card-wall protocol

Companion to `SKILL.md` and `interview-guide.md`. This file implements spec §6a one-to-one: when Miro
MCP tools are connected and the SME accepts the offer, the interview runs in **card-wall mode** — the
shared wall from phases 4–5 becomes a real Miro board instead of a numbered text list. Load this file
only when card-wall mode is active; every other session runs entirely on `interview-guide.md` and
never mentions Miro.

**One skill, two media.** The interview itself — phases, question bank, linters, gates — is identical
in both modes; only the wall medium changes. Nothing here adds or removes a question, a phase, or a
rule from `interview-guide.md`; it only tells the agent how to mirror that same interview onto a
board.

---

## When this applies

- Card-wall mode runs only when **both** are true: Miro MCP tools are connected (see Detection &
  offer, below) **and** the SME accepts the offer. Either condition failing means: run the text
  protocol, full stop.
- The interview logic is identical in both media. Every phase, every question, every linter, every
  gate in `interview-guide.md` applies exactly as written — card-wall mode changes where the wall
  lives, not what the interview does.
- **Conversation state is canonical; the board is a mirror.** The capability-card model building up
  in dialog is the real record at every moment. The board exists to make that record visible and
  draggable — it never becomes a second source of truth to reconcile against.
- If any Miro call fails mid-session — a `layout_create`, a `layout_read`, anything — say so to the
  SME plainly and continue in text mode for the rest of the session, with no loss of state. The
  conversation already holds everything the board held; nothing needs to be reconstructed.

## Detection & offer

- Detect during phase 2 (Set expectations), before deciding how to phrase the expectations line —
  detection has to happen before the offer, and the offer has to happen before divergence starts.
- Run one ToolSearch call with this query:
  `select:layout_get_dsl,layout_create,layout_read,board_create,context_explore`
  At runtime these tool names may carry a server prefix (for example
  `mcp__claude_ai_Miro__layout_create`) — match on the suffix after the last `__`, not the full
  string, since the prefix isn't stable across environments.
- **If the query returns nothing, Miro isn't connected.** Run the text protocol from
  `interview-guide.md` and never mention Miro — not this session, not as an aside, not later if the
  SME brings up boards generally. Silence is the correct behavior, not an oversight.
- If the tools are present, offer card-wall mode as the single phase-2 question — one question, one
  answer, the same discipline as every other turn in this interview. Don't fold it into the
  expectations-setting line itself; ask it on its own turn. Verbatim:

  *"I can put our cards on a Miro board so you can drag them around yourself when we sort — want
  that, or shall we work right here in text?"*

- Accept either answer the SME gives for *how*: an existing board URL (inspect it with
  `context_explore` before writing anything, so a fresh session doesn't collide with what's already
  there) or a fresh board made with `board_create`.
- If declined, drop it — run the text protocol for the rest of the session and don't re-offer, and never
  mention Miro again this session — no asides, no 'what the board would show' comparisons.

## Tool mechanics

The single ToolSearch call from Detection & offer already loaded all five tools; do not issue another.
Here's what each does:

| Tool | Role |
| --- | --- |
| `layout_get_dsl` | Returns the DSL format spec — the prerequisite call, see below. |
| `layout_create` | Creates frames and sticky notes from DSL text. |
| `layout_read` | Reads existing board items back as DSL, including each item's parent frame. |
| `board_create` | Creates a fresh board when the SME doesn't supply one. |
| `context_explore` | Inspects an existing board the SME hands you before writing to it. |

- **Always call `layout_get_dsl` before the first `layout_create`.** Its output is the DSL format
  spec, and `layout_create` takes DSL text whose syntax isn't guessable — call it once per session,
  before the first item goes on the board, and treat its output as the authoritative reference for
  every `layout_create` call that follows.
- **Frames first, then stickies.** Create the frame an item will live in before creating the item —
  never create a sticky and try to assign it to a frame that doesn't exist yet.
- **Items use board-absolute coordinates.** Position each sticky inside its frame's region in
  absolute board space, not relative to another item.
- `layout_read` is the only way to know what the SME actually did to the board — it returns each
  item's current parent frame. Never infer an arrangement from memory; call `layout_read` before
  reasoning about the board's current state, every time.

## Divergence (phase 4)

- The moment a capability card is captured in dialog (`interview-guide.md`'s Divergent behavior
  mining phase), drop it onto the board as a sticky note — one sticky per card, verbatim SME wording,
  no summarizing, no trimming.
- **Color-code by `sourceTag`.** Pick three visually distinct sticky colors from whatever the DSL
  spec (from `layout_get_dsl`) offers, and hold the same mapping for the rest of the session:

  | `sourceTag` value | example color |
  | --- | --- |
  | `observed-step` | yellow |
  | `workaround` | orange |
  | `stated-request` | blue |

  Treat the specific colors as a suggestion, not a hard rule — what matters is three colors that are
  visually distinct and consistently applied for the whole session.
- Post a small legend text item on the board — off to one side, out of the working area — spelling
  out the color mapping in plain language, created once, early, before the first sticky lands. For
  example: `Legend: yellow = observed step, orange = workaround, blue = stated request`.
- **No frames, no grouping during this phase.** Stickies land loose, in whatever position is
  convenient — frames don't appear until clustering (phase 5). Grouping stickies now would be
  naming-before-settling in miniature.
- The filling wall does double duty: it's `interview-guide.md`'s "let's get past ~20 cards before we
  organize" quantity nudge, made visible. The SME watches the wall fill up instead of being told a
  number.

## Clustering (phase 5)

- Before the drag handoff, create **unlabeled** frames — titled `Group A`, `Group B`, `Group C`, …
  — one per provisional pile from the numbered-list playback in `interview-guide.md`'s Affinity
  clustering phase. **KJ's name-last rule holds on the board** exactly as it holds in text: a frame's
  title stays a bare letter until the pile inside it has settled and been named in dialog.
- Provisionally sort stickies into these frames yourself, mirroring the "here's a first sort"
  proposal from the text protocol — move each sticky into its frame, don't recreate it.
- Then hand control to the SME with the drag handoff. Verbatim:

  *"Drag cards to wherever they belong — make new piles if you need them, park anything that doesn't
  fit between piles — and tell me when you're done."*

- While the SME is dragging, don't read the board — wait for "done." Acting on a half-finished
  arrangement produces a reflection that's already stale.
- On "done": call `layout_read`, and **diff the returned frame membership against the last known
  state** — every sticky that changed frames, every new frame the SME made, every sticky now sitting
  outside every frame.
- **Reflect every move back in words** before moving on — never silently accept the new arrangement.
  For example:

  *"you moved 'chase missing signatures' into the pile with the dispute items — tell me about that"*

- If the diff shows several moves, work through them one at a time, in the SME's words — the board
  doesn't relax `interview-guide.md`'s one-correction-per-turn discipline, it just supplies the
  corrections in a batch that gets unpacked one at a time.
- **Stickies sitting outside every frame are explicit ambiguity signals**, not stray clutter —
  resolve each one in dialog exactly like a text-mode singleton. Never silently fold an orphaned
  sticky into the nearest frame to tidy the board.
- Naming happens last: once a pile has settled and the SME has confirmed an intent phrase (per
  `interview-guide.md`'s Affinity clustering), retitle that frame from `Group A` to the intent
  phrase. Never retitle a frame ahead of that conversation.

## Story-map render (phase 11, optional)

- Optional and additive. Run it only after the canonical model and the markdown map
  (`output-template.md`) are already finished — the render re-presents what's already final; it
  doesn't produce anything new.
- One frame per feature, arranged left-to-right as columns in narrative-flow order — the same order
  the markdown map's Features section uses.
- Frame title: feature name plus its tags, e.g. `Faster onboarding — MVP, business`.
- Inside each frame, a text item holding the feature's hypothesis and success signal — the four-slot
  hypothesis and the Who-Does-What-By-How-Much line, verbatim from the canonical model.
- Beneath that, one sticky per story, walking-skeleton story first, then variations, discovery, and
  placeholders in the order `output-template.md` lists them.
- Two side frames outside the narrative-flow row: `Cross-cutting constraints` (the NFR constraint
  block) and `Parked` (parked items with their evidence).
- Say this to the SME, and mean it: the markdown map and the structured model are produced regardless
  of whether this render happens. The board render is an optional extra deliverable, never a
  substitute for either.

## Rules recap

1. **Never require Miro.** The text protocol in `interview-guide.md` is complete and sufficient on
   its own; card-wall mode only adds a medium, never a dependency.
2. **Never degrade the interview when it's absent.** Same phases, same question bank, same linters,
   same gates, whether or not a board exists.
3. **Never name frames before piles settle.** KJ's name-last rule applies on the board with the same
   force it has in text.
4. **Never act on an arrangement without re-reading the board first.** Call `layout_read` before
   every diff, every reflection, every claim about what's where.
5. **The board is never the artifact of record.** The canonical model and the markdown map
   (`output-template.md`) are what ships; the board is a working surface, always disposable.
