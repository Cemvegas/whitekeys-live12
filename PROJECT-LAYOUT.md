# White Keys project

`White Keys/` is the single project and Git root. Production source, tests, build tools, [navigation](docs/navigation.md), [glossary](GLOSSARY.md) and `docs/adr/` live here. Commit and push from this directory.

| Location | Purpose |
| --- | --- |
| Root AMXD, maxpat and five `whitekeys-*.js` files | Production device and editable source |
| Root tests, `check.py`, build and package scripts | Regression checks and delivery tools |
| `GLOSSARY.md`, `docs/adr/` | Authoritative domain vocabulary and decisions |
| `docs/` | Technical references, specifications and diagnostic evidence |
| `work/<issue>/` | Active experiments with an issue, purpose and completion condition |
| `current/` | Current development ZIP, installation and `MANIFEST.json` |
| `outputs/* Project/` | Live acceptance Sets, retained at their existing paths |
| `archive/` | Historical packages, experiments and migration backups |

`current/`, `outputs/`, `archive/` and `work/` are ignored by Git. Source files live directly at this single project root. Read `current/MANIFEST.json` for the installed commit and checksum; packaging does not establish Live acceptance.

## Commands

From the project root:

- `python3 check.py` runs all production and navigation checks. CI runs the same command.
- `python3 package-development.py --current` publishes `current/` after source changes have been committed, archiving the previous installation under `archive/`.
- `--output /absolute/path/package.zip` creates a separate explicitly requested artifact. Inside the project, use `outputs/` or the current delivery directories.

Keep the AMXD and its five JavaScript files adjacent. Tests stay beside source for existing relative fixtures. The ZIP uses the product name `WhiteKeysLive12/` as its portable installation folder; this is not another Git repository.

## Retention and session completion

Keep production sources, regression tests and current technical references in the source repository. Promote a useful diagnostic scenario into a production regression test when its dependency on the experiment has been removed.

Archive completed experiments together with their issue, result and reproduction instructions. Keep rejected candidates as historical evidence when they explain a decision. Keep original prototype evidence and Live acceptance Sets. An experiment with unresolved work remains active until its owner or issue establishes completion.

Use `work/<issue>/` for new experiments, rather than adding more executable probes to documentation. Retired source diagnostics and UI prototypes were removed from the current source tree on 2026-10-12 after verifying a complete local archive. Their sources remain in Git history; see the navigation guide for the pinned commit and archive. Preserve any new unresolved or uncommitted work.

Use `current/` for ordinary development delivery. Create separately named packages only for an explicit comparison or delivery requirement. At session completion, classify experiments as active, regression tests or archive, run `check.py`, and refresh the current package when production files changed.

Clean generated temporary files and duplicate extracted packages only after verifying reproduction and Live/Max references. Ignore generated outputs and archives in the workspace Git repository. The project root retains the original source repository history and remote.

## Migration record

The earlier cleanup is recorded in `archive/session-2026-10-11-MIGRATION.json`; its compatibility links retain historical experiment and Live Set paths.

Root unification preserved the original source Git history, branch and remote. `archive/root-unification-2026-10-11.zip` contains the pre-migration source, Git metadata and colliding workspace files; `archive/starter-git-metadata-2026-10-11/` retains the former empty workspace metadata. The source files now live at the root. The former `WhiteKeysLive12` source path and its temporary compatibility link have been removed at the user’s request. Existing Live Sets referencing that path can load the device from `current/` instead. No Live Set was rewritten during migration.

Migration evidence and compatibility links are local conveniences, not requirements for a fresh clone. Current installation and archives remain at their existing workspace paths.
