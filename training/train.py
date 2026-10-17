"""Explicitly gated small LoRA experiment; never invoked by app startup."""
import argparse
import hashlib
import json
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--model", required=True, help="Reviewed local base model directory")
parser.add_argument("--dataset", required=True, type=Path)
parser.add_argument("--output", required=True, type=Path)
parser.add_argument("--confirm-training", action="store_true")
parser.add_argument("--license-reviewed", action="store_true")
parser.add_argument("--max-steps", type=int, default=20)
args = parser.parse_args()
if not args.confirm_training or not args.license_reviewed:
    parser.error("Training requires --confirm-training and --license-reviewed after hardware, data and license review")
if not Path(args.model).is_dir() or not 1 <= args.max_steps <= 100:
    parser.error("Use an existing local model and 1–100 steps for the first experiment")
if args.output.exists():
    parser.error("Choose a new versioned output directory")

from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import LoraConfig
from trl import SFTConfig, SFTTrainer

tokenizer = AutoTokenizer.from_pretrained(args.model, local_files_only=True, trust_remote_code=False)
if not tokenizer.chat_template:
    raise ValueError("The selected model must supply a reviewed chat template")
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
model = AutoModelForCausalLM.from_pretrained(args.model, local_files_only=True, trust_remote_code=False)
dataset = load_dataset("json", data_files={key: str(args.dataset / f"{key}.jsonl") for key in ("train", "validation")})
if not len(dataset["train"]) or not len(dataset["validation"]):
    raise ValueError("Reviewed training and validation splits must be nonempty")
lengths = [len(tokenizer.apply_chat_template(row["messages"], tokenize=True)) for row in dataset["train"]]
config = SFTConfig(output_dir=str(args.output), max_steps=args.max_steps, per_device_train_batch_size=1,
                   gradient_accumulation_steps=4, max_length=1024, report_to="none", push_to_hub=False)
trainer = SFTTrainer(model=model, args=config, processing_class=tokenizer,
                     train_dataset=dataset["train"], eval_dataset=dataset["validation"],
                     peft_config=LoraConfig(r=8, lora_alpha=16, target_modules="all-linear", task_type="CAUSAL_LM"))
trainer.train()
metrics = trainer.evaluate()
trainer.save_model(str(args.output))
tokenizer.save_pretrained(str(args.output))
manifest = {"base_model": args.model, "dataset_sha256": hashlib.sha256((args.dataset / "train.jsonl").read_bytes()).hexdigest(),
            "max_steps": args.max_steps, "training_tokens": sum(lengths), "max_example_tokens": max(lengths),
            "evaluation": metrics, "production_approved": False}
(args.output / "virasat-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
