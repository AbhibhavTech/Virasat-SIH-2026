"""Offline preparation of explicitly permitted, reviewed instruction records.

Input JSONL: question, answer, source_id, entity_id, license, permitted=true,
reviewed=true. No chat logs or RAG index are imported automatically.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path


def redact(text):
    text = re.sub(r"\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b", "[EMAIL]", text)
    text = re.sub(r"(?<!\w)(?:\+?91[ -]?)?[6-9]\d{9}(?!\w)", "[PHONE]", text)
    text = re.sub(r"\b(?:sk-|gsk_)[A-Za-z0-9_-]{12,}\b", "[SECRET]", text)
    return text


def prepare(records):
    splits = {"train": [], "validation": [], "test": []}
    seen = set()
    rejected = 0
    for record in records:
        if record.get("permitted") is not True or record.get("reviewed") is not True or not all(
            isinstance(record.get(key), str) and record[key].strip()
            for key in ("source_id", "entity_id", "license", "question", "answer")
        ):
            rejected += 1
            continue
        question, answer = (redact(record[key].strip()) for key in ("question", "answer"))
        digest = hashlib.sha256((question.casefold() + "\n" + answer.casefold()).encode()).hexdigest()
        if digest in seen:
            continue
        seen.add(digest)
        # Entity grouping prevents paraphrases of the same attraction leaking into test.
        bucket = int(hashlib.sha256(record["entity_id"].casefold().encode()).hexdigest()[:8], 16) % 100
        split = "test" if bucket < 10 else "validation" if bucket < 20 else "train"
        splits[split].append({"id": digest, "source_id": record["source_id"], "entity_id": record["entity_id"],
                              "license": record["license"], "messages": [
                                  {"role": "user", "content": question}, {"role": "assistant", "content": answer}]})
    return splits, rejected


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    raw = args.input.read_bytes()
    splits, rejected = prepare(json.loads(line) for line in raw.decode("utf-8-sig").splitlines() if line.strip())
    args.output.mkdir(parents=True, exist_ok=False)
    for name, rows in splits.items():
        (args.output / f"{name}.jsonl").write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows), encoding="utf-8")
    manifest = {"source_sha256": hashlib.sha256(raw).hexdigest(), "counts": {key: len(value) for key, value in splits.items()},
                "rejected": rejected, "pii_review": "Pattern redaction only; manual review still required", "training_run": False}
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest))
