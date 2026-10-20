# Discover Bharat state and city experience

This is the persistent product requirement for Discover Bharat. Apply it to all 28 states and 8 union territories, not only to Arunachal Pradesh or Andhra Pradesh.

## Browse flow

1. The Discover Bharat landing view shows all 36 state and UT flash cards. Each card has a clear Explore action.
2. Exploring a state or UT opens its destination view with an accessible slideshow of that area's source-backed, notable attractions.
3. The state/UT view also shows its city, town, island, valley, and destination cards. Each card has an Explore action.
4. Exploring a city opens a city guide with an overview and separate image cards for the relevant places. Users can discover famous attractions and lesser-known places without leaving the city context.

## Place cards and practical details

Where records exist, city guides should expose filters and cards for:

- Heritage, monuments, museums, forts and UNESCO places.
- Spiritual destinations across the represented faiths.
- National parks, wildlife sanctuaries, zoological parks, birding and nature.
- Popular attractions, local experiences and hidden-gem candidates.

Each place card should use a relevant image with source/creator/license attribution, a concise overview, location, and the available visitor basics: best season, opening hours, fees, recommended duration, transport/nearest airport or railhead, and nearby stay options. Show a clear “not verified” or “check locally” state for missing or time-sensitive details. Never fill gaps with invented timings, prices, hotel availability, routes, or image matches.

## Content trust

- Preserve the distinction between verified attractions and hidden-gem candidates that still need local or source review.
- A place cannot be labelled verified solely because it exists in the bundled database. Keep its provenance and review status visible to the UI and retrieval system.
- Do not claim comprehensive city coverage when the records are incomplete. Surface honest coverage counts and let users report missing places.
- Reuse structured hierarchy records and place provenance. Do not create 36 separately hard-coded state experiences when one data-driven component can render them.

## Current data coverage snapshot

The bundled hierarchy currently has 36 states/UTs and 171 city/destination records. The separate hidden-gem dataset has 45 candidate records across 26 city/destination labels; it does not provide ten reviewed hidden gems for every major city. Therefore, the browse flow can be consistent across all state/UT cards, while the number of populated attraction and hidden-gem cards varies by destination until research and source review expands the dataset.

## Current implementation notes

- The Discover Bharat landing page already renders state and UT cards from the hierarchy.
- City detail view already renders structured place cards, categories, source/verification signals, practical information, and hidden-gem candidates when present.
- State attraction highlights should use a reusable, keyboard-accessible slideshow over verified hierarchy records.
- State-specific editorial guides may add depth, but must remain consistent with the state → destination → place-card flow above.
