#!/usr/bin/env python3
# Claude Code status line — model, directory, git branch, context bar, cost, session time.
#
# Install:
#   1. Save this file as ~/.claude/statusline.py
#   2. Add to ~/.claude/settings.json:
#        "statusLine": {
#          "type": "command",
#          "command": "python3 ~/.claude/statusline.py",   // Windows: "python C:/Users/<you>/.claude/statusline.py"
#          "padding": 0
#        }
#   3. Start a new Claude Code session.
#
# Or skip all that: paste this script into Claude Code and say
# "set this up as my status line" — it will handle your platform's details.
import json, sys, subprocess, os

sys.stdout.reconfigure(encoding="utf-8")  # Windows pipes default to cp1252, which can't encode the emoji

data = json.load(sys.stdin)
model = data['model']['display_name']
effort = data.get('effort', {}).get('level') or ''
if effort:
    model = f"{model} · {effort}"
directory = os.path.basename(data['workspace']['current_dir'])
cost = data.get('cost', {}).get('total_cost_usd', 0) or 0
pct = int(data.get('context_window', {}).get('used_percentage', 0) or 0)
duration_ms = data.get('cost', {}).get('total_duration_ms', 0) or 0

CYAN, GREEN, YELLOW, RED, RESET = '\033[36m', '\033[32m', '\033[33m', '\033[31m', '\033[0m'

bar_color = RED if pct >= 90 else YELLOW if pct >= 70 else GREEN
filled = pct // 10
bar = '█' * filled + '░' * (10 - filled)

mins, secs = duration_ms // 60000, (duration_ms % 60000) // 1000

try:
    branch = subprocess.check_output(['git', 'branch', '--show-current'], text=True, stderr=subprocess.DEVNULL).strip()
    branch = f" | 🌿 {branch}" if branch else ""
except:
    branch = ""

session = data.get('session_name') or ''
if len(session) > 40:
    session = session[:39] + '…'
session = f" | 🏷️ {session}" if session else ""

limits = []
for label, key in (('5h', 'five_hour'), ('7d', 'seven_day')):
    p = data.get('rate_limits', {}).get(key, {}).get('used_percentage')
    if p is not None:
        c = RED if p >= 90 else YELLOW if p >= 70 else GREEN
        limits.append(f"{label} {c}{int(p)}%{RESET}")
rate = f" | ⏳ {' '.join(limits)}" if limits else ""

print(f"{CYAN}[{model}]{RESET} 📁 {directory}{branch}{session}")
print(f"{bar_color}{bar}{RESET} {pct}% | {YELLOW}${cost:.2f}{RESET} | ⏱️ {mins}m {secs}s{rate}")
