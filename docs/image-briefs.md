# Image briefs

Three photographs that would lift the page. None are generated yet. Drop a file at the target path, run `npm run build` (or restart `npm run dev`), and the page picks it up: `vite.config.ts` lists `public/img` at build time and `src/img.ts` falls back to the current picture when a file is missing, so nothing 404s.

Palette and mood for all three: near-black (#0a0a0a), warm off-white (#efefef), one crimson accent (#b11226) used sparingly. Low-key, natural light, quiet, unhurried. Realistic photography, no text, no logos, no recognisable brands or devices with visible marks. Export WebP, quality ~78, sRGB.

## 1. `public/img/band.webp`: the wide band after Features

- **Ratio:** 5:2 (1800 × 720). Shown full-bleed, cropped to at most 70% of the viewport height, with a slow scroll-linked drift.
- **Replaces:** `manuscript.jpg` (the alt text and caption switch automatically; the Smithsonian credit drops out of the footer).
- **Prompt:** Overhead photograph of a dark walnut desk at dusk, shot straight down, wide panoramic framing. A closed black notebook with a thin crimson ribbon bookmark trailing out, a matte black fountain pen laid parallel to it, a small black mechanical metronome standing at the right third, pendulum slightly blurred mid-swing. One warm desk lamp out of frame casting a soft pool of light from the upper left, the rest of the desk falling off into deep shadow. Fine wood grain visible, a few paper sheets with faint pencil marks at the edge. Muted, near-monochrome palette of black, warm brown and cream with the ribbon as the only saturated colour. 50mm lens, f/4, natural grain, editorial still-life photography, calm and deliberate. Keep the left two thirds quiet: the caption sits on the right.

## 2. `public/img/metronome-poster.webp`: poster of the metronome clip

- **Ratio:** 4:5 (1080 × 1350). Shown as the video's poster in the light "Four words" section; it is all visitors with reduced motion ever see, so it must stand on its own.
- **Replaces:** `metronome-poster.jpg` (the current poster is a frame grab; the video aria-label still fits).
- **Prompt:** Studio photograph of a classic black pyramid mechanical metronome on a pale oak table, three-quarter view, the pendulum frozen at the far left of its swing. The tempo scale on the front is legible as engraved tick marks with Italian tempo words (Largo, Andante, Allegro, Presto), no brand name anywhere. Background a warm off-white plaster wall, softly lit from a window at the left, gentle shadow falling to the right. Shallow depth of field, focus on the sliding weight, 85mm, f/2.8. Clean, restrained, product-catalogue calm; colours limited to black, off-white and honey wood. Leave room above the metronome; the subject sits in the lower two thirds.

## 3. `public/img/rest.webp`: the rest, after "How a session goes"

- **Ratio:** 16:10 (1600 × 1000). New block, full content width with rounded corners, shown only once the file exists (there is no older picture to fall back to).
- **Prompt:** A person in their thirties standing at a tall window in early morning light, seen from slightly behind and to the side, holding a white ceramic cup of tea in both hands, looking out. Behind them, out of focus, a simple desk with a laptop left open (screen dark, no logo) and a chair pushed back. Plain dark clothing, one crimson detail: a wool scarf over the chair. Interior mostly in soft shadow, window light wrapping the figure. Candid, unposed, the moment of stepping away from work. 35mm, f/2, natural colour with lifted blacks, documentary lifestyle photography. Face not the focus; no visible brands. Composition with the figure on the right third so the left can breathe.
