# Golden Reindeer — Homepage

A complete, static homepage with a WebGL 3D reindeer hero. No build step, no framework.

```
golden-reindeer-homepage/
├── index.html            the full page (all sections, inline layout styles)
├── css/styles.css        brand colours, switches, FAQ, floating-card animation
├── js/reindeer.js        3D particle reindeer + its scroll route (needs three.js)
├── js/site.js            store switches, FAQ accordion, "one brain" card animation
├── vendor/three.min.js   three.js r149 (UMD build, MIT licence)
└── preview.jpg           how the hero should look ~4 s after load
```

## Run it

Open `index.html` in Chrome, or serve the folder:

```bash
npx serve .          # or: python3 -m http.server 8080
```

Everything is relative-path, so the folder can be uploaded to any static host
(Netlify, Vercel, Cloudflare Pages, S3, cPanel) as is.

## Put it on the live site

**Plain HTML / static host** — upload the folder; `index.html` is the homepage.

**WordPress / Elementor**
1. Upload `css/`, `js/` and `vendor/` to the theme or via a file manager (e.g. `/wp-content/uploads/gr/`).
2. Paste the `<body>` contents of `index.html` into a full-width *HTML* widget on a blank canvas template
   (no theme header/footer, or remove the page's own header to avoid two navbars).
3. Enqueue in this order, in the footer: `three.min.js` → `reindeer.js` → `site.js`, plus `styles.css` and the Google Font link from `<head>`.
4. Keep the `<canvas id="reindeer-canvas" data-gr-gl …>` as the **first child** of the page wrapper — it is `position: sticky` and overlays the page.

**React / Next.js** — render the markup as a page component, add `three` (`npm i three@0.149.0`)
and run the body of `GR.initGL()` from `reindeer.js` inside a `useEffect` after mount
(replace `window.THREE` with `import * as THREE from 'three'`). Cancel `GR.glRaf` and call
`renderer.dispose()` on unmount. Port `site.js` the same way.

## How the 3D reindeer works

- ~8,400 points generated in code (no model file). Body, legs and antlers are built from
  ellipsoids and tubes; a dotted "map" disc sits under its hooves.
- One `THREE.Points` draw call with a small custom shader: leg swing while running, shimmer,
  motion trail. Orthographic camera in CSS pixels so it can stand exactly on page elements.
- Route waypoints are DOM elements, read every frame:

| Attribute in index.html | Element | Role |
|---|---|---|
| `data-gr-anchor="navdemo"` | header "Book free demo" | start (small) |
| `data-gr-anchor="demo"` | hero "Book a demo" | stands full size beside it |
| `data-gr-anchor="end"` | final WhatsApp report card | finish: stands on top of it |

  Move or restyle those elements and the route follows. Tuning values are listed at the top of `reindeer.js`.
- The canvas has `pointer-events: none`, so it never blocks clicks.
- Accessibility: canvas is `aria-hidden`; `prefers-reduced-motion` disables running/shimmer.
- Fallback: if WebGL fails, the page works normally without the reindeer.
- Performance: pixel ratio capped at 1.5; tested in headless Chromium. Please check on a
  mid-range Android phone before launch — on small screens the reindeer is drawn smaller
  and can sit partly off the right edge; tweak `big / mid / endH` if needed.

## Wire these up before launch

| In index.html | Currently | Should become |
|---|---|---|
| `href="#demo"` (several) | anchor | demo booking page / Calendly / Cal.com |
| `href="#report"` | scrolls to final section | keep, or link to the free report page |
| `href="#whatsapp"` | placeholder | `https://wa.me/91XXXXXXXXXX?text=Hi%2C%20send%20my%20Google%20Profile%20report` |
| `href="#login"` | placeholder | owner app login |
| `#store-all`, `#partner`, `#about`, `#app`, `#privacy`, `#terms` | placeholders | real pages |

## Content placeholders (do not ship as is)

- Hero proof line: `[Add real proof here, e.g. "Live with 12 salons in Pune"]` — replace with a **real, verifiable** number or delete it.
- Pricing: `[PRICE]` for Automations and Partner plans. AI Team shows ₹5,000/month (proposed price).
- White-label panel client names (Sharma Dental Clinic, Glow Studio Salon, Fit Zone Gym) are examples — label stays "Example client names".
- FAQ answers promise message approval and opt-in-only messaging. Make sure the product does this, or edit the answers.

## Brand tokens

`css/styles.css` → `:root`: accent `#B4590B`, ink `#2A1A0E`, body `#5C4A3A`, cream `#FBF3E6`,
paper `#FFFBF5`, line `#EFE4D4`. Font: Plus Jakarta Sans 400–800 (Google Fonts).
Accent was darkened from the old site's orange so white button text passes WCAG contrast.

## Licence notes

three.js is MIT-licensed (keep its header comment in `vendor/three.min.js`). All other code and
the reindeer model were written for Golden Reindeer.
