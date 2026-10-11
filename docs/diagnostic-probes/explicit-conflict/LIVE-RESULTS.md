# Live observations — 2026-10-11

Status: partial evidence; acceptance NOT complete. Issue #19 stays open.

Agent operated Live with the user's Computer Use permission, in a separate test Set. Production devices and pre-existing diagnostic work were not edited.

Observed in Live:

- Fresh AMXD load created UID `wk-1791698972598-375590019`, runtime 2, Set scope `set-1`, Host preference 0, root 0, mask 2741. Native Master reference initially read 0, current reference 3.
- Saved `Explicit Conflict Agent Test.als` under workspace `outputs/explicit-conflict-probe-2026-10-11/Explicit Conflict Agent Test Project/` and reopened it. UID remained identical; restored Master and current Master both read 3.
- Quit and relaunched Live, then opened the saved Set. UID remained identical and both Master references read 3. This was a Live restart, not a verified joint Live/Max cold restart.
- Duplicated the device with Live's Duplicate command. Both devices retained the same UID; the second runtime was 5. Both displayed `Identity conflict — choose keeper`. No automatic winner was displayed.

Blocked observations:

- Host toggle, Root menu and keeper menu clicks did not produce a visible model change or open a menu. Live's device selection and Duplicate command worked. Cause is not established: do not attribute this conclusively to the model or Max.
- Max observations initially timed out. Activity Monitor's Max search showed no matching process. Reacquiring Max later opened Max Console successfully, and it was normally quit; no force-quit was performed. Controls still did not respond afterward.
- Connection text overlaps Root/Scale labels in the probe presentation.

Not verified: keeper choice, resulting distinct IDs, Host/Follower automatic reconnection, native MIDI/audio behavior during a collision, held-note behavior in Live, Rack/track duplication, cross-Set import, unresolved/resolved collision persistence, and startup transients. Automated tests do not substitute for these checks.

The saved Set contains the single-device baseline. The last visible Live session contains the unsaved duplicate. UI testing was stopped when the user noted that Computer Use was taking too long. The next useful work is to diagnose the probe's native control behavior before another UI acceptance session.

## Follow-up: single-device Host diagnosis

The disposable unsaved duplicate was removed through Live; no saved Set or source file was deleted. With one remaining device, repeated Computer Use clicks on the Host control left `Host preference 0` unchanged (ordinary, zero-duration and double clicks).

A direct one-device model-input check using the existing Node VM seam passed `host(1) -> tick() -> host(0)`, preserving Host ON across polling. This covers model input only, not native mouse dispatch.

The user then physically clicked the same Host control once and reported that the preference became 1. An immediate Live screenshot independently showed the lit toggle and `Host preference 1` for the same UID/runtime. No patch, JS, model or application restart intervened between the failing automation clicks and the successful physical click.

Conclusion: a broken Host control in the device was not reproduced with physical input. The observed failure is specific to the Computer Use interaction path in this session; its lower-level event-routing cause is not established. Do not change device logic to compensate or describe the Host control as broken. No new architecture, instrumentation or production code was added. The earlier Max-timeout correlation did not establish causation.

The remaining single-device session is unsaved, Host preference 1, with the sticky conflict from the earlier duplication still present. Host preference changing does not prove sharing acceptance or resolve that conflict. Issue #19 remains open under its existing acceptance requirements; this follow-up diagnoses only the alleged nonresponsive Host control.

## Guided physical Live checks

User-reported results, performed sequentially without Computer Use clicks:

- Selected the sole remaining keeper in the conflict menu: conflict text disappeared and Host ON appeared.
- Loaded a fresh AMXD on the second MIDI track (did not duplicate the first device).
- Selected the first MIDI track's device in the second device's Scale Source menu: Following appeared.
- Changed the first device's Root to D: second device automatically displayed D.
- Changed the first device's Scale to Dorian: second device's diagnostic Mask became 1709.

Verdict: basic Host/Follower Root and membership propagation passed by user report. This establishes control/state propagation, not audible/native MIDI output. Set reopen, collision resolution between multiple candidates, and other acceptance cases remain pending. #19 remains open; #20–#21 were not started.

Further user-reported checks:

- Saved the two-device Set and reopened it via Live Open. Without another source selection, the Follower retained Following, Root D and Mask 1709.
- Duplicated the Host using Live Duplicate. Both Host copies displayed Identity conflict.
- During that conflict, the Follower displayed Source unavailable and retained Root D / Mask 1709.
- Selected the first keeper candidate. Conflict text disappeared from both devices.
- The resulting device IDs differed, with Host preference 1 on only one and 0 on the other.
- The Follower returned to Following without a new source selection.

Verdict: normal reopen and the tested explicit Host-copy resolution passed by user report. This does not yet establish solution persistence after save/reopen, copy-as-keeper, native note output, other duplication types, or cold-start behavior.

- Changed the selected Host's Root to E: Follower automatically displayed E.
- Saved the resolved Set and reopened the same Set. User confirmed no conflict prompt, Following, Root E and Mask 1709.

Verdict: the tested keeper continued propagating Root, and the resolved state survived a normal Set save/reopen by user report. This was not a verified complete Live/Max shutdown. Copy-as-keeper and the remaining native acceptance cases are still pending. A GitHub issue refresh during this follow-up failed to connect; no tracker state was changed.

- User confirmed that after fully quitting Live (and Max if open) and reopening the resolved test Set, Following / Root E / Mask 1709 returned without source selection or Refresh. Complete shutdown is user-reported, not independently observed process inventory.
- Duplicated the current Host again: both candidates displayed Identity conflict.
- Changed the new rightmost copy's Root to G while conflicted: Follower retained E.
- Selected the candidate whose current ID matched the new copy's runtime: Follower automatically changed to G.

Verdict: resolved cold reopen and new-copy-as-keeper propagation passed by user report. This is state/display evidence; audible MIDI behavior and the other outstanding scenarios remain unverified.

- After choosing the new copy, user confirmed distinct IDs and Host preference 1 on the selected copy / 0 on the other candidate.
- Duplicated the current Host and saved without choosing a keeper. Normal reopen preserved Identity conflict on both candidates and Follower Root G.
- Full Live shutdown (Max also if open) and reopen likewise preserved both conflicts and Follower G, by user report.
- Changed the rightmost conflicted candidate to Root B: Follower retained G.
- Saved, fully quit Live and reopened with these differing candidate roots. User observed Follower staying G, with no visible B transition.

Verdict: unresolved persistence and last displayed Root preservation passed in these user-run openings. The last check is visual observation only: it cannot rule out a brief MIDI snapshot or establish actual native registration order. Both registration-order and held-note/output acceptance remain distinct gaps.

## Remaining grouped acceptance — user report

User reported all eleven grouped checks passed on 2026-10-11:

1. Sole-survivor keeper selection restored Following.
2. Follower duplication showed conflict; resolution produced distinct IDs, both Host OFF, preserved source, and both followed subsequent Root changes.
3. Three Host candidates conflicted; deleting one left the others awaiting choice; resolution produced distinct IDs and only the keeper remained Host.
4. Host track duplication conflicted and keeper selection restored the Follower connection.
5. Host Rack duplication conflicted; candidates were distinguishable; selected keeper was followed.
6. Track/device renaming preserved connection and Root propagation.
7. An independent Host/Follower pair continued propagating during another Host's collision.
8. A Follower pasted into a new Set did not silently bind to its new Host and retained its last scale; return to the saved original Set restored connection without an unnecessary conflict.
9. With instruments on separate Host/Follower tracks, the same physical C key produced D at Root D and E at Root E on both.
10. Releasing held notes after Root changes, collision creation and keeper choice left no stuck notes.
11. Repeated notes and device-local Panic passed in the user's grouped report. Different MIDI channels were conditional in the instruction; the blanket result does not separately establish whether that optional subcheck was exercised.

These are user-attested results, not independently captured traces. All requested grouped manual checks are now reported passed; do not ask the user to repeat them without a specific new failure. Real registration order, transient startup MIDI snapshots, exact Live/Max versions and separately confirmed multichannel execution were not captured. Those evidence limits must not be relabeled as passed. #19 has not been closed, and #20–#21 have not been started.
