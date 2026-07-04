# PackIt website — itspackit.com

Static site, no build step. Deploy the folder as-is (Cloudflare Pages / Netlify / any static host).

## Pages
- `index.html` — home: hero + phone mockup, route marquee, why PackIt, how it works (sender/traveler tabs), delivery journey timeline, interactive reward estimator, FAQ, download CTA
- `about.html` — story, how matching works, values, team
- `support.html` — help topics, verification, safety, GDPR, account deletion
- `privacy.html` — privacy policy with table of contents

## Shared
- `styles.css` — design system (primary `#07587B`, middle `#5199B7`, accent `#9CDBF4`, off-white `#F2F5F7`; Sora + Inter via Google Fonts)
- `script.js` — nav/mobile menu, scroll reveals, tabs, journey animation, reward estimator (mirrors the in-app FeeCalculator: $50/kg base, size ×1/×1.25/×1.5, fragile +10%+$5, urgent +15%+$10, $15 floor, rounded to $0.50), FAQ accordions, footer year

## Assets
- `assets/logo.svg` — original logo (white square background)
- `assets/logo-mark.svg` / `assets/logo-mark-white.svg` — transparent logo marks (blue / white)
- `assets/appstore-badge.svg` / `assets/appstore-badge-white.svg`
- `assets/qr-packit-blue.png` / `assets/qr-packit-black.png` — App Store QR codes
