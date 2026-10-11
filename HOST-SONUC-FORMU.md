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
| HC01 aç/takip | A Local D Major / Host açık; B Follow WhiteKeys otomatik A'yı bulur. A G olduğunda B'nin Playing ve sesi G olur. B ayrıca Host seçmeden bağlanır. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC02 devir | C Local A Major / Host açılır; A kapanır, C Host olur. B A Major'a geçer; Devir sırasında tutulan nota eski hedefte bırakılınca kapanır. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC03 kapat/geri aç | C Host kapanınca B son gamı korur ; yeniden açınca otomatik bağlanır. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC04 normal kayıt/açılış | C Host ve B Follower durumunda kaydet; Set'i tamamen kapatıp yeniden aç. Host, takip ve gam korunur; Black Keys ayrı güvenlik koşuludur. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |
| HC05 çoğaltma/kimlik kaydı | Aktif C'yi çoğalt. C Host kalır, kopya Host kapalıdır; manuel kimlik seçimi yoktur. Kaydet/kapat/aç: tek Host ve B'nin takibi korunur. | Kullanıcı, verilen beş adımın tamamını geçti olarak bildirdi. | Passed (user-reported) |

Ana beş adım, ek üç kontrol ve son kalanlar listesindeki 1–3 kullanıcı tarafından Passed bildirildi. Son listedeki 4–6 ve eski v2/v3 geçişi kullanıcı tarafından kabul kapsamından çıkarıldı. Ham MIDI kaydı veya eski çakışmalı Set yükleme sırası gözlendiği iddia edilmez.

## Önceki güvenlik koşulları

Sonuçlar kullanıcı raporudur. Metadata alanlarında bildirilmeyen bilgiler boş/belirsiz kalır; kapsamdan çıkarılan koşullar Passed olarak sayılmaz.

| Koşul | Gözlenen / kanıt | Sonuç |
|---|---|---|
| Görünüm ve gam düzenleme: sarı Host, çarpı yokluğu, Waiting for Host; Local Root/notalar ve Follow Live | Kullanıcı son listedeki 1. kontrolü test ettiğini ve geçtiğini bildirdi. | Passed (user-reported) |
| Önceki Host değişikliğinin yeni Follower gamını etkilememesi; Host kopyası gamı ve Black Keys Ignore kayıt korunumu | Kullanıcı son listedeki 2. kontrolü geçti bildirdi. | Passed (user-reported) |
| Gerçek enstrüman: Host devir sırasında tutulan notanın kapanması, Black Keys Pass/Ignore, Option-click audition ve Panic | Kullanıcı beş ana adımı ve sonraki MIDI güvenliği adımını geçti bildirdi; ham MIDI kaydı paylaşılmadı. | Passed (user-reported) |
| Kanal, note-on velocity ve note-off release velocity ham MIDI doğrulaması | Kullanıcı son listedeki 4. kontrolü kapsamdan çıkardı; otomatik MIDI testleri geçti. | Waived by user — native test edilmedi |
| 1, 5, 7, 8, 12 notalı gamlarda derece sırası ve düşük/yüksek MIDI sınırları | Kullanıcı son listedeki 3. kontrolü geçti bildirdi; bütün nota/velocity kombinasyonları için otomatik test kanıtı ayrıdır. | Passed (user-reported) |
| Eski v2/v3 Set geçişi | Kullanıcı eski Set olmadığını ve bu testin gerekmediğini bildirdi; 2026-10-11 açık kapsam değişikliği. | Waived by user — test edilmedi |
| Normal v4 yeniden açılış | HC04 ve HC05 kullanıcı tarafından geçti bildirildi. | Passed (user-reported) |
| Follower track ve Rack çoğaltma; gam ve takip korunumu | Kullanıcı ek çoğaltma kontrolünü geçti bildirdi; Black Keys kayıt korunumu son 2. kontrolde ayrıca geçti bildirildi. | Passed (user-reported) |
| Host kopyasını native track sırasında öne taşıma | Kullanıcı mevcut Host değişmedi kontrolünü geçti bildirdi. | Passed (user-reported) |
| Eski aynı-kimlikli Set kurtarma ve native yükleme sırası | Kullanıcı son listedeki 5. kontrolü kapsamdan çıkardı. | Waived by user — test edilmedi |
| Kimlik işlemi sırasında aday silinmesi/değişimi ve yeniden deneme | Kullanıcı son listedeki 6. kontrolü kapsamdan çıkardı; otomatik rollback testleri geçti. | Waived by user — native test edilmedi |
| Ayrı Set izolasyonu ve Host kapat/aç kaynak kaybı | Kullanıcı yeni Set’in önceki Host’a bağlanmadığını ve HC03’ü geçti bildirdi. | Passed (user-reported) |

Kabul edilen kapsam tamamlandı: kapsamda kalan koşullar Passed (user-reported); v2/v3 geçişi ve son listedeki 4–6 Waived by user. İstisnalar test başarıları değildir. Üretim AMXD/JS değişmedi; kabul belgeleri ve paket durum metadata’sı güncellendi.
