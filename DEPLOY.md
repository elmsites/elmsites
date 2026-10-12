# Deploying elmsites.com

Static HTML/CSS/JS. No build step, no framework, no server code.

| | |
|---|---|
| Repo (primary) | `github.com/Koba115/elmsites` |
| Repo (mirror) | `github.com/elmsites/elmsites` |
| Host | Cloudflare Workers (static assets) |
| Live Worker | `https://elmsites.birznieks.workers.dev` |
| DNS (still) | Squarespace (`nsb1-4.squarespacedns.com`) |
| Email | Google Workspace (`MX smtp.google.com`) |

Status: **the Worker is live and correct. Only the domain cutover is left.**

---

## Cloudflare settings (Workers static assets)

Workers & Pages -> the `elmsites` Worker -> Settings -> Build

| Setting | Value |
|---|---|
| Framework preset | **None** |
| Build command | **(leave empty)** |
| Build output directory | **`/`** |
| Root directory | `/` |
| Production branch | `main` |

Nothing to install, nothing to compile. Cloudflare serves the repository
contents directly and applies `_headers`.

Pushing to `main` deploys to production. Any other branch gets its own
preview URL, which is the safe way to look at a change before it is live.

---

## URL shape: extensionless, and the site must match

Workers static assets runs `html_handling: auto-trailing-slash`. That means:

- `about.html` in the repo is **served at `/about`**
- a request for `/about.html` gets a **307 redirect** to `/about`

So every internal link, every `<link rel="canonical">`, every `og:url` and
every `sitemap.xml` entry uses the extensionless form. Do not add a link
ending in `.html` or you reintroduce a redirect hop on every click.

`server.ps1` resolves `/about` to `about.html` so local dev matches
production. Without it, local would 404 on links that work live.

---

## Files in this repo that affect deployment

- **`_headers`** - security headers and cache policy.
  The `Content-Security-Policy` line is the one most likely to need
  editing. It currently allows exactly: Google Fonts (stylesheet +
  font files) and `api.web3forms.com` (the signup form POST).
  **If you add any third-party script, embed, map or analytics, it will
  be blocked until you add its origin here.**
- **`_redirects`** - currently holds **no active rules**, only warning
  comments. Both rules it used to have were removed for cause: absolute
  URLs are rejected at deploy time, and the `/darbi` rule fought the
  built-in trailing-slash handling and caused a redirect loop.
- **`.assetsignore`** - keeps `.git`, `.wrangler` and local-only files off
  the public site. See Gotchas.
- **`sitemap.xml` / `robots.txt`** - update `sitemap.xml` when you add a page.

## Files that do NOT affect deployment

- `server.ps1`, `.claude/`, `.mcp.json` - local development only.
- `.vercel/` - the old Vercel link. Safe to delete once the cutover is done.

---

## DNS cutover: the only thing still outstanding

Everything below is dashboard work. Do it in this order.

### The complete current record set

Captured live on 2026-10-12. This is **all** of it. There is no `www`
record and no DMARC record today, and nothing on any other subdomain.

| Name | Type | Value | Carry over? |
|---|---|---|---|
| `@` | A | `216.198.79.1` | **No.** This is Vercel. It is what you are replacing. |
| `@` | MX | `smtp.google.com` priority `1` | **Yes. Email dies without it.** |
| `@` | TXT | `v=spf1 include:_spf.google.com ~all` | **Yes.** SPF. |
| `google._domainkey` | TXT | `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvGSN46iSMAZwkzeUJoFtluqt6enKmQfhVDoAUec8VlXuKREmAi7xleJW7E1elnnEFxN5DN0BsmWpIwnqPWgiv+qC/VigzkEeeSmp7HQqIZyDs8d1Shn3NaVMMDoLExyNCS2pOCVX19RdcRLvkEIp3fSE7Fb/ahFB4V74/dVHCQyxnbTTFNYKA7W5nmPZKYT6espTPwwIn+O0nv+MpMQigKuLSVe0ViY1M+ixr0qcvFYMC0cbCOSIuWzbXFkm3FjCfaKgJKFcF6aCAK39c4IivJTQ+KF/AKnCdT13RYO3JIXCeCtWGGhIjc8INObhessnsTuD8Lssqdw2NVISDoM56wIDAQAB` | **Yes.** DKIM. Copy exactly, one line. |

A public DNS query only returns names you ask for. Before switching,
**screenshot the Squarespace DNS panel** and compare it against this table.
The panel is authoritative; this list is not.

### Step 1 - add the zone, do not switch yet

Add `elmsites.com` as a site in Cloudflare. Let the scan run, then check
its result against the table above line by line.

**Cloudflare's scan regularly misses the DKIM record.** Add it by hand if
it is not there. A missing DKIM record does not bounce mail, it quietly
sends it to spam, which is worse because you will not notice for days.

Leave MX and TXT records **unproxied** (grey cloud). Mail records cannot
be proxied.

### Step 2 - switch nameservers at the registrar

Replace `nsb1-4.squarespacedns.com` with the two nameservers Cloudflare
gives you. Then wait for Cloudflare to report the zone Active.

### Step 3 - point the domain at the Worker

Worker -> Settings -> Domains & Routes -> Add -> Custom Domain ->
`elmsites.com`.

Cloudflare creates the right record itself. **Delete the old
`A 216.198.79.1`** if it is still there, or it will conflict.

### Step 4 - www

There is no `www` record today, so nothing breaks if you skip this.
To add it, the clean way is a second Custom Domain on the Worker for
`www.elmsites.com`. Duplicate content is not a concern: every canonical
tag already points at the apex.

A `_redirects` rule cannot do this. Absolute URLs are rejected at deploy
time on Workers.

### Step 5 - verify before you relax

```
nslookup -type=MX elmsites.com
nslookup -type=TXT elmsites.com
nslookup -type=TXT google._domainkey.elmsites.com
```

Then **send a real email to birznieks@elmsites.com from an outside
address and confirm it arrives.** Resolving records is not proof that
mail flows.

Leave the Vercel project running until propagation finishes, up to 48h.
Deleting it early strands anyone still resolving the old A record.

### Optional, while you are in there

There is no DMARC record. Adding one is a genuine deliverability
improvement and costs nothing:

```
_dmarc   TXT   v=DMARC1; p=none; rua=mailto:birznieks@elmsites.com
```

`p=none` only reports, it rejects nothing, so it cannot break mail.

---

## After the cutover, check

1. Every page loads: `/`, `/about`, `/our-story`, `/darbi`, `/contact`, `/signup`
2. Fonts render (if headings fall back to a generic serif, the CSP
   `style-src` / `font-src` entries are wrong)
3. The signup form submits **and the email actually arrives**
4. LV / RU / EN switching works and the choice survives a page change

---

## Gotchas hit during the real migration

**`_redirects` only accepts relative URLs here.** Workers static assets
rejects absolute URLs at deploy time:
`Invalid _redirects configuration: Only relative URLs are allowed [code: 100324]`.
Cloudflare *Pages* allows them; Workers does not. Do www -> apex with a
Custom Domain or a dashboard Redirect Rule instead.

**Do not add a `_redirects` rule for a page that already exists.**
A `/darbi.html -> /darbi` rule looks sensible and causes a redirect loop,
because `auto-trailing-slash` is already doing exactly that redirect. The
rule sent the browser straight back. Symptom: `/darbi` fails to load at all.

**`.assetsignore` is required.** With root directory `/`, wrangler uploads
*everything* in the repo, including the entire `.git` directory, which
would publish your full commit history on the live site. It also caught
`.wrangler/tmp/.../no-op-worker.js.map` being served with a 200.
`.assetsignore` excludes both. If you ever change the assets directory,
move that file too.

Verify after any change to it:

```
curl -s -o /dev/null -w "%{http_code}\n" https://elmsites.com/.git/config
```

404 is correct. 200 means your commit history is public.
