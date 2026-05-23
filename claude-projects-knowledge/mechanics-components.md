# Claude Projects — Component Mechanics

Last verified: 2026-05-16

## Component Inventory

A Claude Project consists of 12 discrete components:

1. Project Name
2. Project Description
3. Project Instructions (Custom Instructions)
4. Knowledge Base (uploaded files)
5. Conversations (chats within the project)
6. Project Memory
7. Artifacts
8. Connectors
9. Sharing/Permissions
10. Visibility Setting
11. Star/Pin
12. Archive State

---

## 1. Project Name

- User-facing label for organization. [DOCUMENTED]
- Claude CANNOT access the project name. It does not influence behavior. [DOCUMENTED]
- No documented character limit.
- For human navigation only.

## 2. Project Description

- User-facing note for context. [DOCUMENTED]
- Claude CANNOT access the project description. [DOCUMENTED]
- No documented character limit.
- For human reference only.

## 3. Project Instructions (Custom Instructions)

- Injected as system-level content into every conversation within the project. [DOCUMENTED]
- No documented character/token limit on the field itself. [OBSERVED — community reports accepting very long inputs]
- Stacks with account-level "Instructions for Claude" (profile settings). Profile loads first, project instructions layer on top. [DOCUMENTED]
- Token cost: Instructions consume context window tokens on EVERY message. Longer instructions = less room for conversation + knowledge. [INFERRED from architecture]
- Scope: Affects ALL chats within the project, cannot be overridden per-conversation. [DOCUMENTED]
- Works independently of or combined with Styles (which control formatting/tone, not context). [DOCUMENTED]
- Precedence: Organization instructions > Project instructions > Profile preferences > Styles. [DOCUMENTED]

## 4. Knowledge Base (Uploaded Files)

### Limits
- Per-file size: 30MB [DOCUMENTED]
- File count: Unlimited [DOCUMENTED]
- Total capacity: Context window (200K-500K tokens) + RAG expansion (up to 10x) [DOCUMENTED]

### Supported Formats
- Documents: PDF, DOCX, CSV, TXT, HTML, ODT, RTF, EPUB, JSON, XLSX [DOCUMENTED]
- Images: JPEG, PNG, GIF, WebP [DOCUMENTED]
- Audio: MP3, WAV (for transcription) [DOCUMENTED]
- Code: .py, .js, .html, .css (processed as plain text) [OBSERVED]

### PDF Behavior
- Under 100 pages: full visual + text analysis (multimodal) [DOCUMENTED]
- Over 1000 pages: text extraction only [DOCUMENTED]
- XLSX requires code execution enabled [DOCUMENTED]

### Dual-Mode Retrieval (Critical Mechanic)
- Below context threshold: ALL knowledge files fully injected into context. Every token present in every conversation. [DOCUMENTED]
- Above context threshold: RAG activates automatically. Claude uses "project knowledge search tool" to retrieve relevant chunks only. Visual indicator appears. [DOCUMENTED]
- RAG expands capacity approximately 10x beyond context window. [DOCUMENTED]
- Reversible: Remove files below threshold and it reverts to full injection. [DOCUMENTED]
- No user control over chunking, embeddings, or retrieval parameters. Fully managed by Anthropic. [DOCUMENTED]
- RAG may also trigger based on file count (~13 files) regardless of total tokens. [OBSERVED — community testing, unconfirmed by Anthropic]

### Caching
- Project knowledge is CACHED and does NOT count against usage rate limits when reused. [DOCUMENTED]
- First message pays token cost to load into cache. Subsequent messages reuse at 10% cost. [DOCUMENTED]

## 5. Conversations (Chats Within a Project)

- Every new conversation automatically receives: Project instructions + Knowledge files + Project memory. [DOCUMENTED]
- Conversations are ISOLATED from each other. Chat A cannot see Chat B content. [DOCUMENTED]
- Context is NOT shared across chats unless information is in the knowledge base or captured in project memory. [DOCUMENTED]
- Moving existing chats INTO a project: dropdown > "Add to project." Bulk move available. [DOCUMENTED]
- Model selection is per-conversation, NOT per-project. Each chat can use a different model. [DOCUMENTED]
- Switching model mid-conversation opens a new chat. [DOCUMENTED]
- Context window per conversation: 200K-500K tokens depending on model (Sonnet 4.6/Opus 4.6/4.7 = 500K on paid plans). [DOCUMENTED]
- Incognito chats within a project: excluded from memory synthesis. [DOCUMENTED]

## 6. Project Memory

- Auto-generated: Claude synthesizes patterns from conversations every 24 hours. [DOCUMENTED]
- Isolated per project: Each project has its own separate memory space. [DOCUMENTED]
- Non-project chats have their own separate memory. [DOCUMENTED]
- What it remembers: Role, preferences, communication style, technical patterns, ongoing project details. [DOCUMENTED]
- What it does NOT remember: Raw conversation transcripts. It is a synthesized abstraction. [DOCUMENTED]
- User controls: View summaries, edit memories directly, toggle on/off in Settings > Capabilities. [DOCUMENTED]
- Memory citations: When referencing previous context, shows citations linking to original chats. [DOCUMENTED]
- Moving chats between projects affects which memory they inform. [DOCUMENTED]
- Available to all users (expanded March 2026). [DOCUMENTED]

## 7. Artifacts

- Generated outputs in a side panel: code, documents, HTML, SVG, React components, diagrams. [DOCUMENTED]
- NOT automatically added to project knowledge. Explicit "Add to Project Knowledge" button required. [DOCUMENTED]
- Persistent storage on paid plans: up to 20MB per artifact, data persists across sessions. [DOCUMENTED]
- Created when content is "significant and self-contained, typically over 15 lines." [DOCUMENTED]
- Can maintain state across sessions (journals, trackers) when published with storage. [DOCUMENTED]

## 8. Connectors

- Live integrations: Google Drive, Gmail, Google Calendar, GitHub, Microsoft 365, Slack. [DOCUMENTED]
- Only available in PRIVATE projects (Team/Enterprise). [DOCUMENTED]
- Claude inherits each user's permissions from the connected service. [DOCUMENTED]
- Free plan: limited to 1 custom connector. [DOCUMENTED]
- GitHub: browse repos, select specific files/folders to include. [DOCUMENTED]
- Google Drive: only for Files in private projects (disabled for shared). [DOCUMENTED]
- Chats with synced connector content cannot be shared. [DOCUMENTED]
- Known reliability issues: files may show "Connected" but be inaccessible. [OBSERVED]

## 9. Sharing & Permissions

- Personal plans (Free/Pro/Max): Projects are private. Limited sharing options. [DOCUMENTED]
- Team/Enterprise:
  - "Can use" = view + chat, no editing [DOCUMENTED]
  - "Can edit" = modify instructions, knowledge, member settings [DOCUMENTED]
  - Sharing methods: individual email, bulk email, organization-wide [DOCUMENTED]
- Individual conversations remain PRIVATE even in shared projects unless explicitly shared via link. [DOCUMENTED]
- After sharing a chat, new messages stay private until you click "Update." [DOCUMENTED]

## 10. Visibility Settings (Team/Enterprise Only)

- Public: Organization-wide access. [DOCUMENTED]
- Private: Invite-only access. [DOCUMENTED]
- Admins can disable public project creation org-wide. [DOCUMENTED]

## 11. Star/Pin

- Star projects for quick access from projects and chats list. [DOCUMENTED]
- From Projects page: three-dot menu > Star. From within project: star icon (upper right). [DOCUMENTED]

## 12. Archive/Delete

- Archiving: Resets ALL sharing permissions to private. Destructive and irreversible for sharing state. [DOCUMENTED]
- Archived projects appear at bottom of list. Conversations still accessible. [DOCUMENTED]
- Deletion: Must unarchive first, then three-dot menu > Delete > Confirm. [DOCUMENTED]

---

## Plan Feature Matrix (Max Plan — $100/month)

| Feature | Available | Notes |
|---------|-----------|-------|
| Unlimited projects | Yes | |
| All models (Opus, Sonnet, Haiku) | Yes | |
| 500K context window | Yes | On Sonnet 4.6 / Opus 4.6 / Opus 4.7 |
| RAG for projects | Yes | Auto-activates |
| Project memory | Yes | |
| Chat search within projects | Yes | |
| Knowledge file uploads | Yes | 30MB/file, unlimited count |
| Persistent artifacts | Yes | 20MB/artifact |
| Sharing/collaboration | Limited | Full sharing is Team/Enterprise only |
| Connectors | Limited | Personal plans have limited connector access |
| Usage volume | 5x Pro | Primary differentiator from $20 Pro plan |

---

## Historical Timeline

| Date | Event |
|------|-------|
| June 25, 2024 | Projects launched (Pro + Team) |
| September 2024 | Enterprise launched with 500K context + GitHub connector |
| August 2025 | Sharing permissions added (Can use / Can edit) |
| September 2025 | Per-project memory (Team/Enterprise) |
| October 2025 | Memory expanded to all paid users |
| February 2026 | Projects available to Free tier (5 max) |
| March 2, 2026 | Memory expanded to all users |
| March 13, 2026 | 1M context window GA |
| March 16, 2026 | RAG for Projects launched (all plans) |
| March 20, 2026 | Cowork Projects (desktop app) |
