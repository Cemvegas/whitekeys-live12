# Domain Docs

## Single project root

[GLOSSARY.md](../../GLOSSARY.md) and `docs/adr/` at this project root are authoritative. Edit them directly; there is no separate workspace copy or snapshot manifest. A source clone and development ZIP carry the same domain documents.

Read the glossary and relevant ADRs before exploration. ADR 0008 supersedes ADR 0006's manual identity selection and ADR 0007's corresponding conflict clause. Earlier records remain historical evidence.

## Use the glossary's vocabulary

Use terms defined in `GLOSSARY.md` in issue titles, proposals, hypotheses, and tests. Avoid synonyms that the glossary explicitly excludes. If a needed concept is missing, reconsider whether it belongs to the domain or note the gap for `domain-modeling`.

## Flag ADR conflicts

If a proposal contradicts an existing ADR, surface the conflict explicitly rather than silently overriding it; name the ADR and explain why it is worth reopening.
