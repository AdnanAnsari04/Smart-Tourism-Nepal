# Yatra Design System

Single source of truth: all tokens live in `src/index.css`. Every page/component CSS file should reference these variables — never a raw hex value.

## Token architecture (primitive → semantic)

**Primitive colors** — the actual Nepal sky-to-sunset palette:
| Token | Value | Use |
|---|---|---|
| `--color-navy-900` | `#0e2f45` | Darkest surfaces |
| `--color-navy-800` | `#123b57` | Primary brand color |
| `--color-navy-700` | `#1a4d70` | Gradient midpoint |
| `--color-sky-500` | `#2aa8e0` | Info accents, focus rings |
| `--color-sky-200` | `#cfe4f0` | Text on dark backgrounds |
| `--color-sunset-500` | `#ff6b45` | Primary accent / CTAs |
| `--color-sunset-600` | `#e85530` | Accent hover state |
| `--color-amber-400` | `#ffb84d` | Highlight / eyebrow text |
| `--color-ink-900` | `#16232e` | Body text on light surfaces |

**Semantic tokens** — what components should actually reference:
`--color-primary`, `--color-primary-dark`, `--color-accent`, `--color-accent-hover`, `--color-highlight`, `--color-info`, `--text`, `--text-h`, `--text-muted`, `--text-on-dark`, `--bg`, `--bg-subtle`, `--border`, `--error`

**Status tokens** — for booking/trip states and difficulty pills:
`--status-success-bg/text`, `--status-pending-bg/text`, `--status-easy-bg/text`, `--status-moderate-bg/text`, `--status-hard-bg/text`

**Category tokens** — destination-card gradient pairs (heritage / nature / pilgrimage / adventure), shared between Home and Destinations so they can't drift out of sync.

## Typography

- Font: **Poppins** (400/500/600/700), loaded via Google Fonts in `auth.css` and `index.css`.
- Base size: 16px, line-height 145%.
- Headings use `--heading` (Poppins), weight 700.

## Adding a new token

1. Add the primitive value first if it's a genuinely new color.
2. Add a semantic name that describes *purpose*, not the raw color (`--color-accent`, not `--orange`).
3. Reference the semantic token in component CSS, never the primitive directly.

## Known gaps / next steps

- **Dark mode**: token system is ready to extend, but no dark-mode values are defined yet for the real UI (only unused Vite-template leftovers were previously present and have been removed). Build this out as a deliberate pass, not incrementally.
- **Component-level tokens** (e.g. `--button-padding`, `--card-radius`) aren't yet extracted — spacing/radius values are still hardcoded per-component. Worth doing if the component library grows.
