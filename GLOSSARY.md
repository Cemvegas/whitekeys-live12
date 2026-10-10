# WhiteKeys Live 12

A MIDI device for playing scale degrees from the white keys of a keyboard and editing the set of notes in a scale.

## Language

**Current Scale**:
The root and named scale currently shown by Live's scale selectors. This selection can reflect a selected clip; it is not a scale imposed on every clip in a Live Set.
_Avoid_: Global Scale, Set-wide Scale

**Custom Scale**:
A scale whose included notes the player chooses by adding or removing notes, rather than relying solely on a named scale's membership.
_Avoid_: Custom Root, Transposed Scale

**Playable Custom Scale**:
A custom scale containing one to twelve distinct notes, including its Root. Every supported scale uses Continuous Degrees.
_Avoid_: Unapplied Draft

**Root**:
The first degree of a scale, which remains included during custom note editing. Changing the local Root immediately transposes the locally edited Sounding Scale.
_Avoid_: Lowest Played Note

**Follow Live**:
Cihazın Live’ın Current Scale bilgisini otomatik aldığı Scale Source seçimi. Yerel gam düzenlemesi kapalıdır; düzenlemek için Local seçilir.
_Avoid_: Global Sync

**Audition**:
A temporary sounding of a note to hear it without changing scale membership. On the Scale Keyboard, it is requested with Option-click.
_Avoid_: Edit Note

**Scale Keyboard**:
A one-octave piano view showing a scale's included notes and root, with temporary highlights for played output notes. Its note keys can be used to edit scale membership.
_Avoid_: Root Selector

**Black Keys Behavior**:
The choice to pass physical black-key notes through unchanged or ignore them.
_Avoid_: Black Keys Scale


**Continuous Degrees**:
Beyaz tuşların, Root’tan başlayarak gamın bütün derecelerini sırayla çaldığı tek eşleme davranışı. Son dereceden sonra bir sonraki ses oktavının ilk derecesine geçilir.
_Avoid_: Mapping Mode, Octave Anchored

**Sounding Scale**:
The root and scale membership currently used for new played notes, from the selected Scale Source.
_Avoid_: Draft Scale, Last Seven-Note Scale

**Scale Source**:
Cihazın çalan gamını aldığı kaynak: Local, Follow Live veya Follow WhiteKeys.
_Avoid_: Mapping Mode

**Local**:
Oyuncunun gamı doğrudan düzenlediği kaynak seçimi; düzenlemeler anında çalan gama yansır.
_Avoid_: Draft Scale

**Host**:
Gam paylaşımı açık olan ve çalan gamını diğer WhiteKeys cihazlarına sunan cihaz.
_Avoid_: Live Host

**Follower**:
Kaynak olarak seçtiği Host WhiteKeys cihazının çalan gamını kullanan cihaz.
_Avoid_: Follow Live

**Scale Recognition**:
Seçili Root ve nota üyeliğinin bilinen bir gamla tam eşleşmesine göre gam adının belirlenmesi.
_Avoid_: Root Detection
