#!/usr/bin/env bash
# .claude/hooks/review.sh
INPUT=$(cat)
case "$INPUT" in *'"stop_hook_active":true'*) exit 0 ;; esac

echo "Before finishing: review the changes with the my-code-reviewer subagent." >&2
echo "Report any blockers." >&2

exit 2
