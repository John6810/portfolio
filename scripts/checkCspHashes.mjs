// CSP script-src integrity guard.
//
// Astro emits a few tiny INLINE runtime <script> blocks (astro-island custom
// element + Astro.load/Astro.only). public/_headers pins their exact SHA-256
// hashes in the CSP script-src directive instead of allowing 'unsafe-inline'.
//
// Those hashes are Astro-version-specific. This script runs in CI after the
// build and asserts that:
//   1. script-src contains NO 'unsafe-inline' (no regression), and
//   2. every inline executable <script> in dist/ has its hash pinned in _headers.
//
// If an Astro bump changes a runtime script, its hash stops matching and CI
// fails loudly here — instead of the CSP silently blocking the script and
// breaking React island hydration in production.

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const HEADERS = "public/_headers";

// Collect all inline <script> hashes present in the CSP script-src directive.
const headers = readFileSync(HEADERS, "utf8");
const cspLine = headers
  .split("\n")
  .find((l) => l.includes("Content-Security-Policy:"));
if (!cspLine) {
  console.error(`✗ No Content-Security-Policy found in ${HEADERS}`);
  process.exit(1);
}
const scriptSrc = (cspLine.match(/script-src([^;]*)/) || [, ""])[1];
if (/'unsafe-inline'/.test(scriptSrc)) {
  console.error("✗ script-src contains 'unsafe-inline' — CSP regression.");
  process.exit(1);
}
const pinned = new Set(
  [...scriptSrc.matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map((m) => m[1]),
);

// Walk dist and hash every inline executable script.
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") && files.push(p);
  }
})(DIST);

const inlineRe = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
const missing = new Map();
let checked = 0;
for (const file of files) {
  const html = readFileSync(file, "utf8");
  let m;
  while ((m = inlineRe.exec(html))) {
    const [, attrs, body] = m;
    // Non-executable data blocks (JSON-LD etc.) are exempt from script-src.
    if (/type\s*=\s*["']application\/(ld\+json|json)["']/i.test(attrs))
      continue;
    if (body.trim() === "") continue;
    const hash = createHash("sha256").update(body, "utf8").digest("base64");
    checked++;
    if (!pinned.has(hash) && !missing.has(hash)) {
      missing.set(hash, {
        file,
        sample: body.slice(0, 80).replace(/\n/g, " "),
      });
    }
  }
}

if (missing.size > 0) {
  console.error(
    `✗ ${missing.size} inline script hash(es) not pinned in ${HEADERS} script-src:\n`,
  );
  for (const [hash, info] of missing) {
    console.error(`  'sha256-${hash}'`);
    console.error(`    first seen: ${info.file}`);
    console.error(`    starts:     ${info.sample}\n`);
  }
  console.error(
    "Add the missing 'sha256-…' token(s) to script-src in public/_headers.",
  );
  process.exit(1);
}

console.log(
  `✓ CSP script-src OK — ${checked} inline script instance(s), ${pinned.size} pinned hash(es), no 'unsafe-inline'.`,
);
