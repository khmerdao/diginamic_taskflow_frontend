# TaskFlow — Dark mode visual identity (minimal SaaS)

Inspired by Notion / Linear / Trello: calm, focused, high-contrast (without pure black), with bright accents reserved for actions and highlights.

## 1) Full color palette (hex)

### Backgrounds (desaturated)
- **Background / App**: `#0F172A` (deep navy)
- **Background alt**: `#111827` (dark blue-gray)

### Surfaces / Cards
- **Surface 1**: `#1F2937` (cards, panels)
- **Surface 2**: `#1E293B` (elevated / hover)

### Typography
- **Text primary**: `#E5E7EB`
- **Text secondary**: `#CBD5E1`
- **Text muted**: `#94A3B8`
- **Text subtle**: `#64748B`

### Borders / Dividers
- **Border**: `rgba(148, 163, 184, 0.16)`
- **Border strong**: `rgba(148, 163, 184, 0.24)`

### Accents
- **Primary (blue)**: `#3B82F6`
- **Primary (soft blue)**: `#60A5FA`
- **Secondary purple**: `#8B5CF6`
- **Secondary teal**: `#14B8A6`
- **Secondary amber**: `#F59E0B`

### Semantic
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

### Shadows / Glow (soft futuristic)
- **Shadow 1**: `0 1px 0 rgba(2, 6, 23, 0.35), 0 10px 30px rgba(2, 6, 23, 0.45)`
- **Shadow 2**: `0 1px 0 rgba(2, 6, 23, 0.40), 0 18px 50px rgba(2, 6, 23, 0.55)`
- **Primary glow**: `0 0 0 3px rgba(96,165,250,.22), 0 0 26px rgba(59,130,246,.18)`

## 2) UI preview (dashboard / kanban board)

Implemented directly in the app using Bootstrap classes + global overrides:
- App background uses a deep navy gradient with subtle radial tints (blue/purple).
- Kanban columns are **cards** (Surface 2) with subtle borders and elevation.
- Task cards are list items with a “chip” feel, hover lift, and focus glow.
- Status/priority badges reuse Bootstrap’s `text-bg-*` API, remapped to our accents.

To view: go to **Dashboard → Kanban**.

## 3) Active element highlight rules

- Bright blue is reserved for:
  - primary buttons
  - focused inputs
  - active navigation item
  - drag preview + active drop zone
- Large surfaces stay desaturated to remain calm.
