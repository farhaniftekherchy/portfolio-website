# Alex Rivera — Portfolio Website

A single-page personal portfolio built with plain HTML, CSS and JavaScript (no framework, no build step). It uses a "library catalog / index card" visual theme — a fixed side navigation styled like catalog drawer tabs, one per section — to organize a full portfolio: home, about, education, projects, achievements, blogs/vlogs/hobbies, publications, and a working contact form.

**Figma prototype (shareable link):** `PASTE_YOUR_FIGMA_SHARE_LINK_HERE`
*(See "Figma design" section below for what the file should contain and how to generate the link.)*

---

## Features

- **Home** — name, one-line positioning, CV download button, and links to social profiles (GitHub, LinkedIn, X, email).
- **About Me** — short bio plus a quick-facts list (location, focus areas, availability, languages).
- **Education** — reverse-chronological timeline of degrees/certificates.
- **Projects** — card grid with tags, descriptions, and links to live demos / source code.
- **Achievements** — dated list of awards, talks, and competition results.
- **Blogs / Vlogs / Hobbies** — a showcase grid for anything outside of formal work (writing, video, personal interests).
- **Publications** — list of papers/reports with citation-style metadata and links.
- **Contact Me** — a validated contact form that posts to a **Google Sheet** (and optionally sends an email) via a Google Apps Script web app, with:
  - client-side validation (name, email format, message length)
  - a honeypot field for basic spam filtering
  - accessible error messages (`role="alert"`) and a live status region
- **Responsive** — the side navigation collapses into a toggleable menu below 860px; layout adapts down to mobile.
- **Accessible** — skip-to-content link, visible focus states, `aria-live` status updates, `prefers-reduced-motion` support.
- **Unit tested** — the contact form's validation logic lives in a framework-free module (`js/validate.js`) and is covered by a Jest test suite (`tests/validate.test.js`).

---

## Project structure

```
portfolio-website/
├── index.html                  # all sections live in this single page
├── css/
│   └── style.css               # design system + layout
├── js/
│   ├── validate.js             # pure, unit-tested form validation functions
│   └── main.js                 # DOM behavior: nav, scroll-spy, form submit
├── tests/
│   └── validate.test.js        # Jest unit tests for js/validate.js
├── assets/
│   ├── cv/                     # put your CV PDF here
│   └── img/                    # put your profile photo here
├── google-apps-script/
│   └── Code.gs                 # backend script that writes to Google Sheets
├── package.json
└── .gitignore
```

---

## How to use / customize

1. Replace the placeholder copy in `index.html` (name, bio, education, projects, achievements, publications) with your own content.
2. Add your CV as `assets/cv/Alex_Rivera_CV.pdf` (or update the `href` in the Home section).
3. Add a profile photo at `assets/img/profile.jpg` (optional — the hero card hides gracefully if it's missing).
4. Update the social links in the Home section.
5. Wire up the contact form (see below).

---

## Installing and running locally

**Prerequisites:** [Node.js](https://nodejs.org/) (v18+) and [Git](https://git-scm.com/) installed. Node is only needed for running the unit tests — the site itself is static and needs no build step.

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git

# 2. Move into the project folder
cd <your-repo>

# 3. Install dev dependencies (Jest, for running the unit tests)
npm install

# 4. Run the unit tests
npm test

# 5. View the website
# No build step is required — just open index.html directly in a browser,
# or serve it locally for a closer-to-production experience:
npx serve .
# then open the printed local URL (e.g. http://localhost:3000)
```

---

## Setting up the contact form (Google Sheets backend)

1. Create a new Google Sheet. In row 1, add the headers: `Timestamp | Name | Email | Message`.
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of `google-apps-script/Code.gs`.
4. (Optional) Set `NOTIFY_EMAIL` at the top of the script to also receive an email per submission.
5. Click **Deploy → New deployment**, choose type **Web app**, set "Execute as: Me" and "Who has access: Anyone", then **Deploy**.
6. Authorize the script when prompted, then copy the generated **Web app URL**.
7. Paste that URL into `GOOGLE_SCRIPT_URL` near the top of `js/main.js`.
8. Submit the form once to confirm a new row appears in your Sheet.

Until step 7 is done, the form will still validate input correctly but will show a friendly message telling you the backend isn't configured yet — it won't fail silently.

---

## Unit testing

Validation logic (name/email/message rules, plus the honeypot spam check) is isolated in `js/validate.js` with no DOM dependencies, so it can be required directly in Node and tested with Jest.

```bash
npm install
npm test
```

The suite in `tests/validate.test.js` covers:
- empty/invalid/valid names, emails, and messages
- boundary lengths (too short / too long)
- a fully valid submission
- a submission with multiple simultaneous errors
- the honeypot spam-detection path
- graceful handling of missing/undefined input

---

## Figma design

The visual language mirrors the CSS design tokens in `css/style.css` so the Figma file and the live site stay consistent:

- **Color:** paper `#EFF1EC`, ink `#16202A`, ink-soft `#4A5560`, accent gold `#C99A3A`, accent pine `#2F6F5E`, hairline `#C9CDC4`.
- **Type:** *Fraunces* for headings/display, *IBM Plex Sans* for body copy, *IBM Plex Mono* for labels, tags, and the catalog tab numbers.
- **Signature element:** the fixed left "catalog" navigation, styled like library index-card drawer tabs, one numbered tab per section (`00 Home` … `07 Contact`).
- **Frames to build:** one frame per breakpoint (desktop 1440px, tablet 834px, mobile 390px) × one frame per section (Home, About, Education, Projects, Achievements, Showcase, Publications, Contact) = a full page flow, plus a components page (buttons, form fields, cards, nav tab states: default/hover/active).

To produce the deliverable:
1. Build the frames above in Figma using the tokens listed.
2. Link the frames together as an interactive prototype (nav tab → matching section frame).
3. Click **Share → Copy link**, set access to "Anyone with the link can view," and paste it at the top of this README and in your submission.

---

## Git workflow (CLI only — no GitHub Desktop / IDE Git buttons)

All commands below are run from a terminal (Terminal, Git Bash, or your IDE's integrated terminal used *as a terminal*, not through its GUI Git panel).

```bash
# One-time setup, inside your project folder
git init
git add .
git commit -m "Initial commit: portfolio site, tests, and README"

# Create the repository on GitHub first (via github.com "New repository", no README/gitignore
# added there to avoid conflicts), then connect it:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main

# For every change after that:
git add .
git commit -m "Describe what changed"
git push
```

If you're prompted for credentials, GitHub requires a [Personal Access Token](https://github.com/settings/tokens) instead of your password for HTTPS pushes — generate one with `repo` scope and use it in place of your password when asked.

---

## License

MIT — use this as a starting point for your own portfolio.
