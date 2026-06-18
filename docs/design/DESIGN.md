# TekFlow Design Guide

## 1. Design Direction

TekFlow is a personal knowledge workspace that combines:

* Public technical knowledge base
* Private admin dashboard
* School notice board
* Personal project and operations records

The UI should not feel like a generic blog, a pure task manager, or a flashy portfolio site.

TekFlow should feel like:

```text
A clean documentation-first workspace
+
A focused private command center
+
A clear school notice board
```

The overall design direction is:

```text
Docs-first Command Workspace
```

This means:

* Content readability comes first.
* Navigation should be clear.
* Status and visibility must be obvious.
* The interface should be calm, professional, and suitable for long-term use.
* Public pages should look polished enough to represent personal technical capability.
* Private pages should prioritize efficiency and information density.

---

## 2. Design References

TekFlow uses a mixed design reference strategy.

It does not copy one single product style.

Instead:

```text
/wiki       → Mintlify-inspired documentation style
/dashboard  → Linear-inspired command workspace style
/school     → Notion-inspired notice board / database card style
/share      → Same reading style as /wiki, without public listing/navigation assumptions
/           → Clean landing page with light personal branding
```

---

## 3. Global Style

### 3.1 Overall Feeling

The global UI should be:

* Clean
* Calm
* Technical
* Readable
* Lightweight
* Organized
* Professional
* Not overly decorative

Avoid:

* Heavy gradients
* Excessive animations
* Overly dark cyberpunk style
* Complicated dashboard widgets
* Blog-like noisy layouts
* Too many colors on one screen

---

## 4. Page-Level Style Rules

## 4.1 Public Knowledge Base `/wiki`

### Reference Style

`/wiki` should be mainly inspired by Mintlify-style documentation websites.

### Purpose

The `/wiki` area is used for public technical notes, operations manuals, SOPs, tutorials, and project reviews.

### Design Goals

* Long-form reading should be comfortable.
* Technical content should be easy to scan.
* Code blocks should be clear.
* Categories and tags should be easy to understand.
* Public content should look professional enough for personal branding.

### Layout

Recommended layout:

```text
Left sidebar       Main content       Right outline
Navigation         Article body       Table of contents
```

### Content Card

Each article card should show:

* Title
* Summary
* Category
* Tags
* Project label
* Published date
* Updated date

### Article Page

Each article detail page should show:

* Title
* Summary
* Category
* Tags
* Project label
* Published date
* Updated date
* Markdown body
* Attachments if available
* Right-side table of contents on desktop

### Visual Keywords

```text
Documentation
Readable
Developer-friendly
Structured
Minimal
Polished
```

---

## 4.1.1 Link Access `/share`

`/share/[slug]` is used for unlisted content.

It should reuse the article reading style from `/wiki`, but it must not imply the content is part of the public knowledge base.

Focus on:

* Clear title and metadata
* Comfortable Markdown reading
* Controlled attachment display
* No public category/sidebar listing that suggests discoverability

---

## 4.2 Private Dashboard `/dashboard`

### Reference Style

`/dashboard` should be inspired by Linear-style productivity tools.

### Purpose

The dashboard is the private working area for managing posts, school notices, categories, tags, projects, attachments, and settings.

### Design Goals

* Fast operation
* High information density
* Clear status display
* Good table layout
* Strong search and filtering
* Low visual noise
* Suitable for frequent personal use

### Layout

Recommended layout:

```text
Left sidebar
Top action/search bar
Main data table or editor panel
```

### Dashboard Areas

```text
/dashboard
├── Overview
├── Posts
├── School Notices
├── Categories
├── Tags
├── Projects
├── Attachments
└── Settings
```

### Table Style

Admin tables should show:

* Title
* Type
* Visibility
* Status
* Category
* Project
* Updated time
* Actions

### Visual Keywords

```text
Focused
Efficient
Dense
Calm
Command-center
Low-noise
```

---

## 4.3 School Board `/school`

### Reference Style

`/school` should be inspired by Notion-style database cards and notice boards.

### Purpose

The School Board is used for school-related notices, exams, assignments, deadlines, course events, and group tasks.

It is not just a normal article list.

It must emphasize:

* Event date
* Start time
* End time
* Deadline
* Location
* Course
* Priority
* Status

### Design Goals

* Students should quickly know what is coming next.
* Deadlines should be obvious.
* Urgent notices should stand out.
* Mobile reading should be clear.
* Cards should be easy to scan.

### Main Sections

```text
Upcoming Deadlines
Today
This Week
All Notices
Expired
```

### Notice Card Fields

Each School Notice card should show:

* Title
* Course name
* Event date
* Start time
* End time
* Deadline
* Location
* Priority
* Status

### Example Card

```text
【Important】Probability and Statistics Final Exam

Course: Probability and Statistics
Event Date: 2026-06-22
Start Time: 09:00
End Time: 11:00
Location: Teaching Building A301
Priority: Urgent
Status: Upcoming
```

### Visual Keywords

```text
Notice board
Card-based
Clear deadlines
Student-friendly
Mobile-friendly
Easy to scan
```

---

## 4.4 Home Page `/`

### Purpose

The home page introduces TekFlow and provides entry points.

### Suggested Sections

```text
Hero
Feature cards
Recent public wiki posts
School board entry
Login entry
```

### Main Entry Cards

```text
/wiki      Public Knowledge Base
/school    School Board
/login     Private Dashboard
```

### Visual Style

The home page can be slightly more branded than the rest of the product, but it should stay clean and restrained.

Avoid making it too much like a marketing SaaS landing page.

---

## 5. Color System

### 5.1 Main Colors

Recommended color direction:

```text
Primary: Indigo / Blue-purple
Success: Green
Warning: Amber
Danger: Red
Background: Light neutral
Surface: White
Text: Slate / Near black
Muted text: Gray
Border: Light gray
```

Suggested tokens:

```text
--color-primary: #5E6AD2;
--color-success: #22C55E;
--color-warning: #F59E0B;
--color-danger: #EF4444;

--color-background: #F8FAFC;
--color-surface: #FFFFFF;
--color-text: #0F172A;
--color-muted: #64748B;
--color-border: #E2E8F0;
```

### 5.2 Usage

Primary color is used for:

* Main buttons
* Active navigation
* Links
* Focus states
* Important highlights

Warning color is used for:

* Upcoming deadlines
* Important notices
* Near-expired school items

Danger color is used for:

* Expired notices
* Urgent items
* Delete actions
* Security warnings

Success color is used for:

* Completed items
* Published status
* Normal healthy state

---

## 6. Typography

Recommended fonts:

```text
Sans-serif: Inter
Monospace: Geist Mono
```

Fallback:

```text
Sans-serif: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
Monospace: "Geist Mono", "SFMono-Regular", Consolas, monospace
```

### Typography Rules

Article body:

```text
font-size: 16px;
line-height: 1.7;
```

Dashboard tables:

```text
font-size: 14px;
line-height: 1.5;
```

Small labels and metadata:

```text
font-size: 12px;
```

Headings should be clear but not overly large.

---

## 7. Component Style

## 7.1 Cards

Cards should be clean and lightweight.

Recommended style:

```text
border-radius: 12px;
border: 1px solid #E2E8F0;
background: #FFFFFF;
padding: 16px or 24px;
box-shadow: subtle or none;
```

Cards should not use heavy shadows.

---

## 7.2 Buttons

Button types:

```text
Primary Button
Secondary Button
Ghost Button
Danger Button
```

Primary button:

* Indigo background
* White text
* Used for main actions

Secondary button:

* White background
* Light border
* Used for normal actions

Danger button:

* Red color
* Used for destructive actions

Avoid excessive gradients.

---

## 7.3 Badges

Badges are important in TekFlow because visibility, status, type, and priority must be obvious.

### Visibility Badges

```text
private    Gray
public     Blue
school     Purple
unlisted   Amber
```

### Status Badges

```text
draft       Gray
published   Green
archived    Slate
```

### School Notice Priority Badges

```text
normal      Green
important   Amber
urgent      Red
```

### School Notice Status Badges

```text
upcoming    Blue
ongoing     Green
done        Gray
expired     Red / Gray
```

---

## 8. Markdown Content Style

Markdown rendering should support:

* Headings
* Paragraphs
* Lists
* Tables
* Blockquotes
* Code blocks
* Inline code
* Links
* Images
* Attachments

Code blocks should use a clear monospace font and readable background.

Inline code should have a subtle background.

Article content should not be too wide.

Recommended max width:

```text
720px - 860px
```

---

## 9. Responsive Design

TekFlow must work well on mobile.

### Mobile Rules

* Sidebar should collapse into a drawer.
* School Notice cards should be easy to read on mobile.
* Tables in dashboard should either become card lists or support horizontal scrolling.
* Article content should use comfortable spacing.
* Primary actions should be easy to tap.
* Dashboard mobile support in V1.0.0 only needs to be basically usable for login, browsing, and simple editing; long-form editing and dense tables can prioritize desktop.

### Desktop Rules

* `/wiki` can use three-column layout.
* `/dashboard` can use sidebar + main table layout.
* `/school` can use card grid or grouped sections.

---

## 10. Dark Mode

Dark mode is not part of V1.0.0 acceptance.

Treat dark mode as a future extension. Do not add separate dark-mode implementation work to the first version unless the PRD is updated.

When a future version implements it:

* `/dashboard` can prioritize dark mode.
* `/wiki` and `/school` should still be readable for long-form content.
* Do not use pure black backgrounds.
* Use dark slate backgrounds and subtle borders.

Suggested dark tokens:

```text
--color-background-dark: #0F172A;
--color-surface-dark: #111827;
--color-text-dark: #E5E7EB;
--color-muted-dark: #94A3B8;
--color-border-dark: #1F2937;
```

---

## 11. Implementation Recommendation

Recommended UI stack:

```text
Tailwind CSS
shadcn/ui
Lucide Icons
Inter
Geist Mono
```

Use shadcn/ui as the base component system.

Use Tailwind tokens to define TekFlow's design language.

Do not hard-code random colors in individual components.

---

## 12. Design Summary

TekFlow should combine:

```text
Mintlify's documentation clarity
+
Linear's dashboard efficiency
+
Notion's school notice card readability
```

But the final UI must feel unified as TekFlow.

The product should feel:

```text
Clean
Readable
Professional
Organized
Efficient
Personal
Technical
```

Final design principle:

```text
Make knowledge easy to write, easy to find, easy to publish, and safe to separate by visibility.
```
