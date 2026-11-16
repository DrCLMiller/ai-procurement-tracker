// Validates data/tracker.json before anything is published.
// Run: node scripts/validate.mjs   (no dependencies; Node 18+)
import { readFileSync } from "node:fs";

const file = new URL("../data/tracker.json", import.meta.url);
const errors = [];
const warn = [];
let data;
try { data = JSON.parse(readFileSync(file, "utf8")); }
catch (e) { console.error("tracker.json is not valid JSON:", e.message); process.exit(1); }

const STATUS = ["force", "phased", "proposed", "guidance"];
const JURS = ["US Federal", "US State", "European Union", "United Kingdom", "Canada", "Asia-Pacific", "International standards"];
const BUYERS = ["public", "private"];
const DATE = /^\d{4}-\d{2}(-\d{2})?$/;
const isUrl = u => /^https:\/\/[^\s]+$/.test(u);

const { meta, clauses, rules } = data;
if (!meta || !Array.isArray(clauses) || !Array.isArray(rules)) errors.push("Top level must have meta, clauses[], rules[]");

if (!/^\d{4}-\d{2}-\d{2}$/.test(meta?.lastVerified || "")) errors.push("meta.lastVerified must be YYYY-MM-DD");
else if (new Date(meta.lastVerified) > new Date(Date.now() + 864e5)) errors.push("meta.lastVerified is in the future");
for (const k of ["reportUrl", "historyUrl"]) if (meta?.[k] && !isUrl(meta[k])) errors.push(`meta.${k} must be an https URL or empty`);

const clauseIds = new Set();
for (const c of clauses || []) {
  const where = `clause ${c.id || "(no id)"}`;
  if (!c.id || !/^[a-z0-9-]+$/.test(c.id)) errors.push(`${where}: id must be lowercase letters, digits, hyphens`);
  if (clauseIds.has(c.id)) errors.push(`${where}: duplicate id`);
  clauseIds.add(c.id);
  for (const f of ["name", "purpose", "starter"]) if (!c[f] || typeof c[f] !== "string") errors.push(`${where}: missing ${f}`);
  if (!Array.isArray(c.require) || c.require.length < 1) errors.push(`${where}: require[] needs at least one item`);
  if (typeof c.agentic !== "boolean") errors.push(`${where}: agentic must be true/false`);
}

const ruleIds = new Set();
const used = new Set();
for (const r of rules || []) {
  const where = `rule ${r.id || "(no id)"}`;
  if (!r.id || !/^[a-z0-9-]+$/.test(r.id)) errors.push(`${where}: id must be lowercase letters, digits, hyphens`);
  if (ruleIds.has(r.id)) errors.push(`${where}: duplicate id`);
  ruleIds.add(r.id);
  for (const f of ["name", "short", "applies", "summary", "type"]) if (!r[f] || typeof r[f] !== "string") errors.push(`${where}: missing ${f}`);
  if (!STATUS.includes(r.status)) errors.push(`${where}: status must be one of ${STATUS.join(", ")}`);
  if (!JURS.includes(r.jur)) errors.push(`${where}: jur must be one of ${JURS.join(", ")}`);
  if (typeof r.agentic !== "boolean") errors.push(`${where}: agentic must be true/false`);
  if (!Array.isArray(r.buyers) || !r.buyers.length || r.buyers.some(b => !BUYERS.includes(b))) errors.push(`${where}: buyers must list public and/or private`);
  if (!Array.isArray(r.implications) || !r.implications.length) errors.push(`${where}: implications[] required`);
  if (!Array.isArray(r.dates)) errors.push(`${where}: dates[] required (may be empty)`);
  for (const d of r.dates || []) {
    if (!DATE.test(d.d || "")) errors.push(`${where}: date "${d.d}" must be YYYY-MM-DD or YYYY-MM`);
    if (!d.t) errors.push(`${where}: date ${d.d} needs a label`);
  }
  if (!Array.isArray(r.clauses) || !r.clauses.length) errors.push(`${where}: clauses[] required`);
  for (const c of r.clauses || []) { if (!clauseIds.has(c)) errors.push(`${where}: unknown clause "${c}"`); used.add(c); }
  if (!Array.isArray(r.sources) || !r.sources.length) errors.push(`${where}: at least one source required`);
  for (const s of r.sources || []) if (!s.t || !isUrl(s.u || "")) errors.push(`${where}: each source needs a title and https URL`);
  if (r.status === "phased" && (r.dates || []).every(d => new Date(d.d.length === 7 ? d.d + "-28" : d.d) < new Date()))
    warn.push(`${where}: status is "phased" but every date has passed; consider "force"`);
}
for (const id of clauseIds) if (!used.has(id)) warn.push(`clause ${id}: not referenced by any rule`);

for (const w of warn) console.warn("WARN ", w);
if (errors.length) { for (const e of errors) console.error("ERROR", e); console.error(`\n${errors.length} error(s). Fix before publishing.`); process.exit(1); }
console.log(`OK: ${rules.length} rules, ${clauses.length} clauses, last verified ${meta.lastVerified}.`);
