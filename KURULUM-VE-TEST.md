# WhiteKeys Live 12 — kurulum ve test

C D E F G A B beyaz tuşlarını Live'ın seçili yedi notalı gamının 1–7. derecelerine eşler. Her C tuşu, kendi MIDI oktavındaki kök notaya gider. Örneğin MIDI 60 → D Dorian'da 62; üst C (72) → 74. Gam değişince basılı ses yeniden akort edilmez: tuş bırakıldığında önceki nota doğru kapatılır, yeni basılan tuş yeni gamı kullanır.

## Kurulum

1. ZIP'i aç. `WhiteKeysLive12` klasörünü kalıcı bir konuma koy. **.amxd ve dört .js dosyası aynı klasörde kalmalı.** Bu sürüm bağımlılıkları yanında bulunan, dondurulmamış bir cihazdır; yalnız .amxd dosyasını başka yere taşımak yeterli değildir.
2. Ableton Live 12 Suite veya Max for Live lisansı olan Live 12 Standard kullan. Apple Silicon'da Live'ın yerleşik Max'i yeterlidir; üçüncü taraf external, Node, Rosetta veya ek paket gerekmez.
3. `WhiteKeys Live 12.amxd` dosyasını MIDI kanalına, enstrümandan **önce** sürükle. Arka arkaya iki kopya ekleme. Öncesindeki Pitch/Scale cihazları giriş tuşlarını değiştirebilir; doğrudan eşleme için cihazı zincirin başına koy.
4. Kanalı arm et veya Monitor = In seç. Sonrasına bir synth/piyano ekle.
5. Live'ın üst çubuğundaki Current Scale Root ve Current Scale Name alanlarından örneğin C / Minor seç. Cihazda aynı kök/gam ve `7/7 notes` yazısını görmelisin.
6. Black Keys menüsü: `passthrough` = orijinal notayı geçir; `ignore` = siyah tuşların note-on/off'unu üretme. Mod değişiminden önce basılan notaların bırakılması eski eşlemeyi kapatır. Bu seçim cihazın özel gam durumu ile birlikte saklanır.
7. Takılı ses varsa PANIC'e bas; aktif eşlenmiş notaları kapatır, tüm MIDI kanallarına sustain off ve all notes off yollar. Follow Live, Live takibine geri döner.

Tek .amxd olarak dağıtmak istersen: Edit in Max → alt araç çubuğunda Freeze Device → Save. Max bu dört JavaScript bağımlılığını toplamalıdır. Bu teslimin dondurulmuş sürümü üretilmedi; ZIP içindeki klasör düzeniyle kullan.

## B arayüzü ve özel gam

360 × 169 boyutunda İngilizce panel: klavye önce, altında Root / Scale / Black Keys ve küçük Panic. Büyük başlık, Refresh ve sabit alt açıklama kaldırıldı. Durum satırı yalnız nota sayısını ve gerekli uyarıyı gösterir.

- Yeşil tuşlar gamın notalarıdır; kökte turuncu çizgi bulunur. Çıkan MIDI notaları geçici turuncu vurgu alır.
- Tuşa tıklamak notayı ekler/çıkarır, Custom moduna geçer. Kök çıkarılamaz.
- Option+tıklamak kısa bir MIDI audition notası yollar; gamı değiştirmez. Ses için sonrasında enstrüman bulunmalı.
- Custom gam tam 7 nota olduğunda çalınır. Düzenleme sırasında 6/8 nota varsa son geçerli 7 notalı gam çalmaya devam eder; durum satırı çalan gamı belirtir.
- Root, gamı transpoze eder. Geçersiz taslakta çalan eski kök, taslak yeniden 7 nota olana kadar korunur.
- Scale menüsü yaygın gamları içerir. Live'dan gelen diğer gam adları otomatik menüye eklenir.
- Root / Scale değişikliği cihazda yereldir. Live'ın veya klibin gamını değiştirmez.
- Follow Live açıkken Live'ın Current Scale değişiklikleri takip edilir. İlk düzenleme takibi kapatır; tekrar Follow Live açılınca güncel Live gamı alınır.
- Taslak, son geçerli gam/kök, takip modu ve Black Keys seçimi gizli blob pattr parametresi ile Set'e saklanacak şekilde bağlandı. Host'ta Set'i kapatıp açma testi henüz yapılmadı.

Live API'nin `scale_intervals` alanı salt okunurdur; özel aralık listesi Live'a yazılamaz. Bu yüzden Custom cihaz içinde tutulur. [Resmî Song API belgesi](https://docs.cycling74.com/apiref/lom/song/).

## Eşleme örnekleri

Aşağıdaki girişler aynı MIDI oktavında olmalıdır:

| Giriş | C Major | C Minor | D Dorian |
|---|---|---|---|
| C | C | C | D |
| D | D | D | E |
| E | E | Eb | F |
| F | F | F | G |
| G | G | G | A |
| A | A | Ab | B |
| B | B | Bb | C (sonraki oktav) |

Hesap: `floor(giriş / 12) * 12 + root_note + scale_intervals[beyaz_tuş_derecesi]`. Nota numaraları esas alınır; Live ve klavye üreticilerinin C3/C4 etiketleri farklı olabilir. MIDI 60 referans alınabilir.

## Gam sayısı ve sınırlar

Yedi tuşu bir oktavda yedi ayrı dereceye 1:1 eşlemek yalnız **yedi notalı gamlarda** mümkündür. Major, Minor, Dorian ve diğer yedi notalı gamlar API'nin aralık listesinden çalışır; cihaz gam isimleri için sabit bir katalog kullanmaz. Pentatonik, Whole Tone, sekiz notalı veya diğer uzunluklarda uyarı görünür ve yeni beyaz tuş note-on'ları susturulur. Siyah tuş menüsü bu durumda da geçerlidir. Önceden basılan notalar bırakılabilir.

MIDI sınırı 0–127'dir. Eşlenmiş nota 127'yi aşarsa nota ve eşleşen bırakma mesajı atılır; sınırda clamp edilerek başka notaya dönüştürülmez. Özel tuning dosyalarının mikrotonal anlamını yorumlamaz; standart 12 yarım sesli MIDI pitch eşlemesi yapar.

Scale Mode kapalı olduğunda da son seçili kök/gam eşlenir; cihaz bunu ekranda belirtir. `live_set` Current Scale izlenir. Seçili klip Live'ın Current Scale değerlerini değiştirirse cihaz da takip eder; bütün klipleri ayrı ayrı izlemez veya değiştirmez.

## Live API doğrulaması

Resmî [Song / Live Object Model](https://docs.cycling74.com/apiref/lom/song/) belgesinde:

- `live_set.root_note`: get / set / observe; C=0…B=11.
- `live_set.scale_intervals`: get / observe; ilk dereceye göre yarım ses aralıkları.
- `live_set.scale_name`: get / set / observe.
- `live_set.scale_mode`: get / set / observe.

Dört alan için ayrı `LiveAPI` gözlemcisi kurulur. Değişiklik bildirimi bir Task ile mevcut kök/aralık/ad/mod değerlerinin yeniden okunmasını sağlar. API cihaz yüklenmeden kullanılmaz: `live.thisdevice → deferlow → init`. MIDI yolu API okumaz. Resmî [Max 8 LiveAPI / başlangıç ve scheduler açıklaması](https://docs.cycling74.com/legacy/max8/vignettes/jsliveapi).

Gerçek host kontrolü: 10 Ekim 2026, macOS'ta kurulu Live 12.4.6 / yerleşik Max 9.1.5. Cihazın yüklenmesi ve C Major Pentatonic → C Dorian → D Dorian değişiminde durum ekranının otomatik güncellenmesi görüldü. Bu, gerçek API bağlantısı/gözlemci kontrolüdür; donanım klavyesiyle ses çıkış testi değildir.

## MIDI davranışı

- Note-on velocity ve son note-off release velocity korunur. Velocity=0 note-on, note-off olarak değerlendirilir ve aynı biçimde çıkar.
- 16 MIDI kanalı ayrı tutulur; running status giriş desteklenir, çıkışta tam durum baytı üretilir.
- Tekrarlanan aynı giriş notası FIFO kuyruğuyla eşleştirilir. Aynı kanal/pitch'e düşen birden fazla tuş varsa her note-on velocity ile geçirilir; son tuş bırakılana kadar note-off bekletilir. Synth'in aynı pitch retrigger/voice davranışı kendisine bağlıdır; MIDI 1.0 ayrı voice kimliği sağlamaz.
- Polyphonic aftertouch aktif eşlenmiş notalara gider. CC, sustain, pitch bend, channel pressure, program change, system common/realtime ve SysEx içerikleri korunur (running status normalleştirmesi hariç).
- CC120 / CC123 / CC124–127 kanal notası kayıtlarını sıfırlar. PANIC sustain'i de bırakır.
- JavaScript MIDI yolu Max'in düşük öncelikli yürütmesini kullanır. Performans altında gecikme/jitter ölçülmedi; yüksek yoğunluklu MIDI/MPE yükü sertifikası yoktur.
- Cihazı bypass etmeden, silmeden veya taşımadan önce tuşları bırak ve gerekirse PANIC kullan: bypass'ta MIDI efektinin iç eşlemesi devre dışı kalabilir.

## Live içinde kabul testi

1. C Minor: MIDI 60,62,64,65,67,69,71,72 girişlerini çal. Beklenen: 60,62,63,65,67,68,70,72.
2. D Dorian: aynı girişler → 62,64,65,67,69,71,72,74. Alt/üst oktavda değerler tam 12 değişmeli.
3. E tuşunu C Minor'da basılı tut. D Dorian'a geç, sonra E'yi bırak. Eski Eb kapanmalı; yeniden E'ye basınca F çalmalı.
4. Farklı note-on velocity'leri dene; hedef enstrüman veya MIDI monitor'da değerlerin değişmediğini kontrol et. Note-off release velocity için bunu gösteren bir MIDI monitor kullan.
5. Siyah C#'yi her iki modda dene. Passthrough'da C# duyulur, ignore'da yeni nota üretilmez. Tuş basılıyken modu değiştirip bıraktığında eski ses kapanmalı.
6. C Minor'da beyaz E ile siyah Eb'yi passthrough'da birlikte çal. İkisi de Eb'ye düşer; yalnız biri bırakıldığında diğeri kesilmemeli.
7. Akor, tekrar basılan aynı tuş, sustain pedalı ve PANIC dene. Gam değiştirirken basılı tuşlar kalıcı olarak takılmamalı.
8. Major Pentatonic seç: 5 nota uyarısı ve sessiz beyaz tuşlar. Dorian'a dön: beyaz tuşlar tekrar çalışır.
9. Scale Mode'u kapat: durum satırı bunu belirtmeli; eşleme sürmeli. Set'i kaydedip yeniden açarak siyah tuş seçimini ve API'nin yeniden bağlanmasını kontrol et.
10. Ayrı bir MIDI kanalı aç; MIDI From = cihaz kanalı / Post FX, Monitor = Off, arm açık. İlk kanalı Monitor In yapıp ikinci kanalda kaydet: dönüştürülmüş notaları kontrol et. İlk kanalın kendi klibi efekt öncesi notaları kaydedebilir.

Donanım testi, yeniden açma/preset saklama testi ve gerçek çıkış note-off ölçümü bu oturumda tamamlanmadı; yukarıdaki maddeler bunları doğrulamak içindir.

## B sürümü doğrulama durumu

10 Ekim 2026: gerçek Live içinde yeni panel, klavye ve Root / Scale / Black Keys menüleri görüntülendi. Özel gam durum mantığı için 34 otomatik kontrol ve MIDI/audition çakışmaları dahil 4.627 kontrol geçti. Bu kontroller Max mesajlarını taklit eder. Yeni panelin fare etkileşimleri, Option audition ses çıkışı ve Set yeniden açma davranışı host'ta tam doğrulanmadı; bu sürüm kabul testi bekleyen geliştirme sürümüdür.

Ek kabul testi: C Major'da E'yi çıkar → 6/7, eski Major çalar. Eb'yi ekle → 7/7 Custom, E girişi Eb çalar. Live kökünü değiştir → Custom değişmez. Follow Live aç → güncel Live gamı gelir. Custom'da Root değiştir → tüm gam transpoze olur. 6 notalı taslak ve ignore seçimini kaydet, Set'i yeniden aç → taslak ve son geçerli gam korunmalı.

## Kaynak ve otomatik test

- `WhiteKeys Live 12.maxpat`: düzenlenebilir kaynak patch.
- `whitekeys-midi.js`: ham MIDI ayrıştırma/eşleme ve aktif nota kayıtları.
- `whitekeys-api.js`: Live API gözlemcileri ve durum metni.
- `test-midi.cjs`: üretimdeki MIDI JavaScript'ini Node VM'de Max mesaj giriş/çıkışları taklit edilerek sınar. Live/Max host entegrasyon testi değildir.

Node varsa klasörde `node test-midi.cjs` çalıştır. 4.627 assertion geçti: 128 giriş notası × 12 kök × Major/Minor/Dorian; velocity, note-off, siyah mod geçişleri, nota çakışması, kanallar, MIDI mesajları, PANIC ve gam değişimi. Bu kontroller native host testinin yerine geçmez.

Cihaz yalnız standart Max nesneleri ve ES5 `js` kullanır; architecture alanı patch'in kaydedildiği Max sürümünün metadata'sıdır, derlenmiş Intel external içermez. Apple Silicon hedeflidir; kurulu host'un arm64 çalışması ayrıca ölçülmedi.

- `whitekeys-state.js`: özel gam ve kaydedilen durum. `test-state.cjs`: 34 durum kontrolü.
- `whitekeys-keyboard.js`: native klavye çizimi ve fare etkileşimleri.
