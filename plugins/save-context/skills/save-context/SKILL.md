---
name: save-context
description: Use right before you /clear — writes this session's working state to a handoff file in the project's auto-memory, indexes it in MEMORY.md, and prints a restore prompt to paste after clearing. It saves; you run /clear.
---

# Save working context before /clear

Write a tight, structured snapshot of THIS session's live working state to a durable handoff file, so the next session (after the user runs `/clear`) rehydrates it automatically via the auto-memory system. Then hand control back — the user runs `/clear` themselves (you cannot, and a skill never should).

## Where to write it

Write into **this project's auto-memory directory** — the same directory as the `MEMORY.md` shown in your memory context this session (e.g. `…/.claude/projects/<munged-project-path>/memory/`). That directory's `MEMORY.md` index auto-loads every new session, which is what makes the restore automatic. Use the CURRENT project's dir — never another project's.

If this project has **no** auto-memory directory, fall back to `.claude/session-handoff.md` in the repo root and tell the user to ask you to read it next session (no auto-load in that case).

## Steps

1. **Write the handoff** to `session-handoff.md` in the memory directory — **overwrite** it (keep only the latest; this is a rolling snapshot, not an accumulating log). Use this shape:

   ```markdown
   ---
   name: session-handoff
   description: Live working-state handoff for resuming after /clear — read this first next session, then continue.
   metadata:
     type: project
   ---

   # Session handoff — <one-line task title>
   **Saved:** <today's date, absolute>

   ## Where we are
   <2-4 sentences: the current task and its status.>

   ## Next step (do this first on resume)
   - <the single most immediate action>

   ## Open threads
   - <other unresolved items, in priority order>

   ## In-flight branches / PRs / deploys
   - <branch, PR #+full URL, deployed version — only what is actually mid-flight>

   ## Locked decisions & constraints
   - <decisions already made + why, so they are not re-litigated>

   ## Gotchas / commands learned this session
   - <session-specific commands, auth/firewall/setup steps, flaky bits>
   ```

   Be concrete and current. Capture exactly what a fresh session would otherwise have to reconstruct, and **skip** anything already obvious from the repo, git history, or CLAUDE.md. Convert relative dates to absolute.

2. **Index it once** in `MEMORY.md` (same directory). Ensure a single, prominent pointer near the top:

   `- [Session Handoff](session-handoff.md) — RESUME HERE: <one-line hook of the next step>`

   If a `Session Handoff` line already exists, update its hook **in place** — do not duplicate.

3. **Confirm, then display the exact restore prompt.** Tell the user in one line: handoff saved to `session-handoff.md`, indexed in `MEMORY.md`, safe to `/clear` (which is theirs to run).

   Then output the **exact restore prompt** for them to copy-paste as their FIRST message in the new session after `/clear` — in its own fenced block so it's trivially copyable:

   ```
   Resume the "<task title>" session: read session-handoff.md (the Session Handoff linked in MEMORY.md) and continue from "Next step".
   ```

   Fill `<task title>` with the handoff's actual title. The prompt is self-contained — even though the handoff auto-loads via the `MEMORY.md` index, pasting this guarantees the fresh session reads the file and resumes from the right place. Present it clearly, e.g.: *"After `/clear`, paste this to resume:"* followed by the block.

## Notes

- **Rolling, not durable.** `session-handoff.md` is live working state — overwrite it each save. It is NOT a durable fact (those are normal memories); once work has clearly moved past it, the next save simply overwrites it.
- **You cannot run `/clear`** (skills can't invoke built-in commands, and nothing survives a clear except this saved file + the auto-loading index). Save, then stop and let the user clear.
- **Keep it a resumption brief, not a transcript** — the goal is the fastest possible warm start, not completeness.
