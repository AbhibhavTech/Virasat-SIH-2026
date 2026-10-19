# AI conversation storage

The AI workspace now stores conversation metadata, bounded model history, editable
drafts and saved-trip references in `data/.database/ai-conversations.json`.
This directory is ignored by Git. API keys and provider configuration are not part
of the snapshot. Owner checks remain enforced before serving history.

Writes use a private temporary file, fsync and atomic replacement. A malformed
snapshot is preserved for operator recovery; it is not overwritten with an empty
store. History then remains in memory and a fixed, secret-free diagnostic is logged.
The history API reports `storage: file` or `storage: memory` accordingly.

History expires after six hours and is removed from the next snapshot when a
request triggers expiry cleanup. Deleted conversations stay deleted after restart.
Anonymous requests without a browser owner token are not persisted.

## Render deployment

Set `VIRASAT_CHAT_STORE_PATH=/var/data/virasat/ai-conversations.json` only after
mounting a persistent disk at `/var/data`. The default Render filesystem is
ephemeral: a file there does not guarantee history survives deployments or instance
replacement. No disk was provisioned or billed by this change.

Run one server process/replica with this file store. It is not a shared multi-server
database. Before scaling, migrate to a transactional shared store; do not point
multiple writers at the same file. Existing trip/account database storage is separate.

## Verification

`node --import tsx scripts/test_conversation_persistence.ts` starts separate Node
processes to verify restoration, owner isolation and deletion across restarts. It
also verifies expiry and corrupt-store detection using a temporary isolated store.
The existing assistant-upgrades suite covers claim, edit, save and location clearing.
