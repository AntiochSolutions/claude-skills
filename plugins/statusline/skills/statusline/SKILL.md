---
name: statusline
description: Use when the user asks to set up, install, update, or fix the Antioch status line — or to show model, reasoning effort, git branch, session name, context usage, cost, or rate limits in their Claude Code status bar. Also use to re-install after a plugin update.
user-invocable: true
---

# Install the Antioch status line

Installs a two-line status line for Claude Code from the script bundled with this skill:

```
[Fable 5 · xhigh] 📁 my-project | 🌿 main | 🏷️ Fix the flaky deploy pipeline
████░░░░░░ 42% | $1.23 | ⏱️ 12m 34s | ⏳ 5h 31% 7d 23%
```

**Core rule: copy the bundled script verbatim. Never regenerate, retype, or "improve" it** — the
bundled copy is the tested, versioned artifact; updates ship through the plugin. The script is at
`assets/statusline.py` under this skill's base directory (shown as "Base directory for this skill"
when the skill loads).

## Steps

1. **Copy the script** from `<base-dir>/assets/statusline.py` to `~/.claude/statusline.py`
   (the user's real home). Overwriting an existing copy is correct — that is how updates install.
2. **Pick the Python launcher.** Try in order: `python3 --version`, `python --version`,
   `py --version`. Use the first that reports Python 3.x. If none does, stop and tell the user to
   install Python 3 — do not configure a broken command.
3. **Configure `~/.claude/settings.json`.** Read it first. Add or replace ONLY the `statusLine`
   key, preserving every other setting exactly:

   ```json
   "statusLine": {
     "type": "command",
     "command": "<launcher> <absolute path to statusline.py>",
     "padding": 0
   }
   ```

   Use the absolute path with forward slashes on every platform (e.g.
   `python C:/Users/dan/.claude/statusline.py`) — `~` does not reliably expand on Windows.
4. **Verify before claiming success.** Pipe a sample payload through the exact configured command:

   ```bash
   echo '{"model":{"display_name":"Test"},"effort":{"level":"high"},"session_name":"demo","workspace":{"current_dir":"/tmp/x"},"cost":{"total_cost_usd":1.5,"total_duration_ms":754000},"context_window":{"used_percentage":42},"rate_limits":{"five_hour":{"used_percentage":31},"seven_day":{"used_percentage":23}}}' | <configured command>
   ```

   Expect two lines: `[Test · high] 📁 x | 🏷️ demo` and a bar line ending `⏳ 5h 31% 7d 23%`.
5. **Tell the user:** restart the session (or open a new one) to see it. To update later:
   `/plugin marketplace update antioch-skills`, then ask to set up the status line again. To
   uninstall: remove the `statusLine` key from `~/.claude/settings.json`.

## Notes

- The script needs only the Python 3 standard library, and forces UTF-8 output itself — do not add
  `-X utf8` or `PYTHONIOENCODING` to the command.
- Segments degrade gracefully: on Claude Code versions that don't send `effort`, `session_name`, or
  `rate_limits`, those segments simply don't render. No version check needed.
- Emoji require a UTF-8 terminal (Windows Terminal, iTerm2, and modern Linux terminals all work).

## Common mistakes

| Mistake | Instead |
|---|---|
| Writing the script from memory or the example above | Copy `assets/statusline.py` byte-for-byte |
| Rewriting all of settings.json | Edit only the `statusLine` key; keep everything else |
| `command: "python3 ~/.claude/statusline.py"` on Windows | Absolute path, forward slashes, correct launcher |
| Claiming success without running step 4 | Verify with the sample payload first |
