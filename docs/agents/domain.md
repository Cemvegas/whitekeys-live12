# Domain Docs

## Layout

This project uses a single-context layout, relative to this workspace root:

- `GLOSSARY.md`: domain terms.
- `docs/adr/`: architecture decision records.

## Before exploring, read these

Read `GLOSSARY.md` and the ADRs in `docs/adr/` relevant to the area being explored. If a root `GLOSSARY-MAP.md` exists later, use it to find the relevant context glossaries and check `src/<context>/docs/adr/` for scoped decisions.

If any of these files do not exist, proceed silently. Do not flag their absence or suggest creating them upfront. The `domain-modeling` skill creates them lazily when terms or decisions are actually resolved.

## Use the glossary's vocabulary

Use terms defined in `GLOSSARY.md` in issue titles, proposals, hypotheses, and tests. Avoid synonyms that the glossary explicitly excludes. If a needed concept is missing, reconsider whether it belongs to the domain or note the gap for `domain-modeling`.

## Flag ADR conflicts

If a proposal contradicts an existing ADR, surface the conflict explicitly rather than silently overriding it; name the ADR and explain why it is worth reopening.
