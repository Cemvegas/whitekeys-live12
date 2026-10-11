# Production Host discovery diagnosis — 2026-10-11

Live 12.4.6 production-device console showed a valid record and native anchor (`nativeReady: true`, `foreign: false`, anchor/master `3`) but empty native enrollment topology and shared entries.

The same temporary one-shot probe captured this device parameter list:

```json
{"parameters":["id",961,"id",962],"names":[[961,["Device On"]],[962,["WK enrollment"]]]}
```

The transport compared LiveAPI `get("name")` against the long parameter name `WhiteKeys sharing enrollment`. Live exposes the configured short name `WK enrollment`. The test boundary had hardcoded the long name, hiding the mismatch.

## Fix and automated evidence

The enrollment check accepts the actual short name and preserves compatibility with the long name. The test boundary now derives the native name from the patcher's short-name attribute; a dedicated one-Host/one-Follower directory assertion failed before the fix and passed afterward.

Passed: `node test-sharing-adapter.cjs`, `node test-sharing.cjs`, `node test-sharing-performance.cjs`, and `git diff --check`. No new architecture. Temporary discovery instrumentation removed from the repository and the previously opened extracted JS copy.

## Live verification pending

The existing unsaved Set was preserved under `../outputs/Host Discovery Native Fix 2026-10-11 Project/Host Discovery Native Fix 2026-10-11.als`, then reopened with the corrected external JS. The existing copies now display the ADR 0006 identity-conflict selector. This is discovery progress, not successful Host/Follower acceptance. The user must select which existing device keeps the copied identity before a blocked Host may be advertised.

Still required: one eligible Host visible in one Follower's Source list, then a scale update across those two devices. Do not run duplicate acceptance or mark Live acceptance complete based on the automatic tests or conflict-selector appearance.
