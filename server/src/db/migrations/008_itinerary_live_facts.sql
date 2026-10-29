-- Do not persist fabricated prices, appointment times, or transit estimates.
-- Live quote providers are not connected; NULL means unknown rather than free.
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS origin TEXT;
ALTER TABLE itineraries ALTER COLUMN total_cost DROP NOT NULL;
ALTER TABLE itineraries ALTER COLUMN total_cost DROP DEFAULT;
ALTER TABLE itineraries ALTER COLUMN estimated_budget DROP NOT NULL;
ALTER TABLE itineraries ALTER COLUMN estimated_budget DROP DEFAULT;

ALTER TABLE itinerary_stops ALTER COLUMN duration_minutes DROP NOT NULL;
ALTER TABLE itinerary_stops ALTER COLUMN duration_minutes DROP DEFAULT;
ALTER TABLE itinerary_stops ALTER COLUMN travel_mode DROP NOT NULL;
ALTER TABLE itinerary_stops ALTER COLUMN travel_mode DROP DEFAULT;
ALTER TABLE itinerary_stops ALTER COLUMN travel_duration_minutes DROP NOT NULL;
ALTER TABLE itinerary_stops ALTER COLUMN travel_duration_minutes DROP DEFAULT;
ALTER TABLE itinerary_stops ALTER COLUMN travel_distance_km DROP NOT NULL;
ALTER TABLE itinerary_stops ALTER COLUMN travel_distance_km DROP DEFAULT;
ALTER TABLE itinerary_stops ALTER COLUMN estimated_cost DROP NOT NULL;
ALTER TABLE itinerary_stops ALTER COLUMN estimated_cost DROP DEFAULT;
