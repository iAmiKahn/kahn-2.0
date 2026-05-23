# Chat → Code Handoff Protocol

## Purpose
Structured communication channel between Claude Chat (strategic thinking) and Claude Code (execution). Eliminates manual copy-paste and ensures nothing gets lost or misinterpreted.

## How It Works

### Chat writes to: `data/handoff/inbox.json`
```json
[
  {
    "id": "handoff_timestamp",
    "from": "claude_chat",
    "date": "2026-04-07",
    "priority": "high",
    "type": "directive|decision|update|question",
    "subject": "Short description",
    "body": "Full content of the handoff",
    "domains": ["legal", "financial"],
    "actionRequired": true
  }
]
```

### Code reads on session start
Claude Code checks `data/handoff/inbox.json` at the beginning of each session and processes any new items.

### Code writes acknowledgments to: `data/handoff/outbox.json`
```json
[
  {
    "id": "ack_timestamp",
    "handoffId": "handoff_timestamp",
    "status": "completed|in_progress|blocked|clarification_needed",
    "summary": "What was done",
    "date": "2026-04-07"
  }
]
```

## File Locations
- **Inbox:** `C:\Kahn 2.0\data\handoff\inbox.json` (Chat → Code)
- **Outbox:** `C:\Kahn 2.0\data\handoff\outbox.json` (Code → Chat)
- **Protocol:** This file

## Rules
1. Each handoff item has a unique ID
2. Items are never deleted, only marked as processed
3. High-priority items surface in the daily narration
4. Questions from Code appear in the outbox for Chat to answer
5. Directives must specify which domains they affect
