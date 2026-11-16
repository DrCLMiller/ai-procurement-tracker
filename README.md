# AI Procurement Rules & Clause Tracker

A searchable map of the laws, policies, standards and guidance that shape AI procurement, including agentic AI, with the contract clauses each one implies. Published by the AI Procurement Lab.

The tracker is a static site served by GitHub Pages and embedded in the Lab's Wix site. Its content lives in one data file, which an automated weekly review keeps current.

## What's in this repository

| Path | What it is |
|---|---|
| `index.html` | The tracker page. Reads its content from `data/tracker.json`. |
| `data/tracker.json` | All rules, clauses and dates. The only file updates normally touch. |
| `scripts/validate.mjs` | Checks the data file for errors (bad dates, broken clause links, missing sources). |
| `.github/workflows/validate.yml` | Runs the validator on every change and pull request. |
| `.github/ISSUE_TEMPLATE/report-a-change.yml` | The form behind the tracker's "Report a change" button. |
| `UPDATE_PROTOCOL.md` | Standing instructions for the automated weekly review. |
| `CHANGELOG.md` | Dated record of every review and change. |

## How updates work

1. Every week an automated review re-checks each rule and scans for new ones, following `UPDATE_PROTOCOL.md`.
2. If nothing changed, it updates the "last verified" date and publishes that directly.
3. If anything changed, it opens a pull request with a table of proposed changes and their sources. Nothing changes on the live site until an editor merges it.
4. Visitors can use **Report a change**. Reports become GitHub issues that the next weekly review checks.

## One-time setup

1. **Turn on GitHub Pages:** repository Settings → Pages → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save. After a minute or two the site is at https://drclmiller.github.io/ai-procurement-tracker/.
2. **Create the issue labels** `reported-change`, `triaged` and `needs-review` (Issues → Labels → New label).
3. **Fill in the links** in `data/tracker.json` under `meta`:
   - `reportUrl`: `https://github.com/<user>/<repo>/issues/new?template=report-a-change.yml`
   - `historyUrl`: `https://github.com/<user>/<repo>/blob/main/CHANGELOG.md`
4. **Embed in Wix:** in the Wix Editor, Add Elements → Embed Code → *Embed a Site*, paste the GitHub Pages URL, then stretch the element to full width and make it tall (about 2,000 px), or give the tracker its own page. Wix shows embedded sites in a fixed-height frame, so the tracker scrolls inside it.
5. **Optional, recommended:** Settings → Branches → add a rule for `main` that requires the *Validate tracker data* check to pass, so a broken data file can never go live.

## Editing by hand

Edit `data/tracker.json`, run `node scripts/validate.mjs`, and commit. Status values: `force` (in force), `phased` (enacted, obligations still to start), `proposed` (draft or pending), `guidance` (non-binding guidance, model clauses, voluntary standards). Dates use `YYYY-MM-DD`, or `YYYY-MM` when only the month is known.

*This tracker is a research and planning aid, not legal advice.*
