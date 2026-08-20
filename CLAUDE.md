@AGENTS.md

# DOPAMIND — Project Guide

Fresh Next.js scaffold (created 2026-08-20). No ecommerce features exist yet — this file
defines the permanent brand/design rules to follow once Phase 1 build-out starts.

## Stack

- Next.js 16.3.1 (App Router, Turbopack), React 19.2.8, TypeScript 5 (strict)
- Tailwind CSS v4 — CSS-based config via `@theme` in [globals.css](src/app/globals.css), no `tailwind.config.*` file
- ESLint 9 flat config ([eslint.config.mjs](eslint.config.mjs))
- Fonts: Geist / Geist Mono via `next/font/google`, wired as CSS vars in [layout.tsx](src/app/layout.tsx)
- No UI kit, animation lib, state manager, or CMS installed yet
- Import alias: `@/*` → `src/*`

## Structure

- [src/app/layout.tsx](src/app/layout.tsx) — root layout (only layout so far)
- [src/app/page.tsx](src/app/page.tsx) — homepage (still the default `create-next-app` template — not yet redesigned)
- [src/app/globals.css](src/app/globals.css) — global styles + Tailwind theme tokens
- `public/` — static assets (only default Next/Vercel SVGs so far)

No ecommerce architecture exists: no product data source, no PDP/collection routes, no
cart, search, wishlist, or account pages. Build these fresh in Phase 1.

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit` (no dedicated script yet; build already runs this)

All three verified working as of scaffold creation.

## Reference for ecommerce structure

https://jmsolutioncm.cafe24.com/shop7 — reference for structure and product-discovery
logic ONLY (routing shape, PDP/collection/cart/search/wishlist patterns). Never copy its
design, assets, source code, or branding.

---

## BRAND

- DOPAMIND = DOPA + MIND
- Category = Mind–Skin Care
- Core ritual = 15-minute daily reset
- Emotional journey = OVERLOAD → PAUSE → BREATHE → RESET
- Product = facial mask
- Brand sells the moment, not only the mask

## VISUAL

- Premium 2026 skincare/wellness/editorial ecommerce
- Soft future skincare
- Large editorial typography
- Controlled asymmetry
- Intentional whitespace
- Subtle cinematic motion
- One primary effect per major section
- Never generic Shopify/Cafe24/ThemeForest/Tailwind-default look
- No repetitive rounded cards
- No excessive glassmorphism
- No Web3/cyberpunk aesthetic

## COLORS

- Cloud Milk `#F8F7F3`
- Purple `#9688FF`
- Lavender `#D8D2FF`
- Mint `#CFE9DF`
- Peach `#FFC8B8`
- Butter `#F6E5A6`
- Charcoal `#25252B`

## COMMERCE

- Commerce usability must remain clear
- Preserve working product/cart/search functionality
- Product data must remain reusable
- Do not invent prices, discounts, ingredients, reviews, or claims
- JM Solution informs structure only; DOPAMIND controls visual identity

## MOTION

- Prefer `transform` and `opacity`
- Use modern CSS before reaching for heavy JS
- Reduced-motion support required
- Mobile should reduce complex pointer/hover effects
- No Three.js/WebGL unless genuinely necessary

## LANGUAGE

- Default and primary customer-facing language is Vietnamese
- Navigation, ecommerce UI, CTAs, forms, search, cart, account, filters, footer,
  validation messages, and supporting copy must all use natural Vietnamese
- English may remain only for intentional DOPAMIND brand terms — e.g. DOPAMIND,
  MIND–SKIN CARE, DOPA, MIND, 15:00, RESET — where appropriate

## RESPONSIVE-FIRST

Every component must be intentionally designed and implemented for:

- Mobile: 360px–430px
- Large Mobile: 431px–767px
- Tablet Portrait: 768px–834px
- Tablet Landscape / Small Laptop: 835px–1180px
- Desktop: 1181px–1599px
- Large Desktop: 1600px+

Do NOT build a desktop layout first and simply shrink it later. Each viewport
category must preserve the same DOPAMIND brand identity while adapting composition
intentionally. Responsive behavior is part of the component itself and must NEVER
be postponed until final QA.

**Mobile**
- Touch-first layout; no hover-dependent functionality
- Minimum comfortable interactive target around 44px
- Simplify complex parallax, 3D tilt, mouse spotlight, and pointer interactions
- Preserve large editorial typography without clipping
- Stack/reorder content when necessary instead of shrinking desktop layouts
- Use full-width imagery where appropriate
- Keep search, cart, and shopping actions easy to access
- Avoid excessive sticky UI; no horizontal overflow

**Tablet**
- Treat tablet as its own layout state, NOT a smaller desktop
- Pay special attention to 768px–1100px
- Simplify extreme asymmetry where necessary; avoid cramped two-column layouts
- Reduce oversized typography appropriately
- Ensure navigation never collides; adapt mega menu for available width
- Preserve premium whitespace and visual hierarchy
- Support both portrait and landscape orientations

**Desktop**
- Preserve cinematic/editorial asymmetry
- Allow richer hover interactions; use generous whitespace
- Support full mega menu
- Allow subtle pointer interaction, parallax, and 3D depth where appropriate

**Large Desktop**
- Prevent content from becoming excessively stretched; use controlled max-width
  containers
- Preserve intentional composition at 1600px+
- Keep typography and imagery balanced instead of simply scaling infinitely

**Fluid system** — prefer `clamp()`, `min()`, `max()`, CSS Grid, Flexbox, container
queries, `aspect-ratio`, responsive gaps, fluid padding, and responsive typography.
Avoid rigid fixed widths, excessive absolute positioning, breakpoint hacks, layouts
that only look correct at 1440px, and abrupt visual jumps between breakpoints.

**Typography** — use fluid typography wherever appropriate, e.g.
`font-size: clamp(2.5rem, 6vw, 7.5rem)`. Headlines must scale smoothly instead of
switching between arbitrary fixed sizes.

**Spacing** — use fluid spacing, e.g. `padding-inline: clamp(20px, 4vw, 64px)`,
`padding-block: clamp(72px, 10vw, 160px)`.

**Images** — responsive dimensions; intentional `object-fit`/`object-position`;
correct aspect ratio; no layout shift; no accidental crop of important subjects;
use `next/image` correctly where applicable.

**Product grid** — adapt based on available width, not arbitrary device names.
Typical target: small mobile 1–2 columns, large mobile 2 columns, tablet 2–3
columns, desktop 3–4 columns.

**Navigation** — explicitly validate at 390 / 768 / 820 / 1024 / 1180 / 1280 /
1440 / 1600px. There must be no intermediate width where navigation, logo, or
utilities collide.

**Responsive QA** — before any phase is considered complete, inspect the UI at
390×844, 430×932, 768×1024, 820×1180, 1024×768, 1180×820, 1280×800, 1440×900,
1600×900, and resize continuously between 360px and 1600px. Check specifically
for: horizontal overflow, clipping, text wrapping problems, navigation collision,
oversized headings, awkward whitespace, broken grids, image crop problems, touch
target size, sticky section issues, and sudden breakpoint jumps. If a component
looks correct only at one exact viewport width, redesign it to be fluid.
