# WhiteKeys Live 12

Play scale degrees from the white keys of your MIDI keyboard. WhiteKeys is a Max for Live MIDI device for Ableton Live 12: choose a scale, edit its notes, or share it across tracks from one Host.

- Play scales with **1–12 notes**, including your own Custom Scales.
- Edit the Sounding Scale immediately, without an Apply step.
- Follow Live's Current Scale, or follow another WhiteKeys device in the same Live Set.
- Share one scale across tracks while keeping Black Keys settings local to each device.

## Download and install

**Development version.** There is no published GitHub Release package yet. The repository contains the device and its required scripts. This repository is currently private: you must be signed in to GitHub with repository access to download it.

1. [Download the current source ZIP](https://github.com/Cemvegas/whitekeys-live12/archive/refs/heads/main.zip), or use GitHub's **Code → Download ZIP** button.
2. Extract the ZIP into a permanent folder. Keep `WhiteKeys Live 12.amxd` and all five `whitekeys-*.js` files together in the extracted repository folder. Do not move only the AMXD file.
3. Open Ableton Live 12 with Max for Live available. Start with a new Set or a copy of an existing Set.
4. Drag `WhiteKeys Live 12.amxd` onto a MIDI track **before an instrument**. Arm the track, or set monitoring to **In**, and select your MIDI input.

The device needs these adjacent scripts:

```text
WhiteKeys Live 12.amxd
whitekeys-api.js
whitekeys-keyboard.js
whitekeys-midi.js
whitekeys-sharing.js
whitekeys-state.js
```

You do not need Node.js or Python to play the device. They are used only for development checks.

## Quick start: play and edit a scale

1. Set **Scale Source** to **Local**.
2. Choose **Root: D** and **Scale: Major**.
3. Play the white keys starting at MIDI note 60 (middle C). C, D, E, F, G, A, B and the next C produce D, E, F♯, G, A, B, C♯ and the next D.
4. Click a note on the on-screen **Scale Keyboard** to add or remove it. The next played note uses the new scale immediately. The Root always stays included.

White keys step through all the scale's degrees in order (**Continuous Degrees**). After the last degree, the next white key starts the next octave. A five-note scale repeats after five white keys; an eight-note scale repeats after eight.

Changing Root transposes the local scale. WhiteKeys recognizes named scales at the selected Root; otherwise it displays **Custom**. **Also matches** entries in the Scale menu offer other Root interpretations while keeping the same absolute notes.

## Choose a Scale Source

| Source | What it does |
| --- | --- |
| **Local** | Choose and edit your own Sounding Scale. Changes take effect immediately. |
| **Follow Live** | Use Live's Current Scale automatically. Local scale editing is disabled. This follows Live's displayed scale selection, which can reflect a selected clip; it does not impose a scale on every clip. |
| **Follow WhiteKeys** | Use the active WhiteKeys Host in this Set. No separate Host selection is needed. Local scale editing is disabled. |

Returning to **Local** keeps the last received Sounding Scale so you can edit it. WhiteKeys does not write scale changes back to Live or your clips.

## Share a scale: Host and Follower

For example, use one scale for both a piano and a bass track:

1. Add WhiteKeys before the instrument on each track.
2. On the piano track, choose **Local / D Major** and click **Host**. The active Host button is yellow.
3. On the bass track, select **Follow WhiteKeys**. This device becomes a Follower and automatically uses the Host's scale.
4. Change the Host's Root or notes. New notes on the Follower use the updated scale.

There is **one active Host per Set**. Turning on Host on another device transfers the role and reconnects Followers. The previous Host keeps its scale and Scale Source. A device using **Follow Live** can also be the Host.

If the Host is off or removed, the Follower shows **Waiting for Host** and keeps its last Sounding Scale. Following resumes when a valid Host becomes available. Turning on Host on a Follower switches it to **Local**, keeping its last scale.

### Duplicate, save and reopen

When you duplicate an active Host during a running Set, the existing Host stays the Host and the copy receives a separate identity with Host off. Follower copies retain their source reference. Identity resolution is automatic; there is no manual device chooser.

Save your Set normally to retain device identities, scale settings and source references. On reopening, a Follower can play its saved scale while the Host becomes ready, then resume following. If different devices restore competing Host settings, **Host conflict** appears: click Host on the device you want to use.

Sharing is confined to the same Live Set. Matching device or track names in another Set do not establish a connection.

## Other controls

- **Black Keys — Pass:** physical black-key notes pass through unchanged.
- **Black Keys — Ignore:** physical black-key notes are ignored. This does not prevent the device from producing black-key pitches from white-key input.
- **Option-click:** briefly audition a note on the Scale Keyboard without changing scale membership.
- **Panic:** clear this device's active notes and sustain state.

Black Keys Behavior, Audition and Panic are local to each device. Held notes keep their original output pitch when a scale or source changes and release at that pitch. New mapped notes outside MIDI's 0–127 range are suppressed.

## Troubleshooting and feedback

- **No sound:** check the MIDI input, arm/monitor setting, instrument, and that WhiteKeys is before the instrument. Keep the AMXD and its five scripts together.
- **Waiting for Host:** enable Host on a WhiteKeys device in the same Set.
- **Host conflict:** click Host on the device that should share the scale.
- **Live unavailable:** Live's scale information is not ready; the last valid scale is retained.

[Report a problem in GitHub Issues](https://github.com/Cemvegas/whitekeys-live12/issues). Include your OS, Live/Max versions, the source commit or download date, steps to reproduce, and expected versus observed behavior. For sharing problems, include the Host/Follower arrangement and whether duplication or reopening is involved.

## Validation and development

User-reported Live checks cover Host/Follow, role transfer, duplication, normal Set save/reopen and the agreed MIDI/UI scenarios. The recorded environment was macOS with Live 12.4.6 and bundled Max 9.1.5; those versions were not separately confirmed by the tester. This is not a compatibility guarantee for other systems. See the [acceptance record and excluded checks](HOST-SONUC-FORMU.md) for the exact scope.

For contributors, [source navigation](docs/navigation.md) maps tasks to files and regression checks. Run `python3 check.py` from the repository to check production scripts, MIDI/state behavior, documentation paths and device packaging. Automated tests do not replace native Live save/reopen acceptance. [Project layout](PROJECT-LAYOUT.md) explains the source and delivery folders.
