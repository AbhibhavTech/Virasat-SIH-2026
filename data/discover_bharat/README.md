# Discover Bharat region drafts

The five JSON files in `regions/` are the supplied Maharashtra, Bihar, Jammu and Kashmir, West Bengal, and Gujarat drafts. The schema is copied unchanged from the supplied master schema. These files are **not** imported into the public Discover Bharat views or the runtime tourism database yet.

Run `npm run check:discover-bharat` to validate JSON shape, taxonomy, IDs, links between region/city/attraction cards, and hidden-gem quotas. This is a structural check, not a factual verification. The checker reports `publishReady` for each file.

Current intake: 35 cities, 165 attractions, and 70 proposed hidden gems. All 165 attraction records are marked `pending`. Across region, city, and attraction cards, 205 images still need licensed or original photographs. The 165 attraction records contain 990 practical fields marked `needs_verification`; 30 live-update dates also need verification. Do not present these as current opening hours, fees, hotel availability, or live events.

Before runtime import, review each claim and operational field against an authoritative current source or on-ground confirmation, record internal provenance and `last_verified`, and replace image briefs with licensed or original assets. Re-run the validator. Publish only records that pass editorial review; do not convert a missing value into a guessed one. Keep provenance internal rather than adding competitor links to visitor-facing cards.
