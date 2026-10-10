# WhiteKeys Live 12 — değişken gam geliştirme paketi

**DEVELOPMENT.** Spec #9 ve uygulama #10–#14; yeni gerçek Live kabulü [#15](https://github.com/Cemvegas/whitekeys-live12/issues/15) kullanıcıya aittir. Önceki #8 kullanıcı kabulü eski sürüme aittir ve bu özelliğin kanıtı değildir. İlk spec uygulamasında Computer Use kullanılmadı. Sonraki UI düzeltmesinde, kullanıcı izniyle Live’da Mode/Apply yerleşimi görsel doğrulandı; tam MIDI/ses/Set kabulü hâlâ #15’tedir.

## Kurulum ve kanıt

1. ZIP'i yeni, kalıcı bir klasöre açın. `.amxd` ve dört `whitekeys-*.js` dosyası yan yana kalsın. Dondurulmamış cihazı tek başına taşımayın. Düzenlenebilir `.maxpat`, testler ve derleme/paketleme scriptleri pakettedir.
2. Live 12 Suite veya Max for Live lisanslı Live 12 Standard ile ayrı test Set'i açın. Eski Set'leri kopyalayın; mevcut müzik projesinin üzerine test kaydetmeyin. Cihazı enstrümandan önce koyun, Monitor In veya arm açın. Audition için arkada enstrüman gerekir.
3. Giriş ve Post FX çıkışını kaydedin. İkinci MIDI kanalında MIDI From = cihaz kanalı / Post FX, Monitor Off ve arm açık kullanın. Release velocity, CC/system/SysEx için ham MIDI log da alın. Ekran tek başına MIDI kanıtı değildir.
4. `MANIFEST.json` içindeki tam commit, package_version ve dosya SHA256 değerleri ile ZIP SHA256 değerini boş sonuç formuna yazın. Eski kabul görüntülerini yeni koşum diye kullanmayın.
5. VS28'de yaklaşık360×169 İngilizce panelin kesilmediğini, 332×62 klavyenin küçülmediğini, Draft/Playing/Mode/Apply durumlarının okunabilir olduğunu gözleyin. ZIP'i önceki kaynak konumundan farklı konuma açıp oradaki cihazı yükleyin; Max konsolunda dört JS için eksik bağımlılık olmadığını belgeleyin. Apple Silicon'da hem Live hem kullanılan Max'in native arm64 çalışmasını Activity Monitor/System bilgisiyle kaydedin. Üçüncü taraf external, Node veya Python cihaz çalıştırma bağımlılığı değildir; Node/Python geliştirici kontrolleri içindir.

Live cihaz yüksekliği sabit169 px olduğundan panel360×169 içindedir; önceki205 px tasarımındaki alt satır kesilmesi düzeltildi. Kaynak: [Cycling ’74 UI belgesi](https://docs.cycling74.com/userguide/m4l/live_userinterfaces/).

## Kullanım

Yeni cihaz **Continuous Degrees** tercihi ve Follow Live açık başlar. Beyaz tuşlar seçili gamın 1–12 farklı notasını sırayla çalar; son dereceden sonra ses oktavı +12 ilerler. MIDI60 seçili Root'un referansıdır: Root D ise60→62. Aynı dizi referans altında da devam eder. Siyah fiziksel tuşlar bu derece dizisine katılmaz; Black Keys passthrough/ignore onları yönetir.

**Octave Anchored** yedi notalı gamda her fiziksel C'yi kendi oktavındaki Root'a eşler. Tercih korunur; çalan gam yedi dışında ise görünür **Continuous Degrees** fallback kullanılır, çalan gam yediye dönünce Anchored geri gelir. Etkili mod taslaktan değil çalan gamdan hesaplanır. İki tercih aynı gamda aynı MIDI pitch sonuçlarını verir: yedide eşlemeler aynıdır; diğer uzunluklarda Anchored zaten Continuous kullanır. Mod seçimi farklı bir ses dizisi vaat etmez.

Normal nota tıklaması yalnız Draft Scale üyeliğini değiştirir, ses çıkarmaz. Yerel Root, named Scale ve üyelik değişimi Follow Live'ı kapatır ve **Apply** bekler; yedi notaya ulaşmak otomatik uygulama değildir. Root çıkarılamaz; Custom seçimi taslağı korur. Root seçimi taslağı transpoze eder. Playing satırı yeni note-on'ların gamını gösterir; Apply tüm taslak Root/ad/üyeliğini birlikte etkinleştirir. Mode tercihi hemen çalan gama uygulanır, taslağı Apply etmez.

Follow Live güncel Live/klip Current Scale'ini otomatik alır, Apply gerekmez. Follow'u açmak uygulanmamış taslağı bırakır; tekrar kapatmak onu geri getirmez. Yerel düzenleme Live/klip değerlerine yazmaz. API hazır değilken Follow yeni beyaz note-on'ları susturur; eski bırakmalar ve Black Keys çalışır. Bağlantı geri gelince güncel gam izlenir. Live Scale Mode off bilgisi eşlemeyi kapatmaz.

Basılı notalar Apply/Live/mod değişiminde yeniden akort edilmez; eski note-on hedefi release ile kapanır. Option-click kısa audition yapar; taslak/Follow/tercihi değiştirmez ve fiziksel Black Keys ignore tarafından engellenmez. Panic basılı çıkışları, vurguları ve sustain'i temizler. MIDI0–127 dışındaki sonuçlar bastırılır; clamp veya hayalet off üretilmez.

## Literal MIDI referansları

Nota numarası esas alınır; host C3/C4 adları değişebilir. Aşağıdaki diziler Root C içindir ve her iki mode tercihinde aynıdır.

| Gam / aralıklar | Beyaz giriş | Çıkış |
|---|---|---|
| 1:0 |59,60,62,64|48,60,72,84|
| 5:0,2,4,7,9 |60,62,64,65,67,69;59|60,62,64,67,69,72;57|
| 7 Minor:0,2,3,5,7,8,10 |60,62,64,65,67,69,71,72|60,62,63,65,67,68,70,72|
| 8:0,2,3,5,6,7,9,10 |60,62,64,65,67,69,71,72,74;59|60,62,63,65,66,67,69,70,72;58|
| 12:0–11 |60,62,64,65,67,69,71,72,74,76,77,79,81|60,61,62,63,64,65,66,67,68,69,70,71,72|

Sekiz notalı Root D'de60→62 ve59→60. Gamları named menüde olmayan örnekler için Custom klavyeden kurup Apply edin. On=96/off=37 kullanın: kanal1 on `[144,pitch,96]`, off `[128,pitch,37]`; kanal2 145/129, kanal16 159/143. Velocity0 bırakmayı da deneyin; format ve velocity korunmalı.

## VS01–VS28 kullanıcı kabulü

Her satıra yeni paketle gözlenen ham MIDI/ekran/Set kanıtı ekleyin. API kesintisi/başlangıç sırası host'ta üretilemiyorsa sonucu uygulanmadı bırakın; otomatik VM kanıtını native geçmiş saymayın. Testler arasında notaları bırakın ve Panic kullanın. Kriterler spec #9 ile aynı numaraları taşır.

| ID | Kurulum / adım | Beklenen |
|---|---|---|
| VS01| Yeni cihaz, Follow API hazır | Continuous Degrees tercihi; mevcut gam otomatik alınır, API öncesi durum açık gösterilir. |
| VS02 | Yedi notalı C Minor, her iki tercih | Giriş 60,62,64,65,67,69,71,72 → 60,62,63,65,67,68,70,72; önceki eşleme korunur. |
| VS03 | Sekiz notalı C, aralıklar 0,2,3,5,6,7,9,10 | Giriş 60,62,64,65,67,69,71,72,74 → 60,62,63,65,66,67,69,70,72. Üst C sekizinci derece, üst D sonraki Root. |
| VS04 | VS03 referansın altı ve Root D | C Root'ta giriş59 →58; Root D'de giriş60 →62 ve59 →60. Gam referans altında doğru önceki döngüyü kullanır. |
| VS05 | C Major Pentatonic, beş nota | Giriş60,62,64,65,67,69 →60,62,64,67,69,72;59 →57. Yedi şartı yüzünden susturulmaz. |
| VS06 | Yalnız C Root, bir nota | Giriş59,60,62,64 →48,60,72,84; her beyaz tuş bir ses oktavı ilerler. |
| VS07 | C chromatic, on iki farklı nota | Giriş60,62,64,65,67,69,71,72,74,76,77,79,81 →60,61,62,63,64,65,66,67,68,69,70,71,72. |
| VS08 | 1–12 bütün desteklenen uzunluklar | Her derece sıralı erişilebilir; ilk derece Root, cycle geçişi +12; bağımsız literal örnekler alt/üst yönde doğrulanır. |
| VS09 | Octave Anchored tercihi; Live7→5/6/8/12→7 | Tercih korunur; etkili mode görünür Continuous fallback olur ve yedide Octave Anchored geri gelir. Arada sessizlik veya atlanan derece yok. |
| VS10 | C Major'da E çıkar, Eb ekle | Altı ve yeniden yedi taslakta fiziksel64 hâlâ64 çalar. Apply sonrası64 →63; klavye bütün süreçte taslağı gösterir. |
| VS11 | C Major'da Eb ekle, sekiz notada Apply | Apply öncesi mevcut Major; Apply sonrası sekiz dereceli gam. Preferred Octave Anchored varsa Continuous fallback kullanılır. |
| VS12 | Yerel Root C→D ve named Scale Minor | Follow kapanır, Root ve üyelik yalnız taslakta değişir; Apply öncesi çalan kök/gam korunur, Apply sonrasında birlikte değişir. |
| VS13 | Root tuşunu normal tıkla; Custom menüsü seç | Root çıkarılmaz; Custom seçimi taslağı korur; normal tık audition üretmez. |
| VS14 | Sekiz taslak/yedi çalan gam varken elle mode değiştir | Bekleyen taslak uygulanmaz; etkili mode çalan yedi gamdan hesaplanır. Apply sonrası sekiz gam/fallback görünür. Modun aynı gamda farklı pitch çıktısı verdiği iddia edilmez. |
| VS15 | Bekleyen Root/üyelik taslağı; Live değişimi; Follow aç | Custom korunur; Follow açılınca taslak bırakılır, güncel Live gamı gelir. Follow kapatılıp düzenlemeye başlanınca terk edilmiş taslak geri gelmez. |
| VS16 | Follow açıkken seçili klip Current Scale değiştirir | Güncel Root/ad/aralıklar otomatik kullanılır; Apply gerekmez. Yerel kontroller Live veya klip değerlerine yazmaz. |
| VS17 | Basılı nota sırasında Apply/Live/mode değişimi | Eski hedef aynı release velocity ile kapanır; yeni note-on yeni çalan durumu kullanır. |
| VS18 | Fiziksel beyaz/siyah hedef çakışması, retrigger,16 kanal | Son sahip bırakılana kadar hedef kapanmaz; her on velocity korunur; kanallar bağımsızdır. |
| VS19 | Option-click üyeli/siyah/Root; fiziksel çakışma | Kısa audition doğru kapanır, taslak/tercih/Follow değişmez; Black Keys ignore ekran audition'ını engellemez. |
| VS20 | Çok kanal/oktav aynı pitch class; Panic/reset | Çıkış vurgusu son bırakmaya kadar kalır; Panic temizler/sustain bırakır. Eski audition callback'i yeni sesi kapatmaz. |
| VS21 | MIDI sınırları, özellikle1/12 notalı gamlarda | Negatif veya127 üstü hedef on/off üretmez; clamp/hayalet off yok. Geçerli0/127 değerleri aynen kalır. |
| VS22 | Velocity0, release velocity, CC/bend/pressure/program/system/SysEx | Mevcut MIDI sözleşmesi korunur; poly aftertouch doğru aktif hedeflere gider, diğer içerik değişmez. |
| VS23 | API geç başlangıç, id0 kaybı, stale getter, reconnect; Mode off | İngilizce bağlantı durumu; Follow beyaz note-on'ları unavailable iken susar, bırakmalar ve Black Keys çalışır; güncel gamla döner. Mode off eşlemeyi kapatmaz. |
| VS24 | Version2 Custom geçerli/6/8 taslakları aç | Octave Anchored tercihi; eski taslak ve çalan kök/ad/üyelik/Black Keys ayrı korunur. Geçersiz eski taslak sessizce Apply edilmez; Apply yeni 1–12 desteğini etkinleştirir. |
| VS25 | Yeni kayıt pending farklı Root ve5/8/12 taslak, ayrı sounding gam | Kaydet/kapat/aç aynı ayrımı ve Preferred Mapping Mode'u korur; etkili mode doğru türetilir, Apply doğru taslağı alır. |
| VS26 | Follow kaydı/API/blob/init farklı sıralar | Güncel API kayıtlı eski Follow gamını geçer; preferred mode ve Black Keys korunur, fallback güncel gamdan hesaplanır. |
| VS27 | İki cihazı farklı tercih/taslak/çalan gamla kaydet/aç | Cihazlar bağımsız; held/audition yeniden başlamaz. |
| VS28 | Yeni panel ve yeni konumdan paket yükle | Yaklaşık360×169 İngilizce panel kesilmeden, klavye küçülmeden, Mode/Apply/Playing okunabilir görünür; dört JS bulunur. Native arm64 ve ses/MIDI kullanıcı kanıtıdır. |

## Set / migration matrisi

Her satır için ayrı Set: ekran ve MIDI al → kaydet → Set/Live kapat → yeniden aç → API hazır olmasını bekle → ekran ve MIDI karşılaştır. Cihazı yeniden eklemek veya VM restore native Set round-trip değildir. Eski v2 örnekleri eski sürümde oluşturulmuş kopyalardır; yeni sürüm v3 saklar. Elle blob değiştirmek host migration kanıtı sayılmaz.

| Kayıt | Açılışta beklenen |
|---|---|
| v2 geçerli Custom +ignore | Root/ad/taslak/çalan üyelik ve Black Keys korunur; tercih Octave Anchored. |
| v2 altı taslak Root E; çalan D Dorian7 | Taslak E/6 ve çalan D/7 ayrı;60→62,64→65. G eklemek hâlâ taslak; Apply sonrası E7:60→64,64→67. |
| v2 sekiz taslak Root G; çalan C Major7 | G/8 taslak ve C/7 çalan ayrı;60→60,64→64. Apply sekiz taslağı etkinleştirir ve Anchored tercihi Continuous fallback olur. |
| v3 pending5/8/12, farklı Draft/Playing Root/ad | Her uzunluğu ayrı Set'te deneyin; iki Root/ad/üyelik, tercih ve Black Keys aynen döner; Apply kayıtlı taslağı alır. |
| v3 Anchored tercih +sekiz çalan | Tercih Anchored, etkili Continuous; yediye Apply/Follow dönüşte Anchored. |
| Follow kaydı +farklı güncel Live gamı | API hazır olunca güncel gam kayıtlı eskisini geçer; tercih/Black Keys korunur. API/blob/init altı sırası otomatik sınanır; host'ta üretilebilen sıra belgelenir. |
| İki cihaz, farklı tercih/taslak/çalan/Black Keys | Cihazlar bağımsız; kayıt sırasında held/audition varsa yeniden açmada bunlar tekrar başlamaz. |

## Otomatik doğrulama ve paket

`node test-midi.cjs` ve `node test-state.cjs` onaylı public MIDI/API/durum mesajları ile round-trip sınırlarını sınar. Bunlar gerçek fare, native arm64, ses ve Live Set kabulü değildir. Python3.9+ ile `python3 build-amxd.py` düzenlenebilir kaynaktan cihazı üretir. `python3 package-development.py --check` AMXD/maxpat eşitliği, MIDI effect türü, dört bitişik JS, route'lar, hidden per-device blob ve Mode/Apply/panel sınırlarını kontrol eder.

Temiz kaynak commit'inden `python3 package-development.py --output /absolute/output/WhiteKeysLive12-development.zip` kullanılır. Manifest tam kaynak commit ve dosya byte/SHA256 değerlerini taşır; aynı commit aynı ZIP baytlarını üretir. Paket .git içermez. ZIP CRC ve içerik baytları doğrulanır. Son inceleme ve birleşik koşum sonucu teslim raporunda ayrıca kaydedilir; bu yönerge son incelemenin tamamlandığını iddia etmez. #15 kullanıcı kabulü tamamlanana kadar DEVELOPMENT etiketi korunur.
