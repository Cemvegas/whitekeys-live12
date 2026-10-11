# #19 cihaz kimliği teşhisi — 2026-10-11

**Sonuç: kabul edilmedi; sorun henüz bütünüyle çözülmedi.** Üretim paylaşımı kapalı; #19 ve #22 açık, #20–#21 başlatılmadı. Üretim MIDI/model koduna değişiklik yapılmadı. Kullanıcının son talebi üzerine Computer Use bırakıldı; aşağıdaki Live gözlemleri bu talepten önce toplandı.

## Neden ve reddedilen aday

V1 canlı registry'de aynı UID için ilk gelen kazanıyor. Kopya önce kaydolursa özgün Host yeni UID ve Host OFF alıyor. Dondurulmuş baseline ve copy-first testi bunu tekrar üretir.

V2, pattr listesine `ownerRuntime` ekleyerek kayıt öncesi sahibi karşılaştırıyor. Copy-first testinde özgün 11/kopya 12 olduğunda geçiyor. Ancak farklı Set'te aynı sayı tekrar kullanıldığında kopya eski UID'yi koruyor. Ayrıca özgün cihazın ID'si değişirse özgün cihazı kopya sanıp UID ve Host'u değiştiriyor. Dolayısıyla runtime sürekliliği varsayımı kaldırılmadan v2 çözüm değildir.

Bir cihazın persistent self-reference'ı çoğaltılan cihazın kendisine yeniden eşleniyor; bu da tek başına kopya/özgün ayrımı sağlamıyor. Native referansı okumadan üzerine yeni ID yazmak, geri yükleme kanıtını ayrıca yok eder; master probe önce `getid`, sonra bağlama yapar.

## Otomatik kanıt

Tek komut: `node docs/diagnostic-probes/check-rejected-candidates.cjs`.

| Test | Sonuç | Kapsam |
|---|---|---|
| test-collision-baseline.cjs | RED tekrar üretildi | Kopya önce kaydolunca özgün UID kayboluyor |
| test-collision-order.cjs | Sınırlı GREEN | V2; runtime 11/12 aynı kaldığında özgün UID/Host korunuyor |
| test-runtime-reuse.cjs | RED tekrar üretildi | Başka Set'te aynı runtime sayısına sahip kopya UID'yi koruyor; Host ON sözleşmesi de sınanıyor |
| test-runtime-change.cjs | RED tekrar üretildi | Aynı Set'teki özgün cihazın runtime sayısı değişince UID kayboluyor |

Zaman sabit, rastgelelik VM başına sabit tohumlu, registry test başına izole. Runner'ın başarı kodu, reddedilen adayların beklenen başarısızlıklarını doğrular; #19 kabulü anlamına gelmez. Runtime-change senaryosu zorlanmış sözleşme testidir; gerçek Live'da gözlenmiş yeniden numaralandırma olarak sunulmaz.

## Gerçek Live kanıtı

Test Set'leri `outputs/WhiteKeys Acceptance 2026-10-11 Project/` altında ayrı dosyalardır. Kullanıcının önceki Set'i `WhiteKeys Safety Before Identity Tests 2026-10-11.als` olarak korunmuştur. Probe kaynakları `docs/diagnostic-probes/live-fixtures/` altında arşivlendi. Bunlar üretim cihazı ve üretim MIDI kabulü değildir.

| Koşul / fixture | Gözlem | Sınır |
|---|---|---|
| Owner: normal Host çoğaltma | Özgün runtime 18, UID `wk-1791694597888-20110765`, Host ON; kopya 19, UID `wk-1791694603454-146782813`, Host OFF | Normal sıra |
| Owner: soğuk açılış | Live ve Max'in çalışmadığı envanterde doğrulandı; özgün UID/Host ON/8 nota korundu | Bu açılışta runtime yine 18; genel süreklilik kanıtı değil |
| Owner: Rack çoğaltma | Özgün UID/Host korundu; Rack kopyası runtime 21, UID `wk-1791694733188-244011646`, Host OFF | Kaynak etiketi kanal yerine Rack/chain adını gösterdi; etiket koşulu geçmedi |
| Owner: track çoğaltma | Kopya runtime 27, UID `wk-1791694750475-679080675`, Host OFF | Bu örnek geçti |
| Owner: kopya track'i önce konumlandırıp kayıt/aç | Özgün UID/Host ON korundu | Track konumu değişimi registration sırası kanıtı değil |
| Order: kaydedilmiş takipçi önce yükleniyor | Warm açılışta kopya order 3/Host 4; soğuk açılışta kopya 1/Host 2. Son gam kaldı, özgün Host gelince tekrar izledi | Bu kopya kayıt anında zaten farklı UID taşıyordu; aynı UID'li copy-first Live koşulu kanıtlanmadı |
| Order: başka Set'e follower kopyası | Yeni UID `wk-1791695371947-638577767`, Host OFF; eski hedef `wk-1791695142017-141730340` korundu, Source unavailable | Aynı etiketli yeni Host'a otomatik bağlanmadı |
| Runtime Reuse B → C | İki ayrı Set'te kopya runtime 1; UID `wk-1791695675880-159899141` iki Set'te aynı kaldı | **FAIL**; Live'da Host OFF'tu. Host ON girdiyle hata ayrıca VM'de sınandı |
| Master anchor: özgün kayıt/aç | Restored Master 3=actual 3, Device 2; UID `wk-1791696058371-553232711`, Host ON korundu | Warm açılış; bu probe için cold test tamamlanmadı |
| Master anchor: başka Set'e kopya | Restored Master 0, actual Master 3; self Device 1'e eşlendi. V2 runtime farkı sayesinde yeni UID `wk-1791696173055-895769598`, Host OFF | Master referansının Set dışına taşınınca geçersizleştiği gözlendi; bu referansa dayalı düzeltme henüz kabul edilmedi |

Master probe'da Host toggle/`arm_host` tıklamasının yeni Host ON durumu ürettiği doğrulanmadı. Başlangıçta otomatik Host ON fixture kullanıldı; bunu normal UI etkileşimi kabulü saymıyoruz.

Dosya seçicide bir defa `.als` yerine `.amxd` seçilmesi UnknownCompoundStreamType hatası verdi. Dosya seçimi doğrulanıp özgün Set başarıyla açıldı. Bu hata native Song referansına bağlanamaz.

## Yeni hipotezlerin durumu

1. **Kayıt sırası otorite olamaz:** copy-first RED bunu kanıtlıyor. Sıra yerine kopyalanmayan sahiplik kanıtı gerekir.
2. **Native dış referans Set üyeliği kanıtı sağlayabilir:** Master referansının özgün açılışta korunması ve başka Set'te sıfırlanması bu adayı destekliyor. Boş referansın yükleme tamamlanmadan mı, gerçekten kayıp olduğu için mi geldiği ayrılmalı; sabit 250 ms bekleme kabul edilecek hazır olma mekanizması değildir.
3. **Raw ownerRuntime özgünlük kanıtı olamaz:** reuse Live gözlemi ve renumbering RED bu yaklaşımı reddediyor. Master guard tek başına aynı Set içindeki özgün/kopya ayrımını çözmez.

## Çözümlenmesi gereken teknik sınır

Mevcut v2 tuple ve kendisine yeniden eşlenen native self-reference ile iki durum ayırt edilemiyor: aynı cihaz yeni runtime sayısıyla geri yüklendi; veya aynı kayıt çoğaltılıp yeni runtime sayısıyla geldi. Aynı gözlemlere farklı UID/Host sonuçları gerekiyor. Daha uzun beklemek, ilk geleni seçmek veya cihaz/track adı karşılaştırmak bu eksik sahiplik kanıtını oluşturmaz.

Gerekli sonraki deney, raw runtime sayısı yerine **kopyada özgüne ait kalan ve yeniden açılışta native mapping ile çözülen bir sahiplik referansını** sınamalı. Kullanılan API bu ayrımı vermezse cihaz dışında kalıcı bir sahiplik koordinatörü gerekip gerekmediği tasarım kararıdır; mevcut standalone cihaz kapsamına sessizce yardımcı cihaz eklenmez.

### Computer Use olmadan yeni sözleşme deneyi

`node docs/diagnostic-probes/test-ownership-ledger.cjs` dış sahiplik kaydı için ayrı karar çekirdeğini sınar. Önce runtime'ı başlangıçta cache'leyen sürüm, runtime değişiminde `{uid: fresh-3, host: false}` üreterek RED oldu. Çekirdek referansı her talepte yeniden çözecek şekilde değiştirildikten sonra test GREEN oldu:

- Özgün cihaz ve kopya iki kayıt sırasında da özgün UID/Host ON'u koruyor; kopya yeni UID/Host OFF sonucu alıyor.
- Dış referansın çözüldüğü ID değişirse özgün UID/Host korunuyor; kaydedilmiş runtime sayısına bağımlılık yok.
- Başka Set'te runtime sayısı aynı olsa bile eski UID kabul edilmiyor.
- Referans henüz çözülmediyse veya sahip kaydı yoksa `pending` dönüyor; özgünün kaydı değiştirilip kopya sayılmıyor.

**Bu sadece karar sözleşmesidir.** `resolve(reference)` portu testte kontrollü bir Map kullanır. Bu portun gerçek Live'da, cihazın dışında tutulan native referansı çözmesi gerekir; Host cihazının kendi içinde tuttuğu self-reference bu portun yerine geçirilemez. Gerçek native koordinatör, yeni UID'nin kalıcı sahiplik kaydına eklenmesi ve Set yaşam döngüsü adapteri uygulanmadı. GREEN sonuç bu eksikleri doğrulamıyor; üretim paylaşımı veya #20–#21 uygulaması başlamadı. Kopyada yeni UID tahsisini kalıcı olarak commit etmek adapterin yükümlülüğüdür; bu tek-karar probe tekrar çağrılabilir üretim registry'si değildir.

Cycling '74 [live.object referansı](https://docs.cycling74.com/reference/live.object) persistent mapping'i tanımlar; [Live API Overview](https://docs.cycling74.com/userguide/m4l/live_api_overview/) ID kapsamı ve yaşam döngüsünü anlatır. JS'teki raw sayıyı pattr'da saklamak native mapping ile eşdeğer kabul edilmez. [live.thisdevice](https://docs.cycling74.com/reference/live.thisdevice) hazır olma/state bildirir; belgelenmiş bir clone/restore ayrım olayı sunmaz.

**#19 geçmedi. #20–#21 bekliyor. #22 açık.** Sonraki otomatik sonuçlar, gerçek Live matrisinin tamamlanmasının yerine geçmeyecek.

## Son kullanıcı kararı — açık çakışma çözümü

2026-10-11: Kullanıcı otomatik Set yeniden bağlantısının önemli olduğunu belirtti; yalnız kimlik çakışmasında mevcut kimliği/Host rolünü koruyacak cihazı bir kez seçme politikasını onayladı. Workspace `docs/adr/0006-explicit-identity-conflict-resolution.md` güncel davranış otoritesidir. Önceki otomatik özgün/kopya ayrımı yeni uygulamanın kabul şartı değildir; yukarıdaki başarısızlıklar geçmiş adayların kanıtı olarak korunur. Normal restore ve otomatik takip, güvenli çakışma durumu, kullanıcı seçimi, kalıcı yeni kimlik tahsisi ve çözüm sonrası kayıt/açılış halen uygulanıp doğrulanmalıdır. #19 çözülmüş değildir; üretim paylaşımı kapalı ve #22 açık kalır.
