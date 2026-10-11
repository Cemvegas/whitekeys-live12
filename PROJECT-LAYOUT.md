# White Keys workspace

This document ships with the source repository and development ZIP. Run source commands from this repository. In the original White Keys workspace, this checkout is `WhiteKeysLive12/`; its parent contains the installation and archive. A standalone clone uses its own parent for those paths.

| Location | Purpose |
| --- | --- |
| `WhiteKeysLive12/` | Production device, adjacent JavaScript dependencies, regression tests, build and packaging commands |
| `GLOSSARY.md`, `docs/adr/` | Authoritative domain vocabulary and decisions |
| `WhiteKeysLive12/docs/` | Technical references, specifications and diagnostic evidence |
| `work/<issue>/` | Active experiments with an issue, purpose and completion condition |
| `current/` | Current development ZIP, installation and `MANIFEST.json` |
| `outputs/* Project/` | Live acceptance Sets; retained at their existing paths |
| `archive/` | Historical packages, extracted installations, experiments and reports |

Read `current/MANIFEST.json` for the current source commit, package checksum and installation path. The manifest records development/acceptance status; packaging does not establish Live acceptance.

## Commands

From `WhiteKeysLive12/`:

- `python3 check.py` runs the production JavaScript, MIDI, state, sharing, persistence and package checks. GitHub Actions runs the same command on pushes and pull requests.
- `python3 package-development.py --current` publishes one current installation after production source changes have been committed. The previous current directory moves to `archive/package-<commit>-<timestamp>/`.
- `--output /absolute/path/package.zip` remains available for an explicitly requested separate artifact.

The AMXD requires its five adjacent JavaScript files. Keep the installation directory intact. Source tests stay next to the source for the existing relative-path fixtures.

## Retention and session completion

Keep production sources, regression tests and current technical references in the source repository. Promote a useful diagnostic scenario into a production regression test when its dependency on the experiment has been removed.

Archive completed experiments together with their issue, result and reproduction instructions. Keep rejected candidates as historical evidence when they explain a decision. Keep original prototype evidence and Live acceptance Sets. An experiment with unresolved work remains active until its owner or issue establishes completion.

Use `work/<issue>/` for new experiments, rather than adding more executable probes to documentation. Existing source diagnostics contain uncommitted work and remain in place for review; they were not silently promoted into production tests or committed by this cleanup.

Use `current/` for ordinary development delivery. Create separately named packages only for an explicit comparison or delivery requirement. At session completion, classify experiments as active, regression tests or archive, run `check.py`, and refresh the current package when production files changed.

Clean generated temporary files and duplicate extracted packages only after verifying reproduction and Live/Max references. Ignore generated outputs and archives in the workspace Git repository. The source repository retains its own independent history.

## Migration record

The 2026-10-11 cleanup is recorded in `archive/session-2026-10-11-MIGRATION.json`. Historical output and work directories moved into that archive. Compatibility symlinks preserve referenced Live device paths and historical work references. These links can be retired after the referring Sets and documents have been migrated and verified.

Historical migration records exist only in the original workspace; they are optional evidence, not prerequisites for using a fresh clone. No source or historical evidence was deleted in this cleanup.

Archive entries sit directly under `archive/`; category and session wrapper directories have been removed. `current/` directly contains the ZIP, manifest, AMXD and five JS files. `outputs/` and `work/` retain only Live Sets and compatibility paths where needed.
