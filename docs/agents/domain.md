# Domain Docs

## Authority and portable snapshots

In the original White Keys workspace, the parent workspace's `GLOSSARY.md` and `docs/adr/` are authoritative. This source checkout carries byte-identical snapshots at [GLOSSARY.md](../../GLOSSARY.md) and `docs/adr/`, so a standalone clone or development ZIP can read the same decisions.

`docs/domain-snapshot.json` records hashes of the copied files. Update domain decisions in the workspace first, then refresh their source snapshots and this manifest. `check-navigation.py` validates snapshot hashes; in the original workspace it also compares snapshots with the authoritative files. Standalone checks require no parent workspace.

Read the glossary and relevant ADRs before exploration. ADR 0008 supersedes ADR 0006's manual identity selection and ADR 0007's corresponding conflict clause. Earlier records remain historical evidence.

## Use the glossary's vocabulary

Use terms defined in `GLOSSARY.md` in issue titles, proposals, hypotheses, and tests. Avoid synonyms that the glossary explicitly excludes. If a needed concept is missing, reconsider whether it belongs to the domain or note the gap for `domain-modeling`.

## Flag ADR conflicts

If a proposal contradicts an existing ADR, surface the conflict explicitly rather than silently overriding it; name the ADR and explain why it is worth reopening.
