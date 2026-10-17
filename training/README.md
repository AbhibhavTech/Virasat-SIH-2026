# Virasat model experiments (not trained)

Inference remains the configured provider's model. Nothing in this workspace claims ownership of its weights.
No training or model download runs during application startup.

1. Collect only permitted source material; record question, answer, source_id, entity_id,
   license, permitted=true and reviewed=true in JSONL. Human reviewers must confirm facts and usage rights.
2. `python training/prepare.py reviewed.jsonl training/artifacts/dataset-v1`
   normalizes, deduplicates, masks common emails/phones/keys and splits by entity.
   Pattern masking is incomplete: reviewers must check names, addresses and other PII.
3. Select a base model only after documenting license, Hindi/Hinglish benchmarks,
   context length and local GPU/RAM requirements. No model is preselected.
4. In a separate Python environment, install torch, transformers, datasets, trl and peft;
   record exact installed versions with `pip freeze` in the experiment artifact.
5. `python training/train.py --model LOCAL_MODEL_DIRECTORY --dataset training/artifacts/dataset-v1 --output training/artifacts/adapter-v1 --license-reviewed --confirm-training`
   runs a maximum 20-step LoRA experiment by default. It requires a locally downloaded model.
   Training dependency/GPU compatibility has NOT been verified here.
6. Compare base, base+RAG and adapter+RAG against identical held-out questions.
   Preserve predictions, citations, tool outcomes, latency, token usage and human factual/language scores.
   Validation loss alone is not factual accuracy. QLoRA is deferred pending GPU/quantization compatibility.
7. Review artifacts before serving through a local or compatible inference endpoint;
   set VIRASAT_AI_MODEL to the served model ID. Never automatically promote an adapter.

RAG source records and the supplied 12,500 prompt templates are not reviewed training answers.
Preparation tests: `python -m unittest discover -s training -p "test_*.py"`.
Reference implementation API: https://huggingface.co/docs/trl/sft_trainer
