# Coastal Wealth Design System v6 — Super Version
### Coastal Precision Brand Style Guide · Dillon Agency

---

## Overview

The Coastal Wealth Design System v6 (Super Version) is the consolidated, production-ready component library combining the best patterns from v3, v4, and v5 into one unified system. It serves both **client-facing** (insurance, financial planning) and **advisor-facing** (recruiting, growth tools) contexts under a single visual language.

**Design philosophy:** Warm. Quiet. Confident refinement.

---

## 1. Color Palette

### Coastal Navy — Brand Core

| Token        | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| `coastal-900` | `#252f4a` | Primary dark — backgrounds, text, nav       |
| `coastal-800` | `#3c506f` | Dark slides, callout backgrounds            |
| `coastal-700` | `#5d7fa0` | Accent on light surfaces, italic headings   |
| `coastal-600` | `#6b95ba` | Primary accent — buttons, overlines, links  |
| `coastal-500` | `#6b95ba` | Alias of 600                                |
| `coastal-400` | `#89adc8` | On-dark accent text, header italic          |
| `coastal-300` | `#a7c4d8` | Decorative / large typographic elements     |
| `coastal-200` | `#c9dce8` | Light blue slide backgrounds, card numbers  |
| `coastal-100` | `#e8f0f5` | Tags, badges, subtle backgrounds            |
| `coastal-50`  | `#f4f8fb` | Hover states, card backgrounds              |

### Sand — Warm Neutrals

| Token      | Hex       | Usage                                        |
|-----------|-----------|-----------------------------------------------|
| `sand-50`  | `#fdfcfa` | Lightest warm white                           |
| `sand-100` | `#faf7f2` | Hero backgrounds, form sections, sand CTAs    |
| `sand-200` | `#f3ede4` | Sand button fill, testimonial borders         |
| `sand-300` | `#e5ddd0` | Sand button hover                             |
| `sand-400` | `#d1c5b4` | Muted warm accent                             |
| `sand-500` | `#b5a895` | Darkest sand, text on light                   |

### Gray — Structure & UI

| Token      | Hex       | Usage                                        |
|-----------|-----------|-----------------------------------------------|
| `gray-50`  | `#fafafa` | Page backgrounds                              |
| `gray-100` | `#f5f5f5` | Subtle containers                             |
| `gray-200` | `#e8e8e8` | Borders, dividers, card outlines              |
| `gray-300` | `#d4d4d4` | Outline button borders                        |
| `gray-400` | `#a3a3a3` | Section titles, stat labels, captions         |
| `gray-500` | `#737373` | Body text (sans), nav links                   |
| `gray-600` | `#525252` | Body text (serif context)                     |
| `gray-700` | `#404040` | High-contrast secondary text                  |

### Semantic / Status Colors

| Token     | Hex       | Usage            |
|----------|-----------|-------------------|
| `success` | `#22c55e` | Positive states   |
| `warning` | `#f59e0b` | Caution states    |
| `error`   | `#ef4444` | Error states      |
| `info`    | `#6b95ba` | Informational (= coastal-600) |

---

## 2. Typography

### Font Families

| Role              | Primary Font           | Fallback Stack                              | CSS Variable         |
|-------------------|------------------------|----------------------------------------------|----------------------|
| **Display**       | Marlide Display        | Playfair Display → Georgia → serif           | `--font-display`     |
| **Body (Serif)**  | Minion Pro             | Source Serif 4 → Georgia → serif             | `--font-body-serif`  |
| **UI (Sans)**     | NHaasGroteskDSPro      | DM Sans → -apple-system → sans-serif         | `--font-ui`          |

### Type Scale

| Level           | Font              | Size           | Weight | Line Height | Letter Spacing | Usage                          |
|-----------------|-------------------|----------------|--------|-------------|----------------|--------------------------------|
| **Hero**        | Marlide Display   | 64–84px (clamp)| 400    | 0.94        | -0.02em        | Page heroes, cover titles      |
| **Display**     | Marlide Display   | 48px           | 400    | 1.05        | -0.015em       | Section titles                 |
| **Heading**     | Neue Haas Grotesk | 28px           | 500    | 1.25        | —              | Component headings             |
| **Subheading**  | Neue Haas Grotesk | 20px           | 500    | 1.4         | —              | Subheadings                    |
| **Body Serif**  | Minion Light      | 18px           | 300    | 1.75        | —              | Editorial, long-form copy      |
| **Body Sans**   | Neue Haas Grotesk | 16px           | 400    | 1.65        | —              | UI text, functional copy       |
| **Overline**    | Neue Haas Grotesk | 11px           | 500    | —           | 3px            | Section labels (uppercase)     |
| **Caption**     | Neue Haas Grotesk | 12px           | 400    | —           | 0.02em         | Disclaimers, fine print        |

### Typographic Conventions

- **Italic accent words** in headlines use `<em>` tags and render in a lighter accent color (`coastal-700` on light, `coastal-400` on dark).
- **Overlines** always include a 24px horizontal rule before the text.
- **Body serif** is reserved for editorial/descriptive copy; body sans handles UI and functional text.

---

## 3. Spacing System

| Token      | Value  | Common Usage                     |
|-----------|--------|-----------------------------------|
| `space-1`  | 4px   | Micro spacing                     |
| `space-2`  | 8px   | Icon gaps, tight padding          |
| `space-3`  | 12px  | Button gaps, small margins        |
| `space-4`  | 16px  | Form groups, heading margins      |
| `space-5`  | 24px  | Standard section gaps             |
| `space-6`  | 32px  | Card padding, medium spacing      |
| `space-7`  | 48px  | Section title margins, large gaps |
| `space-8`  | 64px  | Section padding (horizontal)      |
| `space-9`  | 96px  | Section padding (vertical)        |
| `space-10` | 128px | Large hero/testimonial padding    |
| `space-11` | 192px | Maximum vertical breathing room   |

---

## 4. Elevation & Shadows

| Token       | Value                                   | Usage                    |
|------------|------------------------------------------|--------------------------|
| `shadow-sm` | `0 1px 3px rgba(37,47,74,0.04)`         | Cards at rest            |
| `shadow-md` | `0 4px 16px rgba(37,47,74,0.06)`        | Button hover, raised     |
| `shadow-lg` | `0 12px 40px rgba(37,47,74,0.08)`       | Framed images, modals    |
| `shadow-xl` | `0 24px 64px rgba(37,47,74,0.12)`       | Feature cards, overlays  |

---

## 5. Motion

| Token              | Value                         | Usage                         |
|-------------------|-------------------------------|-------------------------------|
| `ease-out`         | `cubic-bezier(0.16, 1, 0.3, 1)` | All transitions            |
| `duration-fast`    | `200ms`                       | Hover states, micro interactions |
| `duration-normal`  | `400ms`                       | Section reveals, larger moves    |

---

## 6. Buttons

### Variants

| Variant            | Background           | Text Color       | Border                 | Context           |
|-------------------|----------------------|-------------------|-------------------------|-------------------|
| **Primary Navy**   | `coastal-900`        | white             | none                    | Primary CTA       |
| **Coastal Accent** | `coastal-600`        | white             | none                    | Secondary CTA     |
| **Sand Neutral**   | `sand-200`           | `coastal-900`     | none                    | Warm surfaces     |
| **Outline**        | transparent          | `coastal-900`     | 1.5px `gray-300`        | Tertiary action   |
| **Ghost / Text**   | none                 | `coastal-600`     | none (has → arrow)      | Inline links      |
| **White Outline**  | transparent          | white             | 1px rgba(255,255,255,0.25) | On dark backgrounds |

### Sizes

| Size     | Font Size | Padding       |
|---------|-----------|---------------|
| Default  | 14px      | 14px 32px     |
| Small    | 13px      | 10px 24px     |

### Hover Behavior

All buttons use `translateY(-1px)` lift + `shadow-md` on hover. Ghost buttons animate the arrow `→` 5px right.

---

## 7. Component Library

### Navigation
- **Light Nav:** White background, gray-200 border, Marlide Display logo, DM Sans links, coastal-600 CTA button
- **Dark Nav:** coastal-900 background, white logo, semi-transparent white links

### Heroes
- **Hero A — Split Grid (v3):** 50/50 grid, sand-100 left with overline + display heading + body + buttons, coastal-900 right with decorative watermark
- **Hero B — Full-Width Overlay (v5):** Full-bleed dark gradient, bottom-aligned content, overlay text + button row

### Statistics
- **Light Bordered:** 3-column grid, gray-200 borders, Marlide Display numbers (52px), gray-400 labels
- **Dark Bar:** 4-column grid, coastal-900 background, white numbers (48px), coastal-400 labels

### Cards
- **Numbered Feature:** 3-column edge-to-edge grid, numbered 01/02/03, hover reveals gradient top-border + coastal-50 background
- **Quarterly Content:** Same grid, uses Q1/Q2/Q3 labels with theme taglines

### Image Grid
- 3-column, 2-row grid with 6px gaps
- First cell spans 2 rows (tall)
- Play button overlay (coastal-600 circle, white triangle)
- Bottom-left labels in uppercase

### Slide Sections
- **Light Blue Slide:** coastal-200 background, 50/50 split with content + framed image
- **Dark Slide:** coastal-900 gradient background, same 50/50 split with inverted colors
- **Boxed 50/50 (v3):** Bordered container, content left + dark visual right with frame-line inset

### Centered Feature
- Center-aligned overline + display heading + lead body text
- 2-column image grid below (16:10 aspect ratio)

### Trust Bar
- Centered layout with overline, Marlide Display heading, logo row (0.3 opacity), accent button

### Dark Callout — Checklist
- 50/50 grid: content left (coastal-800) with checklist items using ✓ markers in coastal-400
- Visual right with gradient

### Team Banner
- Full-width dark banner with left-aligned overlay gradient
- Display heading + serif body text

### Testimonials
- **Sand Block (v3):** Sand-100 background, large quotation mark, serif italic quote, UI citation
- **Full-Width Dark (v4):** coastal-800 background, centered display italic quote, radial gradient overlay

### CTAs
- **Dark CTA:** coastal-900 background, centered display heading with accent italic word, accent button
- **Sand CTA:** sand-100 background with sand-200 border, same layout with primary button

### Forms
- **Form Card (v5):** Sand-100 section, white card with logo + labeled inputs + primary button + privacy note
- **Simple Input Row:** Inline email input + small primary button

### Footer
- **Mega Footer (v5):** coastal-900 background, 3-column link grid, watermark logo (3% opacity), badge row, copyright bar

---

## 8. Responsive Behavior

At `max-width: 768px`:

- All 2-column grids collapse to single column
- Navigation links hide (hamburger expected)
- Image grid becomes 2-column
- Stats grid becomes 1-column (light) or 2-column (dark)
- Card grids become single column
- Header reduces to 70vh min-height
- Section padding reduces from `space-9`/`space-8` to `space-7`/`space-5`

---

## 9. File Reference

| File | Purpose |
|------|---------|
| `coastal-precision-design-system.md` | This document — full design system documentation |
| `coastal-precision-tokens.css` | CSS custom properties for all design tokens |
| `coastal-precision-tokens.json` | JSON design tokens for tooling and code generation |
| `design-system-a.html` | Live HTML reference with all components rendered |

---

*Coastal Wealth Design System v6 — Super Version*
*Dillon Agency · 2026*
