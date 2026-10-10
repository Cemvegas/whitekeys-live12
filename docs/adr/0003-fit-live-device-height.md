# Fit the interface within Live's fixed device height

Native Live inspection reproduced clipped Mapping Mode and Apply controls: the prior360×205 design placed their bottom at197/198, while Live's device body is fixed at169 pixels. Increasing the Max edit-window height cannot increase the embedded Live device height, as confirmed by Cycling '74's user-interface documentation (https://docs.cycling74.com/userguide/m4l/live_userinterfaces/).

Keep the360-pixel width and332×62 Scale Keyboard. Move the title, keyboard and control rows upward and compact the ordinary menus/buttons to18 pixels. Playing remains a separate line, Mode and Apply share the next row, and the effective mode/fallback reason occupies the final line, ending at168. This supersedes the205-pixel height assumption in the original spec without changing mapping, Draft/Apply or persistence behavior. Package integrity must validate the native169-pixel envelope, rather than the standalone Max open-window height alone. Native Live visual verification and automated MIDI/state regressions both passed; full host acceptance remains user-owned issue#15.

2026-10-10: Mod seçimiyle ilgili hükümler ADR [0004](0004-continuous-degrees-only.md) tarafından tasarım düzeyinde güncellenmiştir. Diğer hükümler korunur; kod geçişi sonraki uygulama adımındadır.
