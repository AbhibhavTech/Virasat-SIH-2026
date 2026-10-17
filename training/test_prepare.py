import unittest
from prepare import prepare, redact

class PreparationTests(unittest.TestCase):
    def test_permissions_and_deduplication(self):
        row = dict(question="What is this monument?", answer="Reviewed answer", entity_id="place-1",
                   source_id="permitted-source", license="reviewed license", permitted=True, reviewed=True)
        splits, rejected = prepare([row, row, {**row, "permitted": False}])
        self.assertEqual(sum(map(len, splits.values())), 1)
        self.assertEqual(rejected, 1)

    def test_pii_redaction(self):
        self.assertEqual(redact("test@example.com 9876543210"), "[EMAIL] [PHONE]")

    def test_entity_split(self):
        rows = [dict(question=f"Question {n}", answer="Answer", entity_id="one", source_id="source",
                     license="reviewed", permitted=True, reviewed=True) for n in range(10)]
        splits, _ = prepare(rows)
        self.assertEqual(sum(bool(value) for value in splits.values()), 1)

if __name__ == "__main__":
    unittest.main()
