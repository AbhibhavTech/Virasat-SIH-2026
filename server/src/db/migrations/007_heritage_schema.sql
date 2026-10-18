-- Virasat AI: Heritage database (PostgreSQL)
-- Migration 007: 45 Heritage Sites and Multi-language Translation Engine

DO $$ BEGIN
  CREATE TYPE unesco_status AS ENUM ('inscribed','part_of_inscribed','tentative','not_listed','unverified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,            -- ISO 639: 'en','hi','mr','ta',...
  name_en TEXT NOT NULL,
  name_native TEXT NOT NULL,
  script TEXT,
  rtl BOOLEAN DEFAULT FALSE,        -- Urdu, Kashmiri(Perso-Arabic), Sindhi(Perso-Arabic) need RTL layout
  scheduled_8th BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS heritages (
  id              SERIAL PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,           -- 'taj-mahal'
  list_no         INT UNIQUE NOT NULL,            -- 1..45 as in your list
  name            TEXT NOT NULL,
  alt_names       TEXT[],
  category        TEXT,                           -- monument, temple, fort, cave, railway, natural, living-heritage
  state_ut        TEXT NOT NULL,
  district_city   TEXT NOT NULL,
  lat             NUMERIC(9,6),
  lng             NUMERIC(9,6),
  era             TEXT,                           -- 'Mughal, 1632-1653'
  built_year_from INT,
  built_year_to   INT,
  builder         TEXT,
  -- Authenticity
  unesco_status   unesco_status NOT NULL DEFAULT 'unverified',
  unesco_ref_id   TEXT,                           -- WHC id e.g. '252'
  unesco_inscribed_year INT,
  unesco_site_name TEXT,                          -- parent site if part_of_inscribed
  unesco_url      TEXT,
  asi_protected   BOOLEAN,
  last_verified_on DATE,
  verified_by     TEXT,
  review_status   TEXT DEFAULT 'draft',           -- draft | reviewed | published
  -- Long-form English content (source of truth for translation)
  overview        TEXT,   -- 150-250 words
  history         TEXT,   -- 400-700 words
  architecture    TEXT,   -- 300-500 words
  cultural_significance TEXT, -- 200-350 words
  -- Practical info
  opening_hours   JSONB,  -- {"mon":"06:00-18:30",...,"closed":["fri"]}
  ticket_prices   JSONB,  -- {"indian":..,"foreign":..,"saarc":..,"child_free_under":15,"currency":"INR","as_of":"2026-10-01"}
  accessibility   JSONB,  -- {"wheelchair":true,"notes":"..."}
  visitor_rules   TEXT[],
  best_season     TEXT,
  recommended_duration TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS heritage_features   (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, sort INT, title TEXT, description TEXT);  -- 5-10
CREATE TABLE IF NOT EXISTS heritage_timeline   (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, sort INT, year_label TEXT, year_sort INT, event TEXT, source_id INT);  -- 5-10
CREATE TABLE IF NOT EXISTS heritage_stops      (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, sort INT, title TEXT, description TEXT, photo_tip TEXT, minutes INT);  -- 5-8
CREATE TABLE IF NOT EXISTS heritage_facts      (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, sort INT, fact TEXT, source_id INT);  -- 5-10
CREATE TABLE IF NOT EXISTS heritage_nearby     (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, sort INT, name TEXT, distance_km NUMERIC(6,1), note TEXT, related_slug TEXT);  -- 3-8
CREATE TABLE IF NOT EXISTS heritage_travel     (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, mode TEXT, hub_name TEXT, distance_km NUMERIC(6,1), note TEXT);  -- air/rail/road/local
CREATE TABLE IF NOT EXISTS heritage_media      (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, kind TEXT, -- hero | gallery | audio | video
                                  url TEXT, alt_text TEXT, caption TEXT, credit TEXT, licence TEXT, source_url TEXT, sort INT);
CREATE TABLE IF NOT EXISTS heritage_sources    (id SERIAL PRIMARY KEY, heritage_id INT REFERENCES heritages ON DELETE CASCADE, title TEXT, publisher TEXT, url TEXT, source_type TEXT, -- unesco | asi | govt | academic | book
                                  accessed_on DATE);  -- 2-5+

-- Translations: one row per (record, field, language). Keeps the schema stable for 22 languages.
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  entity TEXT NOT NULL,            -- 'heritage' | 'feature' | 'timeline' | 'stop' | 'fact' | 'nearby'
  entity_id INT NOT NULL,
  field TEXT NOT NULL,             -- 'history','title','description',...
  lang TEXT REFERENCES languages(code),
  text TEXT NOT NULL,
  method TEXT DEFAULT 'machine',   -- machine | human_reviewed
  reviewed_by TEXT,
  source_hash TEXT,                -- hash of English text; if English changes, translation is flagged stale
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (entity, entity_id, field, lang)
);
CREATE INDEX IF NOT EXISTS idx_translations_lang_entity ON translations (lang, entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_heritages_state_ut ON heritages (state_ut);
CREATE INDEX IF NOT EXISTS idx_heritages_unesco_status ON heritages (unesco_status);

INSERT INTO languages (code,name_en,name_native,script,rtl) VALUES
('en','English','English','Latin',false),
('as','Assamese','অসমীয়া','Bengali-Assamese',false),
('bn','Bengali','বাংলা','Bengali',false),
('brx','Bodo','बड़ो','Devanagari',false),
('doi','Dogri','डोगरी','Devanagari',false),
('gu','Gujarati','ગુજરાતી','Gujarati',false),
('hi','Hindi','हिन्दी','Devanagari',false),
('kn','Kannada','ಕನ್ನಡ','Kannada',false),
('ks','Kashmiri','كٲشُر','Perso-Arabic',true),
('kok','Konkani','कोंकणी','Devanagari',false),
('mai','Maithili','मैथिली','Devanagari',false),
('ml','Malayalam','മലയാളം','Malayalam',false),
('mni','Manipuri (Meitei)','ꯃꯤꯇꯩꯂꯣꯟ','Meitei Mayek',false),
('mr','Marathi','मराठी','Devanagari',false),
('ne','Nepali','नेपाली','Devanagari',false),
('or','Odia','ଓଡ଼ିଆ','Odia',false),
('pa','Punjabi','ਪੰਜਾਬੀ','Gurmukhi',false),
('sa','Sanskrit','संस्कृतम्','Devanagari',false),
('sat','Santhali','ᱥᱟᱱᱛᱟᱲᱤ','Ol Chiki',false),
('sd','Sindhi','سنڌي','Perso-Arabic',true),
('ta','Tamil','தமிழ்','Tamil',false),
('te','Telugu','తెలుగు','Telugu',false),
('ur','Urdu','اردو','Perso-Arabic',true)
ON CONFLICT (code) DO NOTHING;
