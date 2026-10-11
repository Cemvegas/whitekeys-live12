# Automatic identity review — 2026-10-11

Baseline 1e04f47; user request removes manual identity selection and explicitly chooses first native Set device as the ambiguous cold-start fallback. Contract: docs/specs/automatic-identity-resolution.md and workspace ADR 0008.

Standards: no documented breaches. Obsolete chooser cache state removed. Shared production test fixture replaces copied harness setup. Automatic assignment creation waits for scheduled polls instead of recursively entering tick.

Spec: one P2 found and fixed. A participant becoming invalid after transaction creation must stop allocation. Transaction membership now rechecks validity, rolls back and retries after valid restoration. Red/green regression and reviewer recheck passed; no remaining blocking findings.

Validation: seven root test suites, five ES5 syntax checks, persistence configuration, AMXD/source equality and package integrity, git diff whitespace. Host/Follower duplicates, three cold copies in six initialization orders, native copy-first positioning with live incumbent, saved reopen, removed participant, invalid initial and in-flight restore, held MIDI and blocked-source references passed. Idle 20-poll performance: zero additional native objects, repeated parameter names or unchanged model messages.

Existing native short enrollment discovery correction and its regression were retained in the shared fixture and production source. Unrelated diagnostic/spec edits remain separate.

Native Live duplicate/save/reopen and load performance have not been tested for this revision: Not run. The first-device fallback is a recovery policy, not proof of historical originality. Normal Set save persists automatically assigned identities.
