# Portfolio View India

Static educational reference site for Indian portfolio shapes.  
**No login. No auth. Client-side only. Hosted on GitHub Pages.**

Educational only. Not advice. Not SEBI-registered.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Overview / home — hero, destination cards, CTA, FAQ, once-per-day disclaimer modal |
| `new-to-finance.html` | Emergency fund calculator, IPO savings, age-based mix pie chart |
| `ipo.html` | IPO table (GMP, dates, status) from `data/ipos.json` |
| `gold-etf.html` | City gold rates from `data/gold-rates.json` + hold ranking |
| `mutual-funds.html` | Category cards (Equity / Debt / Hybrid) — no scheme names |
| `equity.html` | 50-30-20 mid/large/small bar + segment cards |

## Deploy on GitHub Pages

1. Create a GitHub repo (public or private).
2. Push this folder as the repo root (or put files under `/docs` if you prefer).
3. **Settings → Pages → Source**: Deploy from branch `main` / root (or `/docs`).
4. Site URL will be:  
   `https://<username>.github.io/<repo-name>/`  
   (or `https://<username>.github.io/` if this is a user/org site).
5. All links are relative (`index.html`, `ipo.html`, …) so they work under a project path.

No build step. No Netlify. No server functions.

## Local preview

Open any HTML file in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# or npx
npx serve .
```

Then visit `http://localhost:8080`.

## Data files

- `data/ipos.json` — array of IPO objects (`company`, `priceBand`, `gmp`, `gmpPct`, `opens`, `closes`, `status`).
- `data/gold-rates.json` — `{ updated, cities: { Bangalore, Mumbai, … }, unit }`.

Update these manually or via a scheduled GitHub Action if you want automatic refreshes.

## localStorage keys

| Key | Used by |
|-----|---------|
| `pv_disclaimer_accepted_date` | Overview disclaimer (ISO date string, once per day) |
| `portfolioView_ntf_v1` | New To Finance inputs (expenses, months, IPO balance, age, etc.) |

## Design

- Fonts: Inter + Space Grotesk (Google Fonts)
- Colors: navy `#0b1f3a`, blue `#2563eb`, cyan `#06b6d4`, purple `#8b5cf6`, amber `#f59e0b`
- Logo / favicon: multi-color ring mark in `assets/favicon.svg`

## What was removed

- Login page, Supabase, Google OAuth, profile chip, auth slot in nav
- Any cloud sync of preferences
- Netlify config / functions

## File tree

```
/
  index.html
  new-to-finance.html
  ipo.html
  gold-etf.html
  mutual-funds.html
  equity.html
  css/
    styles.css
    disclaimer.css
  js/
    nav.js
    disclaimer.js
    new-to-finance.js
    ipo.js
    gold.js
  data/
    ipos.json
    gold-rates.json
  assets/
    favicon.svg
  README.md
  .gitignore
  .nojekyll
```

## Assumptions

- You host only on GitHub Pages.
- IPO and gold data are maintained as static JSON (or refreshed by Actions).
- No personal data is collected; everything stays in the browser.
