# WhiteKeys Live 12 — geliştirme paketi, kurulum ve kabul testi

**DEVELOPMENT / geliştirme paketi.** #2 spec ve #3–#7 uygulaması; gerçek Live kabulü #8 altında kullanıcıya aittir ve henüz tamamlanmamıştır. Otomatik kontroller gerçek fare, ses, native mimari veya Set saklama kabulü değildir. #1 tarihsel kabul kaydı korunur. Agent Live/Max arayüzü veya Computer Use ile test yapmaz.

## Kurulum ve kayıt düzeni

1. ZIP'i yeni, kalıcı bir klasöre aç. `WhiteKeysLive12` içindeki `.amxd` ve dört `whitekeys-*.js` yan yana kalsın. Düzenlenebilir `.maxpat`, testler, derleme/paketleme scriptleri ve prototip kaynakları da pakettedir. Dondurulmamış cihazı tek dosya olarak taşımayın.
2. Live 12 Suite veya Max for Live lisanslı Live 12 Standard ile **ayrı bir test Set'i** oluşturun. Mevcut müzik projenizin üzerine kaydetmeyin. Apple Silicon'da Live/Max'in native çalışmasını kullanıcı AC27'de doğrular; üçüncü taraf external veya Node çalıştırma bağımlılığı yoktur. Node/Python sadece geliştirici kontrolleri içindir.
3. Cihazı MIDI kanalında zincirin başına, enstrümandan önce koyun. Test için önceki Pitch/Scale etkilerini kaldırın. Monitor In veya arm ile girişi etkinleştirin. Audition duyabilmek için cihaz sonrasında enstrüman olmalı.
4. Giriş ve **Post FX çıkış** MIDI baytlarını kaydedin. Live'da ikinci MIDI kanalı: MIDI From = cihaz kanalı / Post FX, Monitor Off, arm açık. Kaydedilen klip notaları mapping kanıtıdır; release velocity, CC, realtime ve SysEx için ham MIDI monitor/log gerekir. Giriş kanalındaki klip efekt öncesini kaydedebilir.
5. `MANIFEST.json` içindeki `package_version`, tam `source_commit`, dosya SHA256'larını sonuç formuna ekleyin. Formdaki gerçek/kanıt/sonuç alanları ilk teslimde boştur; test sırasında doldurun. Ekran görüntüsü tek başına MIDI davranışını kanıtlamaz.

## Sabit referanslar

Nota numarası esas alınır; farklı host'ların C3/C4 adları farklı olabilir. Fiziksel beyaz tuşlar MIDI `60,62,64,65,67,69,71,72` (C D E F G A B C). C Major çıkışı aynı dizidir; C Minor `60,62,63,65,67,68,70,72`; D Dorian `62,64,65,67,69,71,72,74`. Oktav değişimi ±12'dir. Her fiziksel C, kendi MIDI oktavındaki Root'a gider.

Ham bayt gösterimi **ondalık**: kanal 1 note-on `[144,pitch,velocity]`, note-off `[128,pitch,releaseVelocity]`; kanal 2 durumları 145/129, kanal 16 durumları 159/143. Note-on velocity 0 bir bırakmadır ve aynı biçim korunur. Aşağıdaki testlerde gerekmedikçe on=96, off=37 kullanın. Siyah tuş davranışı fiziksel MIDI girişi içindir; ekranın siyah tuşları düzenleme ve Option audition yapar. Üyelik taslaktır; çıkış vurgusu dönüştürülmüş MIDI pitch class durumudur, synth sustain ses ömrü değildir.

Custom tam yedi farklı nota olduğunda yeni note-on'lara geçer. 6/8 taslakta son geçerli gam/kök çalar; ekran taslak kökü ile çalan kökü ayrı belirtir. Basılı notalar yeni gama akort edilmez. Root üyelikten çıkarılamaz. Yerel Root/Scale Live/klip özelliklerine yazmaz. Follow Live yedi dışında gamda yeni beyaz notaları susturur; Custom geçersiz taslakta son geçerli gamı korur.

## AC01–AC27 kullanıcı adımları

Her satır için sürüm, ekran/ham MIDI ve gerektiğinde kaydedilen Set kanıtını `HOST-SONUC-FORMU.md` içinde kaydedin. Testler arasında tuşları bırakıp Panic kullanın; yeni başlangıç için belirtilen gam/modu seçin.

| ID | Adımlar | Beklenen / kanıt |
|---|---|---|
| AC01 | Yeni Set'e cihazı yükleyin; cihaz panelini ve tüm menüleri açın. | 360×169 B paneli kesilmez; İngilizce metin, Follow Live ve küçük Panic okunur. Büyük başlık/Refresh/sabit açıklama yok. Panel ekranı. |
| AC02 | Follow Live kapalıyken Root C, Scale Minor seçin; sonra Major ve Dorian seçin. | Minor üyeleri C D Eb F G Ab Bb; Root C ayrı işaretli. Major C D E F G A B; C Dorian C D Eb F G A Bb. |
| AC03 | C Major seçin; normal E tıkla, fiziksel 64 çal; ardından Eb tıkla ve 64 tekrar çal. | 6/7 taslakta C Major çalar: `[144,64,96]`; 7/7 Custom'da `[144,63,96]`. Ekran taslak üyeliğini gösterir; bırakma aynı hedef/37. |
| AC04 | C Major seçin; önce Eb ekleyin, 64 çalın; E çıkarın, 64 tekrar çalın. | 8/7 aşamada C Major/64; 7/7 Custom'da 63. Her aşamada taslak görünür. |
| AC05 | Geçerli ve 6 notalı Custom'da Root tuşuna normal tıklayın. | Root çıkarılmaz; üyelik, mod ve çalan gam korunur; normal tıklamada MIDI yok. |
| AC06 | AC03'teki geçerli C Custom'da Root D seçin; fiziksel 60/64 çalın. | Üyeler D E F G A B C#, bütün aralıklar +2; 60→62, 64→65; Follow kapalı. |
| AC07 | C Major'dan E'yi çıkararak altı nota bırakın, Root D seçin; 60/64 çalın. Sonra ekranda F ekleyin. | Altı üyeli D taslak D E G A B C#; çalan hâlâ C Major: 60→60,64→64. F eklenince D Custom: 60→62,64→65. |
| AC08 | Custom'da Live/klip root ve scale'i değiştirin; cihazda Root/Scale değiştirin; sonra Follow Live açın. | Custom Live değişiminden etkilenmez; yerel seçiciler Live ve seçili klibi değiştirmez. Follow açılınca güncel Current Scale gelir. Önce/sonra Live alanları ekranı. |
| AC09 | Current Scale'i değiştiren farklı gamlı klipleri seçin; Follow açık ve Custom kapalı takip durumunu, ardından Custom'ı deneyin. | Follow yeni Current Scale'e geçer; Custom üyelik/kök/çalan gam değişmez. Klip ve cihaz ekranları. |
| AC10 | C Major'da normal beyaz E ve siyah Eb tıklayın; ayrı başlangıçtan Option-click E, Eb ve Root C yapın. | Normal tıkta MIDI **yok**; üyelik düzenlenir. Option beyaz `[144,64,96]`, siyah `[144,63,96]`, Root `[144,60,96]`, yaklaşık 240ms sonra aynı pitch off/0; üyelik, Root ve mod değişmez. |
| AC11 | C Minor ve D Dorian'da referans sekiz beyaz girişin on/off'unu gönderin; ±12 oktavda tekrarlayın. | Yukarıdaki çıkış dizileri; on velocity 96/off37 değişmez. Her C kendi oktavındaki Root'a gider. Ham giriş/çıkış. |
| AC12 | Minor'da `[144,64,1]`, off `[128,64,23]`; ardından velocity127/off99; sonra yeni `[144,64,96]` basıp `[144,64,0]` ile bırakma deneyin. | Çıkış pitch63; on1/off23 ve on127/off99 aynen. Velocity0 bırakma `[144,63,0]`; aktif ses kapanır, yeni ses oluşturmaz. |
| AC13 | Minor'da `[144,64,96]` tutun, D Dorian seçin, `[128,64,37]`; tekrar 64 çalın. Ayrıca passthrough'da61 tutup ignore'a geçip bırakın. | Eski hedef63 off37 kapanır; yeni64→65. Eski siyah61 bırakılır; ignore'da yeni61 üretilmez. |
| AC14 | Minor/passthrough'da64 ve63 birlikte çalın; her iki bırakma sırasını deneyin. Aynı64 retrigger yapıp iki bırakma gönderin; kanal1/2/16'da tekrarlayın. | Her on63 velocity korunur; aynı kanal hedef63 ilk bırakmada kapanmaz, son bırakmada kapanır. Kanallar ayrı; diğer kanalın63 sesi kapanmaz. MIDI log, synth retrigger karakteri ayrı. |
| AC15 | Fiziksel61'i passthrough ve ignore'da on/off çalın; ignore açıkken ekran Eb normal/Option tıklarını deneyin. | passthrough61 aynen; ignore yeni61 on/off yok. Ekran düzenleme ve audition yine çalışır. |
| AC16 | Minor'da fiziksel64 tutarken Option Eb (63) yapın; audition süresi bitince fiziksel bırakın. Ters sırada fiziksel önce bırakın; sonra Option Eb → hemen Panic → hemen fiziksel64 gönderin, 300ms bekleyin. | Aynı kanal63 ilk biten kaynak yüzünden kapanmaz; son kaynak kapanır. Panic öncesi eski audition görevi yeni63'ü kapatmaz; yeni fiziksel bırakma kapatır. |
| AC17 | Kanal1 ve2'de aynı pitch class'ı, farklı oktavda da çalın; birini bırakın, tümünü bırakın; tekrar çalıp Panic yapın. | Çıkış pitch class vurgusu tüm sahipler bitene kadar kalır; son bırakma ve Panic temizler. Ekran + MIDI. |
| AC18 | Minor/aktif64 iken `[160,64,45]`; `[176,64,127]`, `[224,0,64]`, `[208,42]`, `[192,5]`, `[241,1]`, `[242,1,2]`,248 ve `[240,1,2,247]` gönderin. | Poly aftertouch `[160,63,45]`; diğer örnekler baytları aynen geçirir. Sustain bırakma `[176,64,0]` korunur. Running status tam status ile normalize olabilir. |
| AC19 | Birden çok kanalda basılı nota/audition ve sustain varken Panic; sonra yeni nota çalın. | Aktif çıkışlar kapanır; her kanal1–16 için CC64=0 ve CC123=0, durum baytları176–191. Vurgular temiz; eski audition yeni sesi kapatmaz; yeni nota çalınır. |
| AC20 | B Major'da fiziksel0 ve127 çalın; fiziksel120 çalın. C Major'da0 ve127 deneyin. | B Major0→11;127→138 sınır dışı olduğundan on/off yok;120→131 yok. C Major0→0,127→127. Clamp veya hayalet off yok. |
| AC21 | Follow/C Minor'da64 tutun; Current Scale pentatonik sonra Whole Tone; beyaz64 ve passthrough siyah61 çalın; eski64 bırakın. Dorian'a dönün. | 5/6 nota uyarısı; yeni beyaz on yok, siyah61 geçer; eski63 off kapanır. Yedi notaya dönüşte mapping geri gelir. |
| AC22 | Yeni cihaz yükleyerek API başlangıcını; mümkünse güvenli bağlantı kesilip geri gelmesini gözleyin. Scale Mode kapatın. | Hazır değil/bağlantı durumu İngilizce; Follow Live sırasında yeni beyaz notalar susar, önceden basılan notaların bırakmaları ve Black Keys seçimi çalışır. API hazır olunca güncel Current Scale takibi geri gelir. Mode off bilgisi görünür, son Current Scale eşlemesi sürer. Yeniden bağlanma üretilemiyorsa sonucu boş bırakın. |
| AC23 | Aşağıdaki geçerli Custom satırını kaydet/kapat/aç uygulayın. | Taslak/kök/ad, aktif gam/kök/ad, Custom ve ignore bağımsız korunur; MIDI matrise uyar. |
| AC24 | Aşağıdaki6 ve8 taslak satırlarını **ayrı Set dosyalarıyla** kaydet/kapat/aç; yediye tamamlayın. | Taslak ve çalan son geçerli gam farklı kökleriyle geri gelir; tamamlama yeni kökü etkinleştirir. |
| AC25 | Follow satırını uygula; API başlangıcında geç hazır durumunu gözle; güncel Current Scale kayıtlıdan farklı olsun. | Güncel D Dorian API hazır olunca kullanılır; sonradan gelen restore eski C Major'ı dayatmaz. |
| AC26 | İki cihaz satırını uygula; aktif fiziksel nota ve bekleyen audition varken saklama senaryosunu ayrı test Set'inde dene. | Durumlar karışmaz; yeniden açılışta basılı nota/audition yeniden başlamaz. MIDI log ilk açılış ve yeni notaları içerir. |
| AC27 | ZIP'i önceki kaynak dışında yeni konuma aç; buradan .amxd yükle; Live ve kullanılan Max native mimarisini Activity Monitor/System bilgisiyle kaydet;64 çal. | Dört JS bulunur; Max hata konsolunda eksik dosya yok; üçüncü taraf external/Node/Rosetta gerekmez. Native Apple Silicon Live/Max, panel ve MIDI/ses kanıtı kullanıcıya ait. |

## Set saklama matrisi

Her satır: belirtilen durumu kur → üyelik/kök/mod/Black Keys ekranını ve MIDI örneğini al → farklı adlı test Set kaydet → Set'i ve Live'ı kapat → dosyayı yeniden aç → API hazır olmasını bekle → ekran ve ham MIDI karşılaştır. Kaydetme/açma tarihini ve dosyayı forma yaz. Sadece cihazı yeniden eklemek veya VM restore Set round-trip değildir.

| AC / Set | Kaydedilecek durum | Açılışta beklenen ve tamamlama |
|---|---|---|
| AC23 `valid-custom.als` | C Dorian seç, Scale Custom, Root D; üyeler D E F G A B C; aktif D Custom (Dorian aralıkları); Follow off, ignore. | Aynı taslak/aktif kök2, ad Custom (Dorian aralıkları), Custom+ignore;60→62,64→65; siyah61 sessiz. |
| AC24 `six-draft.als` | D Dorian/Custom; F çıkar (6), Root E. Taslak E F# A B C# D; aktif D Custom (Dorian aralıkları) kökD. | Taslak kökE/6; çalan kökD/7.60→62,64→65. G ekle: E Custom7,60→64,64→67. |
| AC24 `eight-draft.als` | C Major/Custom; C# ekle (8), Root G. Taslak G Ab A B C D E F#; aktif C Custom (Major aralıkları) kökC. | Taslak kökG/8; çalan kökC/7.60→60,64→64. Ab çıkar: G Custom7,60→67,64→71. |
| AC25 `follow-fresh.als` | Follow on, kayıtlı C Major; Set Current Scale D Dorian olacak şekilde kaydet (API bildirimi öncesinde cihaz C Major saklama anını belgeleyin). | İlk kayıtlı görüntü kalabilir; API hazır olunca D Dorian,60→62,64→65; geç restore C Major'a geri dönmez. Host'ta farklı başlangıç/restore gecikmesi oluşturulamıyorsa bu alt test boş kalır; VM kanıtıyla geçmiş saymayın. |
| AC26 `two-devices.als` | Ayrı MIDI kanallarında A: D Custom/Dorian+ignore; B: C Custom/Major+passthrough. Saklamadan önce bir cihazda fiziksel64, diğerinde Option Eb aktifken kayıt alın. | A60→62,64→65,61 yok; B60→60,64→64,61→61. Durumlar ayrı; eski aktif kayıt/audition tekrar note-on üretmez. |

## Geliştirici komutları ve kanıt sınırı

`node test-midi.cjs` ve `node test-state.cjs` mevcut mesaj giriş/çıkışı ve saklama sınırlarını sınar. Mevcut otomatik baseline: 4702 MIDI/API ve 98 durum/entegrasyon/restoration assertion geçmiştir; assertion sayısı host kapsamı değildir. Geliştirici araçları Python 3.9+ gerektirir (cihaz çalıştırmak için Python gerekmez). Kaynak kontrolünden sonra `python3 build-amxd.py` kaynak JSON'undan cihazı üretir; `python3 package-development.py --check` container boyu/JSON eşitliği, dört JS, dependency cache, patch routing ve gizli per-device blob şekli kontrol eder.

Kaynak commit temizken: `python3 package-development.py --output /absolute/chat/outputs/WhiteKeysLive12-development.zip`. Paket bütün tracked düzenlenebilir kaynakları ve testleri içerir; `.git` içermez. Manifest tam git commit ve her kaynak dosyanın byte/SHA256 değerini içerir. ZIP sırası, tarihleri ve izinleri sabittir; aynı kaynak commit aynı ZIP baytlarını üretir. Commit/package sürümü için manifest tek referanstır. ZIP CRC ve çıkarılan dosya baytları otomatik doğrulanır.

Tarihsel kanıt: önceki oturumda Live12.4.6 / Max9.1.5'te panel/menülerin görünmesi ve C/D Dorian API takip ekranı gözlenmiştir; başarılı üyelik fare değişimi, native arm64, gerçek MIDI/ses ve Set yeniden açma kanıtı değildir. Bu paket için **yeni host testi yapılmadı**. Kabul formunda geçmiş görüntüleri yeni koşum sonucu gibi kullanmayın. #8 kullanıcı testleri tamamlanana kadar DEVELOPMENT etiketi korunur.
