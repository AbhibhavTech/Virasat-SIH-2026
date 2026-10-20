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

## Discover Bharat behavior

- The landing view presents all 36 state and Union Territory cards.
- Exploring a state opens its state guide, featured attraction highlights, and city/destination cards. Exploring a city opens its overview and place-card guide.
- See [Discover Bharat state and city experience](discover-bharat-state-city-experience.md) for the persistent requirements and data-trust rules.
- The hierarchy and hidden-gem coverage remain incomplete; UI coverage does not mean every destination has a verified place/image/practical record.

## Remaining content work before a complete 10 + 10 catalog

To reach the target, each major city still needs ten source-backed well-known attractions and ten distinct locally recommended lesser-known places, with provenance, city/state mapping, coordinate review, image attribution, and clear verification status. The existing database does not yet meet that content target. The slideshow and browse-flow implementation does not create synthetic records or upgrade candidates to verified status.
