import json
import os
import pytest

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "maharashtra_destinations.json")
LOG_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "maharashtra_verification_log.jsonl")
BACKEND_LOG_FILE = os.path.join(os.path.dirname(__file__), "..", "backend", "app", "data", "maharashtra_verification_log.jsonl")

@pytest.fixture(scope="module")
def destinations():
    assert os.path.exists(DATA_FILE), f"Dataset file missing: {DATA_FILE}"
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

@pytest.fixture(scope="module")
def verification_log():
    assert os.path.exists(LOG_FILE), f"Log file missing: {LOG_FILE}"
    records = []
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))
    return records

def test_total_count(destinations):
    """Exactly 40 destinations must exist in the Maharashtra dataset."""
    assert len(destinations) == 40, f"Expected 40 destinations, got {len(destinations)}"

def test_10_10_10_10_distribution(destinations):
    """Exactly 10 famous & 10 hidden per city (Mumbai and Pune)."""
    mumbai_famous = [d for d in destinations if d.get("city") == "Mumbai" and d.get("type") == "famous"]
    mumbai_hidden = [d for d in destinations if d.get("city") == "Mumbai" and d.get("type") == "hidden"]
    pune_famous = [d for d in destinations if d.get("city") == "Pune" and d.get("type") == "famous"]
    pune_hidden = [d for d in destinations if d.get("city") == "Pune" and d.get("type") == "hidden"]

    assert len(mumbai_famous) == 10, f"Expected 10 Mumbai famous, got {len(mumbai_famous)}"
    assert len(mumbai_hidden) == 10, f"Expected 10 Mumbai hidden, got {len(mumbai_hidden)}"
    assert len(pune_famous) == 10, f"Expected 10 Pune famous, got {len(pune_famous)}"
    assert len(pune_hidden) == 10, f"Expected 10 Pune hidden, got {len(pune_hidden)}"

def test_filter_by_city_and_type(destinations):
    """Verify programmatic filtering by city and type."""
    def filter_places(city=None, p_type=None):
        res = destinations
        if city:
            res = [d for d in res if d.get("city", "").lower() == city.lower()]
        if p_type:
            res = [d for d in res if d.get("type", "").lower() == p_type.lower()]
        return res

    assert len(filter_places(city="Mumbai")) == 20
    assert len(filter_places(city="Pune")) == 20
    assert len(filter_places(p_type="famous")) == 20
    assert len(filter_places(p_type="hidden")) == 20
    assert len(filter_places(city="Mumbai", p_type="famous")) == 10
    assert len(filter_places(city="Mumbai", p_type="hidden")) == 10
    assert len(filter_places(city="Pune", p_type="famous")) == 10
    assert len(filter_places(city="Pune", p_type="hidden")) == 10

def test_overview_word_counts(destinations):
    """Every overview must strictly be between 45 and 55 words."""
    for d in destinations:
        overview = d.get("overview", "")
        word_count = len(overview.strip().split())
        assert 45 <= word_count <= 55, (
            f"Overview word count violation for '{d.get('name')}': {word_count} words (must be 45-55 words). "
            f"Text: {overview}"
        )

def test_community_listed_attribute(destinations):
    """Hidden gems must have community_listed=True, famous must have community_listed=False."""
    for d in destinations:
        if d.get("type") == "hidden":
            assert d.get("community_listed") is True, f"Hidden gem '{d.get('name')}' must have community_listed=True"
        elif d.get("type") == "famous":
            assert d.get("community_listed") is False, f"Famous place '{d.get('name')}' must have community_listed=False"

def test_evidence_and_verification_log(destinations, verification_log):
    """Evidence log must contain 40 entries with page_fetched=True and verified status."""
    assert len(verification_log) == 40
    dest_ids = {d["id"] for d in destinations}
    log_ids = {item["id"] for item in verification_log}
    assert dest_ids == log_ids

    for entry in verification_log:
        assert entry["status"] in ("VERIFIED", "PARTIALLY_VERIFIED", "NEEDS_REVIEW")
        assert len(entry["sources"]) >= 1
        assert any(s.get("page_fetched") is True for s in entry["sources"])
        assert len(entry["facts_confirmed"]) >= 3

def test_backend_mirror_log():
    """Verify backend mirror file exists and is populated."""
    assert os.path.exists(BACKEND_LOG_FILE)
    with open(BACKEND_LOG_FILE, "r", encoding="utf-8") as f:
        lines = [l for l in f if l.strip()]
    assert len(lines) == 40
