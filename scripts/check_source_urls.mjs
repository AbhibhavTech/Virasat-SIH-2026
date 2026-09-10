import fs from "fs";

const db = JSON.parse(fs.readFileSync("data/.database/virasat_store.json", "utf8"));

const places = Object.values(db.places);
const good = [];
const bad = [];

for (const p of places) {
  if (p.verification_status !== "verified") continue;

  const url = p.source_url || (p.sources && p.sources[0] && p.sources[0].source_url) || "";

  // Check: URL me domain ke baad koi path hai ya nahi
  let path = "";
  try {
    path = new URL(url).pathname;
  } catch (e) {
    path = "";
  }

  const OFFICIAL_SITES = [
    'shrikashivishwanath.org',
    'partitionmuseum.org',
    'eternalmewar.in',
    'somnath.org'
  ];

  const isOfficialSite = OFFICIAL_SITES.some(domain => url.toLowerCase().includes(domain));
  const isDeepLink = path && path !== "/" && path.length > 1;

  if (isDeepLink) {
    good.push({ name: p.name, url: url, tier: "Tier 1: place_specific" });
  } else if (isOfficialSite) {
    good.push({ name: p.name, url: url, tier: "Tier 2: official_site" });
  } else {
    bad.push({ name: p.name, url: url, tier: "Tier 3: generic_homepage" });
  }
}

console.log("==================================");
console.log("TOTAL VERIFIED PLACES:", good.length + bad.length);
console.log("GOOD (Tier 1 Deep Link + Tier 2 Official Site):", good.length);
console.log("  - Tier 1 (place_specific deep links):", good.filter(g => g.tier.startsWith("Tier 1")).length);
console.log("  - Tier 2 (official_site allowlist):", good.filter(g => g.tier.startsWith("Tier 2")).length);
console.log("BAD (Tier 3 generic homepage - FORBIDDEN):", bad.length);
console.log("==================================");

console.log("\n----- BAD PLACES (fake verification) -----");
bad.forEach(b => console.log(" -", b.name, "=>", b.url));

console.log("\n----- GOOD PLACES (real verification) -----");
good.forEach(g => console.log(" +", g.name, "=>", g.url));

fs.writeFileSync("scripts/audit_result.json", JSON.stringify({ good, bad }, null, 2));
console.log("\nReport saved: scripts/audit_result.json");