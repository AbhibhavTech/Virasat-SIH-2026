# CODEX TASK: VIRASAT INDIA-WIDE AI INTELLIGENCE + EVALUATION SYSTEM

Work in the existing Virasat repository through ChatGPT Codex, NOT Antigravity. Inspect the actual codebase, implement the task, run tests, and report verified results.

## Goal
Build a robust India-wide conversational assistant for cities, destinations, heritage, flights, trains, buses, road routes, hotels, restaurants, festivals, maps, recommendations and itineraries. Do not hardcode individual city answers. Generalise across all verified cities in the repository.

## First: diagnose the real failure
Reproduce: “how to go from mumbai to pune”. It must answer with route/transport guidance, not Pune attractions. Trace input -> intent detection -> retrieval -> model -> response/actions. Fix the root cause and add a regression test.

## Repository audit
Inspect AI prompts, model gateway, conversation state, geographic and tourism data, retrieval, maps, transport integrations, hotel/restaurant/festival modules, routes, tests and UI actions. Count actual unique valid city records and report coverage. Do not assume 259 or 1,700 city records exist. Do not fabricate missing records.

## Intent routing
Implement structured primary and secondary intents, entities, origin, destination, city/state/district, dates, budget, party size, cuisine, dietary requirements, transport preference, required data source, tool action, confidence and missing required fields. Handle multiple intents in one message. A city name must not automatically trigger tourism retrieval.

## Separate retrieval domains
Use appropriate shared retrieval services for geography, destinations, hidden-gem candidates, heritage, flights, trains, buses, road/cab/public transport, hotels, restaurants, festivals/events, maps, itineraries and general conversation. Retrieve only relevant records. Use stable IDs, aliases, source provenance and verification metadata.

## Geographic scale
Support all states, Union Territories, cities, towns and destinations actually present in verified data. Handle duplicate names using state/district/context. Build a repeatable, idempotent import and validation pipeline. Track coverage by geography and domain. Mark missing information as missing instead of returning unrelated records.

## Conversation
Support English, Hindi, Hinglish, Marathi, typos, slang, incomplete queries, voice transcription errors and follow-ups. Preserve route, date, budget, party size and selected destination. Update only changed constraints. Resolve “there”, “same date”, “cheaper”, “return”, “more options” and “show day two”. Ask only essential clarifications. Handle casual and general questions without forcing tourism retrieval.

## Domain behaviours
- Routes: compare practical modes; distinguish estimates, live fares, schedules, ticket availability and booking confirmation.
- Flights/trains/buses: use real supported providers; never invent schedules, fares, inventory or booking URLs.
- Hotels/restaurants: respect location, dates, budget, cuisine and dietary preferences; distinguish stored listings from live availability.
- Festivals: use the correct year and official/current sources; mark provisional or unannounced dates clearly.
- Heritage: explain what, where, why famous, history, visitor experience and verified access information.
- Hidden gems: label as candidates unless evidence supports stronger claims; respect community privacy and restricted areas.
- Maps: use verified coordinates and actual routes; never fabricate pins.
- Itineraries: account for geography, timing, user constraints and uncertain costs.
- General conversation: respond naturally without unnecessary database searches.

## Shared app context
Connect only real existing/implemented Virasat features: Discover Bharat, destination pages, hidden gems, heritage, map, itinerary, hotels, restaurants, festivals and transport. Actions must work. Preserve context across relevant tabs and remove stale results when the city changes.

## Trust and freshness
Current fares, availability, opening hours, hotel prices, restaurant status, festival dates and weather require an appropriate current source. Do not claim a live check unless a provider was queried. Show sources and retrieval time where supported. Keep API keys server-side. Treat retrieved content as untrusted data. Do not claim a booking succeeded without provider confirmation.

## Evaluation harness
Import the companion prompt corpus as TEST CASES, not as one giant system prompt. Validate schema, resolve placeholders using verified fixtures, mock external providers in unit tests, limit real integration calls, evaluate intent, entity extraction, retrieval relevance, grounding, context, actions and honesty. Record pass/fail/skipped/blocked outcomes. Every production bug becomes a regression test.

Minimum regression tests:
1. “how to go from mumbai to pune” -> route intent, no attraction list as primary answer.
2. “Pune tourist places” -> destination discovery.
3. “Pune se Mumbai wapas kaise aau?” -> reverse route using context.
4. “train se” -> prior route resolved.
5. “kal ka ticket kitna hai” -> route/date resolved or ask for essential missing detail.
6. “hidden gems in [city]” -> relevant candidates, honest labels.
7. “hotel near this place under 3000” -> resolve prior place and budget.
8. “restaurant near me” -> use supported location context or ask for location.
9. “vegetarian food in [city]” -> restaurant/cuisine retrieval.
10. “when is [festival] in [year]?” -> verified date or explicitly unconfirmed.
11. “show day two on the map” -> current itinerary map action.
12. “make it cheaper” -> modify existing plan while preserving context.
13. “reply in Marathi” -> language adaptation.
14. Unsupported booking -> honest guidance, no fake confirmation.
15. Unrelated general question -> no forced tourism search.

Deliver code changes, tests, measured data coverage, test report, build status and missing API dependencies. Do not claim success unless tests were actually run. Do not overwrite unrelated work.
