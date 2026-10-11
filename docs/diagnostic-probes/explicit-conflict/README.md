# #19 — Explicit Conflict Probe

Durum: otomatik mesaj senaryoları hazırlanıyor; gerçek Live **NOT RUN**. Spec #23 / ADR 0006 için ayrı tanılama cihazıdır, üretim paylaşım uygulaması değildir. #19 açık kalır, #20–#21 başlamaz. Computer Use kullanılmaz.

## Paket ve test

`python3 docs/diagnostic-probes/explicit-conflict/build-fixture.py` kaynak patch’ten AMXD ve workspace outputs paketini üretir. `node docs/diagnostic-probes/explicit-conflict/test-explicit-conflict.cjs` mevcut kullanıcı/kayıt/kaynak mesaj sınırında gerçek model ve MIDI script’lerini çalıştırır. Max/LiveAPI/Task/Global tesisleri kontrollü test adapterleridir; native mapping, pattr ve Live event sırası burada doğrulanmaz.

MIDI mapper üretim script’inin değiştirilmeyen davranışının donmuş kopyasıdır; yalnız maskeyi aralık listesine çeviren diagnostic giriş eklenir. Üretim dosyaları değiştirilmez. JS dosyalarını AMXD’nin yanında tutun. Tanılama paneli 680×169’dur; üretimin 360×169 yerleşimini kanıtlamaz.

## Karar ve sınırlar

- Kayıt listesi `[1, deviceIdentity, hostPreference, sourceIdentity, root, mask, conflictPending]` diagnostic şemasıdır; üretim v4 şeması değildir. Altı alanlı başlangıç tuple’ı da kabul edilir; yeni kayıt yedi alandır. Kalıcı runtime/owner ID yoktur.
- Aynı kimlikli birden fazla katılımcı kaydolunca her biri paylaşım dışı kalır. Kullanıcının belirli güncel adayı seçmesi kimliği/Host tercihini seçilen cihazda korur, diğerlerine yeni kimlik/Host OFF verir. Follower seçimi Host açmaz. Silme sonrası tek kalan aday da seçim bekler. Bildirimler pattr’ye iletilir; getvalueof bekleyen kimlik tahsisini uygular.
- Paylaşılan Global registry yalnız diagnostic transporttur. Timeout ile sahip seçilmez; zaman aşımıyla kimlik yeniden tahsis edilmez. Aktif cihaz ID’si yalnız aynı canlı cihazın eski kaydını değiştirmek ve adayları ayırt etmek içindir, kalıcı sahiplik değildir.
- Set dışına kopyada persistent Master volume live.object referansı çözülmezse paylaşım bloke edilir. Eski referans okunmadan üzerine yeni Set ID yazılmaz. Refresh mevcut native referansı tekrar okur; sıfır ID’ye bekleme süresiyle anlam yüklenmez. Bu durumda kaynak/Host tercihi kayıtta korunur fakat yayım ve takip durur.
- `live.thisdevice` + `deferlow` başlatır, native getid yanıtı kayıt için kapıdır. Normal restore’da yanıtın zamanlaması gerçek Live’da doğrulanmalıdır. Yerel test Master=99 yanıtını verir; bunu cold mapping kanıtı saymayın.
- Bir Follower ilk Host kaydolduğunda ve aynı kimlikli ikinci cihaz henüz kaydolmadığında geçici ilk snapshot alabilir. Registry tüm henüz kaydolmamış WhiteKeys cihazlarının native census’unu sağlamaz. Bu açılış penceresi ayrıca kabulde ölçülmeli; yanlış snapshot görülürse yöntem FAILED’dir. Bu açık sınır nedeniyle probe üretime taşınmaz.
- Silme temizliği `notifydeleted` bildirimiyle yapılır. Live/Max warm kapat/aç sırasında Global’ın ve bildirimin lifecycle’ı henüz kanıtlanmadı. Eski kayıt kalırsa false conflict olabilir; bunu timeout ekleyerek Passed’e çevirmeyin.
- Polling 100 ms yalnız deneme güncellemesidir; ürün gecikme hedefi veya hazır olma kanıtı değildir. Seçimler Global JSON üzerinde Max JS olaylarıyla sıralanır; gerçek eşzamanlı girişte ikinci seçim güncel aday grubuyla uyuşmazsa reddedilir. Kayıt/yükleme ve UI event zamanlaması Live kabulüne bağlıdır.

## Kullanıcının Live adımları

Üretim Set’inizde başlamayın. Yeni bir test Set’i açın; bu AMXD için bağımsız bir proje oluşturun. Her probe’un arkasına enstrüman ekleyin. İlk oturumda Live/Max sürümünü yazın. MIDI 60 için C Root’ta C4, D Root’ta D4 beklenir (Live’ın oktav etiketi farklı olabilir; MIDI numarası 60/62 esas).

1. **Normal otomatik bağlantı:** İki MIDI kanalına paketteki AMXD’yi yükleyin. Birine Host açın; ikinci cihaz Scale Source menüsünden bu Host’u seçsin. Host Root’u D yapın, MIDI 60 çalınca her iki kanalda MIDI 62 duyulsun. Ekrandaki iki kimliği ve Follower Source kimliğini kaydedin.
2. **Normal cold restore:** Set’i `01-Normal.als` kaydedin. Live ve Max’i tamamen kapatın, Set’i açın. Hiçbir Host/kaynak seçimi yapmadan Host ON, eski kimlikler ve Follower bağlantısı dönmeli. Host Root değişimi tekrar Follower’a gitmeli. Restored Master/current Master uyuşmalı. Refresh gerekti mi kaydedin; otomatik dönüş için Refresh gereksinimi başarısızlıktır.
3. **Host çoğaltma:** Host cihaz başlığında çoğaltın. Her iki cihaz aynı ID ile Identity conflict göstermeli; otomatik UID değiştirme/Host seçimi olmamalı. Host kopyasının Root’unu farklılaştırın. Follower son gamda kalmalı; diğer bağımsız bir Host çalışmalı.
4. **Seçim:** Choose device to keep identity menüsünde adayların kanal/cihaz/konumunu doğrulayın. Eski kimliği koruyacak cihazı seçin. O cihaz eski ID ve Host tercihini korusun; diğeri farklı ID ve Host OFF olsun. Follower eski ID’de kalan cihazın gamını alsın. Denemeyi tekrar yapıp bu kez kopyayı seçin; özgünlük otomatik tahmin edilmemeli.
5. **Çözülmüş cold restore:** Seçimden sonra `02-Resolved.als` kaydedin, Live/Max tamamen kapat/aç yapın. Aynı ID’ler, Host tercihi, otomatik bağlantı; tekrar çakışma sorusu olmamalı.
6. **Çözülmemiş restore:** Normal Set’in ayrı kopyasında Host’u çoğaltın; seçim yapmadan `03-Unresolved.als` kaydedin. Cold açılışta aynı kimlikli iki cihaz yine çakışma göstermeli; Follower son gamı korumalı. Otomatik kazanan olmamalı.
7. **Üç aday / silme:** Host’tan üç aynı kimlikli cihaz oluşturun. Bir adayı seçim öncesi silin; kalanlar çakışma beklesin. Bir aday kalana kadar silerseniz son aday da seçim beklesin. Eski menü seçimi başka cihazı seçmemeli. Seçimden sonra tüm yeni ID’ler farklı olmalı. Follower’ı çoğaltıp seçim yapın: keeper Host OFF ve mevcut Source’u korumalı.
8. **Rack ve track:** Host veya Follower içeren Rack’i, sonra track’i ayrı testlerde çoğaltın. Aynı çakışma ve seçim davranışı, anlaşılır aday konumları beklenir. Track/cihazı yeniden adlandırınca bağlantı korunmalı.
9. **Yükleme sırası:** Çözülmemiş testte iki çakışan Host’u farklı Root/maske yapın, Follower’ın son gamını not edin. Warm ve cold açılışta Follower’ın herhangi bir çakışan gamı geçici alıp almadığını kontrol edin. Yalnız track konumu gerçek kayıt sırası kanıtı değildir. Görüntülenen runtime ve durumlar ile gözlemi yazın; sıra gözlenmediyse Not run. Yanlış geçici snapshot varsa Failed.
10. **Başka Set:** Follower’ı başka Set’e kopyalayın; orada aynı etiketli farklı Host oluşturun. Eski Source’un referansı taşınsın ama otomatik bağlanmasın. Master referansı çözülmüyorsa paylaşım bloke edilsin, son gam çalsın. Host kopyası da yanlış Set’te paylaşım yapmamalı. Warm Set değişiminde stale Global kaydı/false conflict var mı yazın.
11. **MIDI:** Bir notayı basılı tutarken çakışma oluşturun/çözün ve Root değiştirin; bıraktığınızda eski hedef kapansın. Tekrarlı notalar ve farklı MIDI kanalları takılı kalmasın. Panic yalnız ilgili cihazı kapatsın. Bu probe Black Keys/audition için üretim kontrol yüzeyini sunmaz; bunların tam üretim HC kabulü #22’ye aittir.

## Sonuç formu

Her satır için beklenen ve gözlenen sonucu ayrı yazın. Başlangıç durumu hepsinde **Not run**.

| Adım | Sonuç (Passed/Failed/Not run) | Gözlenen ID, Host/Source, Master, gam ve hata |
|---|---|---|
| 1 Normal bağlantı | Not run | |
| 2 Normal cold restore | Not run | |
| 3 Host çoğaltma | Not run | |
| 4 Her iki keeper seçimi | Not run | |
| 5 Çözülmüş cold restore | Not run | |
| 6 Çözülmemiş cold restore | Not run | |
| 7 Üç aday / silme / Follower | Not run | |
| 8 Rack / track / rename | Not run | |
| 9 Follower önce / geçici yanlış snapshot | Not run | |
| 10 Cross-Set / warm lifecycle | Not run | |
| 11 MIDI / held-note / Panic | Not run | |

Live sürümü: … · Max sürümü: … · Set adı: … · Tarih: …

Bir Failed veya zorunlu Not run varsa #19 kapanmaz. Bu paket bağımsız #19 hazırlığıdır; #20–#21 üretim işlerinin yerine geçmez.

Kaynaklar: [live.object persistence](https://docs.cycling74.com/reference/live.object), [live.thisdevice](https://docs.cycling74.com/reference/live.thisdevice), [Live API lifecycle](https://docs.cycling74.com/userguide/m4l/live_api_overview/). Native referansın nasıl taşındığını gerçek kullanıcı denemesi belirleyecek.
