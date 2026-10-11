# Üretim WhiteKeys — gerçek Live kabul sonuç formu (#22)

Güncel sözleşme: [üretim paylaşımı](docs/production-sharing.md), [otomatik kimlik çözümü](docs/specs/automatic-identity-resolution.md) ve [ADR 0008](docs/adr/0008-automatic-identity-conflict-resolution.md). Manuel kimlik seçimi yoktur; ADR 0008 eski manuel seçim koşullarını değiştirir. Otomatik testler veya eski sürümün kabulü bu revizyonun native Live kanıtı değildir.

| Koşum bilgisi | Gerçek değer |
|---|---|
| Tarih / test eden | 2026-10-11 / kullanıcı; sohbet sonucu “hepsi geçti” |
| macOS / Live / Max sürümü | Kurulu Live 12.4.6, bundled Max 9.1.5; kullanılan sürüm kullanıcıdan ayrıca doğrulanmadı |
| Manifest source_commit / package_version | f43ed90908ce02cc3b61333fe80a7e22537ed976 / development-f43ed90908ce |
| ZIP SHA256 / açılan klasör | 63a53f8cc176ccb7b4875ab578c316b46ea68f2b5372420d6023a171c81599b9 / current/ (istenen kurulum yolu) |
| MIDI giriş / Post FX ham kayıt | Ham kayıt paylaşılmadı |
| Test Set / yeniden açma saati | Üç MIDI track A/B/C; Set yolu ve saat bildirilmedi |

Üç ayrı MIDI track'te A, B, C cihazlarını `current/` içinden ayrı ayrı yükleyin; ilk keşif için çoğaltmayın. Cihazları enstrümandan önce yerleştirin. HC01 başarısızsa sonraki adımlara geçmeyin.

| Kriter | Beklenen | Gözlenen / kanıt | Sonuç |
|---|---|---|---|
| HC01 aç/takip | A Local D Major / sarı Host; B Follow WhiteKeys otomatik A'yı bulur. A G olduğunda B'nin Playing ve sesi G olur. Çarpı veya manuel kaynak seçimi yoktur. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC02 devir | C Local A Major / Host açılır; A kapanır, yalnız C sarıdır. B A Major'a geçer; A'yı düzenlemek B'yi etkilemez. Devir sırasında tutulan nota eski hedefte bırakılınca kapanır. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC03 kapat/geri aç | C Host kapanınca B son gamı korur ve Waiting for Host gösterir; yeniden açınca otomatik bağlanır. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC04 normal kayıt/açılış | C Host ve B Follower durumunda kaydet; Set'i tamamen kapatıp yeniden aç. Host, takip ve gam korunur; Black Keys ayrı güvenlik koşuludur. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC05 çoğaltma/kimlik kaydı | Aktif C'yi çoğalt. C Host kalır, kopya Host kapalı ve aynı gamdadır; manuel kimlik seçimi yoktur. Kaydet/kapat/aç: tek Host ve B'nin takibi korunur. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |

Ana beş kullanıcı adımı Passed olarak kaydedilmiştir. Bu sonuç, aşağıdaki henüz denenmeyen alt koşulları kapsamaz; native yükleme sırası veya ham MIDI kaydı gözlendiği iddia edilmez.

## Önceki güvenlik koşulları

Her koşul için fixture, beklenen/gözlenen ve kanıt kaydedilir; önceki sonuçlar bu revizyonun Passed kanıtı sayılmaz. Gerçek yükleme sırası gözlenmediyse o alt koşul Not run kalır.

| Koşul | Gözlenen / kanıt | Sonuç |
|---|---|---|
| UI ve Local/Follow Live; anlık Root/üyelik, gam tanıma ve alternatif Root | | Not run |
| Gerçek enstrüman: Host devir sırasında tutulan notanın kapanması, Black Keys Pass/Ignore, Option-click audition ve Panic | Kullanıcı beş ana adımı ve sonraki MIDI güvenliği adımını geçti bildirdi; ham MIDI kaydı paylaşılmadı. | Passed (user-reported) |
| Kanal/release velocity ham MIDI doğrulaması | Ham kayıt yok; otomatik MIDI kontrolleri geçti. | Not run (native) |
| 1–12 notalı gamlar, MIDI sınırları ve velocity | | Not run |
| Eski v2/v3 Set geçişi | Kullanıcı eski Set olmadığını ve bu testin gerekmediğini bildirdi; 2026-10-11 açık kapsam değişikliği. | Waived by user — test edilmedi |
| Normal v4 yeniden açılış | HC04 ve HC05 kullanıcı tarafından geçti bildirildi. | Passed (user-reported) |
| Follower track ve Rack çoğaltma; gam ve takip korunumu | Kullanıcı ek çoğaltma kontrolünü geçti bildirdi; Black Keys kayıt korunumu ayrıca bildirilmedi. | Passed (user-reported) |
| Host kopyasını native track sırasında öne taşıma | Kullanıcı mevcut Host değişmedi kontrolünü geçti bildirdi. | Passed (user-reported) |
| Eski aynı-kimlikli Set'te ilk native cihaz kurtarma politikası; gözlenen yükleme sırası | | Not run |
| Kimlik işlemi sırasında aday değişimi/silinmesi ve yeniden deneme | | Not run |
| Ayrı Set izolasyonu ve Host kapat/aç kaynak kaybı | Kullanıcı yeni Set’in önceki Host’a bağlanmadığını ve HC03’ü geçti bildirdi. | Passed (user-reported) |

Kullanıcının açıkça kapsamdan çıkardığı v2/v3 Set geçişi kapanış engeli değildir. Kapsamda kalan Failed veya Not run kabul koşulları varken #22 kapanmaz. Native başarısızlık çıkarsa yalnız o senaryo teşhis edilir; yeni teşhis altyapısı eklenmez.
