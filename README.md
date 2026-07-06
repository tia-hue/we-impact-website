# Impact — Website

Static website for **Impact**, the nonprofit equipping faith-driven entrepreneurs
(rebuilt from the original site at https://we-impact.base44.app).

## Pages

- `index.html` — Home: hero, mission, who we serve, the 4-step journey, programs, stories, partner/giving, contact
- `founder.html` — About Tia Lambert, founder & executive director
- `membership.html` — Membership benefits and plans (Monthly / Quarterly / Annual via Square checkout)
- `pitch-deck.html` — Investor/partner pitch deck (use "Print / Save as PDF" for a PDF copy)

## Structure

- `css/style.css` — all styling (brand greens `#226644` / `#2a7a54`, amber accents)
- `js/main.js` — mobile nav, scroll animations, stat counters, contact form
- `assets/` — logo (`logo.png`), founder photo (`founder.jpg`)

## Notes

- The contact form opens the visitor's email app addressed to info@we-impact.com.
  For submissions collected in a dashboard instead, wire it to a service like
  Formspree, Basin, or Netlify Forms.
- No build step — open `index.html` in a browser, or host the folder anywhere
  (Netlify, Vercel, GitHub Pages, etc.).
- To preview locally: `python3 -m http.server 8000` inside this folder, then
  visit http://localhost:8000
