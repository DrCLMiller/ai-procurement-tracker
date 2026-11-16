# Instructions for Claude in this repository

This repository publishes the AI Procurement Rules & Clause Tracker (GitHub Pages, embedded on the AI Procurement Lab's Wix site).

- For any review or content update, follow `UPDATE_PROTOCOL.md` exactly. It decides what may be committed to `main` directly and what must go through a pull request.
- Content lives only in `data/tracker.json`. Do not change `index.html`, `scripts/`, `.github/` or `UPDATE_PROTOCOL.md` unless the repository owner asks.
- Always run `node scripts/validate.mjs` before committing.
