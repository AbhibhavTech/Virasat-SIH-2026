# Discover Bharat city discovery coverage

Audit source: `data/india_tourism_database.json` and `src/data/hiddenGemsData.ts`.

## Current coverage

- The bundled hierarchy contains 36 states/UTs and 171 city entries.
- The hidden-gem dataset contains 45 records across 26 city/destination labels.
- It does not contain ten hidden-gem records for each major city. Current coverage in the largest city records is:

| City | Existing place records marked verified | Hidden-gem candidates in the separate file |
| --- | ---: | ---: |
| Delhi | 30 | 3 |
| Mumbai | 15 | 13 |
| Ranchi | 14 | 0 |
| Pune | 14 | 0 |
| Amaravati | 11 | 0 |
| Goa | 10 | 0 |
| Bhopal | 10 | 0 |
| Imphal | 10 | 0 |
| Kolkata | 10 | 0 |
| Leh | 10 | 1 |
| Kurukshetra | 9 | 0 |
| Kochi | 9 | 2 |
| Bhubaneswar | 8 | 0 |
| Amritsar | 8 | 0 |
| Srinagar | 8 | 0 |

The dataset also has two candidates each for Jaipur, Agra and Varanasi. Other records are distributed across smaller destinations.

## Source-quality finding

The hidden-gem records do not consistently include place-specific source URLs, image provenance, or verification evidence. Several city attraction records also point to a tourism department homepage rather than a page documenting that particular attraction. The existing `verified` flag alone is therefore not sufficient evidence to describe all current records as independently source-verified.

## Local Discover Bharat behavior

- Discover Bharat now presents state and Union Territory cards only. City directories, city search suggestions, and place cards are not part of this page.
- The underlying city, place, UNESCO, and festival datasets are unchanged; dedicated features continue to own their data.
- State cards show the territory name, region, capital, and state overview. Saved-state behavior remains available.

## Remaining content work before a complete 10 + 10 catalog

When city discovery is reintroduced, each target city needs ten source-backed well-known attractions and ten distinct locally recommended lesser-known places, with provenance, city/state mapping, coordinate review, image attribution, and clear verification status. The existing database does not yet meet that content target. This UI update does not modify the underlying database, create synthetic records, or upgrade candidates to verified status.
