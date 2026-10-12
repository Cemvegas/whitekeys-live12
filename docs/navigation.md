# Source navigation

Start here to locate implementation and its regression checks. Run commands from the source checkout; [workspace and packaging layout](../PROJECT-LAYOUT.md) explains delivery paths.

| Task | Implementation | Focused check |
| --- | --- | --- |
| MIDI mapping and held-note release | [whitekeys-midi.js](../whitekeys-midi.js) | `node test-midi.cjs` |
| Scale editing, source selection and saved state | [whitekeys-state.js](../whitekeys-state.js) | `node test-state.cjs`, `python3 test-persistence.py` |
| Native Host discovery, transport and automatic identity | [whitekeys-sharing.js](../whitekeys-sharing.js) | `node test-sharing-adapter.cjs`, `node test-auto-identity.cjs`, `node test-sharing-performance.cjs` |
| Live scale observation | [whitekeys-api.js](../whitekeys-api.js) | `node test-midi.cjs` (LiveAPI boundary simulation); native behavior needs Live acceptance |
| Keyboard drawing and input | [whitekeys-keyboard.js](../whitekeys-keyboard.js) | `node test-midi.cjs` (click/message and graphics simulation); native rendering needs Live acceptance |
| Model-to-MIDI sharing | [whitekeys-state.js](../whitekeys-state.js) | `node test-sharing.cjs` |
| Device wiring and AMXD container | [editable patch](../WhiteKeys%20Live%2012.maxpat), [builder](../build-amxd.py), [packager](../package-development.py) | `python3 package-development.py --check`, `python3 test-packaging.py` |
| Navigation and domain documents | [navigation check](../check-navigation.py) | `python3 check-navigation.py`, `python3 test-navigation.py` |

[sharing-test-fixture.cjs](../sharing-test-fixture.cjs) is the shared adapter/model/MIDI test harness. Keep the five production JS files adjacent to the AMXD and tests beside source for relative fixtures.

## Current contracts

- [Installation and Live checks](../KURULUM-VE-TEST.md).
- [Production sharing](production-sharing.md) and [automatic identity contract](specs/automatic-identity-resolution.md). The latter supersedes manual identity-selection requirements in older sharing specifications and reviews.
- [Domain authority and document layout](agents/domain.md). ADR 0008 supersedes the manual identity clauses of ADR 0006 and ADR 0007.

## Historical reports and experiments

Completed review and diagnosis reports are preserved at [commit 47c9da3](https://github.com/Cemvegas/whitekeys-live12/tree/47c9da34369166b919339b7c5516e2e8a0d0bb8d/docs), with a verified local snapshot in `archive/retired-reports-2026-10-12.zip`. Their old issue and acceptance statuses are historical; use the current contracts above and the acceptance form for current behavior and results.

Retired prototypes and diagnostic probes are preserved in Git history at [commit 5c0d581](https://github.com/Cemvegas/whitekeys-live12/tree/5c0d581cbd4335223278e2e1cefe6a6229e6b904/docs/diagnostic-probes), with a verified local snapshot in `archive/retired-experiments-2026-10-12.zip`. They are historical evidence, not production dependencies or regression checks. A fresh clone can retrieve them from that commit without a local archive. New experiments follow the project layout's `work/<issue>/` convention; preserve unresolved and uncommitted work.

Run [check.py](../check.py) before completion. CI runs the same command. Packaging and simulated adapter tests do not establish native Live acceptance.
