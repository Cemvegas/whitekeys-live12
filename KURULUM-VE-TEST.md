# WhiteKeys Live 12 — anlık düzenleme geliştirme paketi

**DEVELOPMENT — kısmi uygulama.** Anlık Local düzenleme, tek Continuous Degrees eşlemesi, gam tanıma ve A paneli uygulanır. Gerçek Live kabulü kullanıcıya aittir. Host paylaşımı ve kalıcı kimlik yönteminin gerçek Live kanıtı beklenmektedir; bu paket çalışan Host transportu sunmaz. Host kontrolü kapalıdır; Follow WhiteKeys seçimi **Sharing unavailable** gösterir ve geçerli Local/Follow Live seçimini değiştirmez. Önceki #8/#15 kabulü bu sürümün kanıtı değildir.

## Kurulum

1. ZIP'i yeni, kalıcı bir klasöre açın. AMXD ve dört `whitekeys-*.js` dosyası yan yana kalsın. Düzenlenebilir maxpat, testler ve derleme/paketleme scriptleri pakettedir.
2. Live 12 Suite veya Max for Live lisanslı Live 12 Standard ile ayrı test Set'i açın. Eski müzik Set'inin kopyasını kullanın; cihazı enstrümandan önce yerleştirin, Monitor In veya arm açın.
3. Test ederken MIDI girişini ve Post FX çıkışını kaydedin. MIDI kanalı ve release velocity için ham mesaj kaydı kullanın; piyano rollü tek başına yeterli kanıt değildir.

## Çalma ve düzenleme

Scale Source **Local** olduğunda Root, Scale ve klavye üyeliği hemen çalan gama uygulanır; Apply, Draft veya Mode yoktur. Root çıkarılamaz. Root menüsü aralıkları koruyarak gamı transpoze eder. Gam tanıma mevcut Root'u korur; eşleşme yoksa Custom gösterilir. Scale menüsündeki Also matches seçenekleri mutlak notaları koruyup Root ve Scale'i birlikte değiştirir.

Scale Source **Follow Live** olduğunda Root/Scale/üyelik düzenleme kapalıdır. Live'ın güncel gamı otomatik alınır. Live hazır değilse **Live unavailable** görünür; son geçerli gam çalmaya devam eder. Local'a dönmek son alınan gamı korur. Yerel işlemler Live/klip değerlerine yazmaz. Live Scale Mode off bildirimi eşlemeyi kapatmaz.

Continuous Degrees 1–12 notalı gamların tüm derecelerini beyaz tuşlara sırayla eşler. MIDI60 seçili Root'a gider; gam bittiğinde ses yüksekliği bir oktav artar. Sekiz notalı gamda C D E F G A B üst-C derece 1–8, üst-D sonraki oktavın Root'udur. Yedi notalı gamların eski MIDI sonucu korunur. Fiziksel siyah tuşlar Black Keys Pass/Ignore seçimine göre çalışır.

Basılı notalar gam/kaynak/Root değişiminde yeniden akort edilmez; özgün hedeflerinde doğru kanalla kapanır. Option-click kısa audition yapar ve üyeliği değiştirmez. Panic bu cihazın aktif notalarını, vurgularını ve sustain'i temizler. MIDI 0–127 dışındaki sonuçlar bastırılır.

## Gerçek Live kontrol listesi

- UI01: 360×169 panelde A renkleri, 332×62 klavye, Source, Host, Panic, Root, Scale, Black Keys ve Playing kırpılmadan görünür. Host kapalı/erişilemez; Mode ve Apply yoktur.
- UI02: Local seç; Root'u D yap, bir üyelik ekle/çıkar. Sonraki beyaz note-on hemen yeni gamı kullanır. Root tıklaması etkisizdir.
- UI03: C Major üyeliğinde E'yi çıkarıp geri ekle. Scale Custom/Major olur; Root sabittir. A Minor alternatifini seç; mutlak notalar aynı, Root A olmalıdır.
- UI04: Follow Live seç. Gam düzenleme kapalı, Option-click audition açıktır. Live gamını değiştir; Playing ve MIDI güncellenir. Bağlantı kaybında son gam korunur.
- UI05: Gam/Root değişiminden önce bir nota tut; değişimden sonra bırak. Eski hedef doğru kanalda kapanır. Tekrarlı notalar, farklı kanallar, audition ve Panic'i dene.
- UI06: 1, 5, 7, 8, 12 notalı gamlarda aşağı/yukarı sıra, velocity, Black Keys ve MIDI sınırlarını ham mesajla doğrula.
- UI07: Eski v2/v3 Set kopyasını aç. Uygulanmamış eski taslak yerine Sounding Scale korunmalı. Yeni v4 kaydet/aç; gam ve Black Keys aynı olmalı. V4 eski cihaz sürümlerinde açılma garantisi taşımaz.

Host paylaşımının yeniden açılış, çoğaltma, kaynak kaybı ve Set izolasyonu kabulü ayrı paylaşım prototipiyle doğrulanır. Bu pakette unavailable seçeneği o kabulün yerine geçmez.

## Otomatik kontroller

`node test-midi.cjs`, `node test-state.cjs`, `node test-ui.cjs` ve `python3 package-development.py --check` mesaj/MIDI, kayıt geçişi, panel yönlendirmesi ve paket bütünlüğünü kontrol eder. Gerçek Live kabulünü kapatmaz.
