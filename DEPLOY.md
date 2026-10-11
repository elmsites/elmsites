# Deploying elmsites.com

Static HTML/CSS/JS. No build step, no framework, no server code.

| | |
|---|---|
| Repo | `github.com/elmsites/elmsites` |
| Host (target) | Cloudflare Pages |
| Host (current) | Vercel, project `elmsites` |
| DNS | Squarespace (`nsb1-4.squarespacedns.com`) |
| Email | Google Workspace (`MX smtp.google.com`) |

---

## Cloudflare Pages settings

Workers & Pages -> Create -> Pages -> Connect to Git -> `elmsites/elmsites`

| Setting | Value |
|---|---|
| Framework preset | **None** |
| Build command | **(leave empty)** |
| Build output directory | **`/`** |
| Root directory | `/` |
| Production branch | `main` |

Nothing to install and nothing to compile. Cloudflare serves the
repository contents directly and applies `_headers` and `_redirects`.

Pushing to `main` deploys to production. Any other branch gets its own
preview URL, which is the safe way to look at a change before it is live.

---

## Files in this repo that affect deployment

- **`_headers`** - security headers and cache policy.
  The `Content-Security-Policy` line is the one most likely to need
  editing. It currently allows exactly: Google Fonts (stylesheet +
  font files) and `api.web3forms.com` (the signup form POST).
  **If you add any third-party script, embed, map or analytics, it will
  be blocked until you add its origin here.**
- **`_redirects`** - www to apex, plus `/darbi` as an alias.
- **`sitemap.xml` / `robots.txt`** - update `sitemap.xml` whenever you add a page.

## Files that do NOT affect deployment

- `server.ps1`, `.claude/` - local development only.
- `.vercel/` - the old Vercel link. Safe to delete once the migration is done.

---

## After the first deploy, check

1. Every page loads: `/`, `/about.html`, `/our-story.html`, `/darbi.html`,
   `/contact.html`, `/signup.html`
2. Fonts render (if the headings fall back to a generic serif, the CSP
   `style-src` / `font-src` entries are wrong)
3. The signup form submits and the email actually arrives
4. LV / RU / EN switching works and the choice survives a page change

---

## Optional: deploy via GitHub Actions instead

Only if you want CI to control deploys. **Do not use this at the same time
as Cloudflare's Git integration** - you will get two deploys per push.
Disconnect the Git integration first, then add
`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - name: Publish
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy . --project-name=elmsites
```

Requires two repository secrets: `CLOUDFLARE_API_TOKEN` (a token with the
*Cloudflare Pages: Edit* permission) and `CLOUDFLARE_ACCOUNT_ID`.

---

## Migration order (do not reorder)

1. Deploy to Pages and test on `elmsites.pages.dev`. Production untouched.
2. Add `elmsites.com` to Cloudflare and recreate **every** DNS record.
   Check `MX`, SPF `TXT`, and the `google._domainkey` DKIM `TXT` by hand -
   Cloudflare's scan misses records.
3. Only then switch nameservers at Squarespace.
4. Confirm `nslookup -type=MX elmsites.com`, then send yourself a real
   email and confirm it arrives.
5. Leave the Vercel project running until propagation finishes (up to 48h).

**Losing the MX record takes email down**, including the address the
signup form sends to.