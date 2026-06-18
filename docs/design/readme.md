# TekFlow Design Docs

This directory contains the design guidance for TekFlow.

TekFlow uses a mixed design reference system, but the final UI must remain unified.

## Reading Order for Codex / AI Agents

When implementing or modifying TekFlow UI, read the files in this order:

```text
1. docs/design/README.md
2. docs/design/design.md
3. docs/design/references/*.md as needed
```

## File Structure

```text
docs/design/
├── README.md
├── design.md
└── references/
    ├── mintlify/
    ├── linear.app/
    └── notion/
```

## Design Source of Truth

`docs/design/design.md` is the final TekFlow design guide.

The files inside `docs/design/references/` are only style references.

Do not blindly copy any single reference style.

Instead, apply them based on page type:

```text
/wiki       → use Mintlify-inspired documentation style
/dashboard  → use Linear-inspired command workspace style
/school     → use Notion-inspired notice board / database card style
/share      → reuse /wiki reading style for unlisted link access
/           → use a clean TekFlow landing style
```

## Page Style Mapping

### Public Knowledge Base `/wiki`

Reference:

```text
docs/design/references/mintlify.md
```

Use this for:

* Public technical notes
* Operations manuals
* SOPs
* Tutorials
* Project reviews
* Long-form Markdown articles

The `/wiki` area should feel like a clean modern documentation site.

Focus on:

* Reading comfort
* Clear article layout
* Sidebar navigation
* Right-side table of contents
* Good Markdown rendering
* Code block readability
* Professional public presentation

---

### Private Dashboard `/dashboard`

Reference:

```text
docs/design/references/linear.md
```

Use this for:

* Admin dashboard
* Content management
* School Notice management
* Category management
* Tag management
* Project label management
* Attachment management
* Settings

The `/dashboard` area should feel like a focused command workspace.

Focus on:

* High information density
* Fast operation
* Clean tables
* Strong filtering
* Clear statuses
* Low visual noise
* Efficient private workflow

---

### School Board `/school`

Reference:

```text
docs/design/references/notion.md
```

Use this for:

* School notices
* Exam arrangements
* Assignment deadlines
* Course events
* Group tasks
* Today / this week / upcoming / expired notice sections

The `/school` area should feel like a clear notice board.

Focus on:

* Card readability
* Deadline visibility
* Event date
* Start time
* End time
* Location
* Priority
* Status
* Mobile-friendly scanning

---

## Important Rule

TekFlow must not look like three separate products.

The references are used for direction only.

The final UI must share:

* One color system
* One typography system
* One spacing system
* One badge system
* One card style
* One button style
* One Markdown style

V1.0.0 uses the light theme only. Dark mode is a future extension unless the PRD is updated.

## Global TekFlow Style

TekFlow should feel:

```text
Clean
Readable
Professional
Organized
Efficient
Technical
Personal
Calm
```

Avoid:

```text
Overly decorative UI
Heavy gradients
Cyberpunk dark UI
Noisy blog layouts
Too many colors
Inconsistent cards
Inconsistent spacing
Mixing unrelated design systems
```

## Implementation Stack

Recommended UI stack:

```text
Tailwind CSS
shadcn/ui
Lucide Icons
Inter
Geist Mono
```

Use `docs/design/design.md` for the final tokens, colors, spacing, badges, components, and layout rules.

Use the reference files only when a page needs more detailed style inspiration.
