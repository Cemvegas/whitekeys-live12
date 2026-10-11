# Üretim Host/Follower paylaşımı — #20 / #21

Yetkili sözleşme: [Spec #23](https://github.com/Cemvegas/whitekeys-live12/issues/23) ve workspace ADR 0006 ve ADR 0007 / ADR 0008. #19 kullanıcı tarafından kabul edildi; bu üretim sürümü için gerçek Live kabulü ayrıca bekliyor. #20–#21 kodu hazırlanmıştır; #22 kapanmış sayılmaz.

## Kullanım

Host yazısının bütün yüzeyine basın; yalnız aktif Host sarı görünür. Local ve Follow Live paylaşabilir. Follow WhiteKeys seçen cihaz Set’in tek aktif Host’una otomatik bağlanır; ayrıca Host seçilmez. Follower’da Host açmak son gamı koruyarak Local’a geçer.

Başka cihazda Host açmak rolü devreder: önceki Host’un kaynak türü ve gamı korunur, Host kapanır; Follower’lar yeni Host’a geçer. Host kapandığında son gam ve referans korunur, Waiting for Host görünür. Farklı kayıtlı Host tercihleri Host conflict gösterir; istediğiniz cihazda Host’a basın. Kimlik çakışması otomatik çözülür: canlı mevcut cihaz kimliği/Host tercihini korur, kopyalar yeni kimlik ve Host kapalı alır. Eski çakışmalı Set açılışında ilk native cihaz korunur; manuel aday menüsü yoktur. Ayrıntılar docs/specs/automatic-identity-resolution.md içinde. Gerçek kayıt/açılış kabulü bekler.

## Kayıt ve adapter

V4'ün önceki 12 atomlu kayıtları okunur. Çözülmemiş kimlik çakışması aynı mantıksal kaydın 13. atomunda `1` olarak saklanır; temiz kayıt 12 atomdur. Kaynak seçilmemiş WhiteKeys durumu boş kaynak çiftiyle geçerlidir; yarım veya kendine işaret eden çift reddedilir. Geçersiz kayıt paylaşım kaynağı olarak yayımlanmaz.

Native adapter `live.object` persistent Master volume referansını yeniden bağlamadan önce okur. Kalıcı Set UUID ile oturumdaki Live nesne kapsamı ayrıdır. Başka Set anchor/kayıtları kaynak olarak alınmaz. Native cihaz census'u track/return/master ve iç Rack chain'leri tarar; `WhiteKeys sharing enrollment` Automated and Stored sayısal parametresi (değeri paylaşım kararlarında kullanılmaz) kayıt bekleyen cihazları sayar. Her mevcut cihazın kaydı görülmeden snapshot kabulüne başlanmaz. Süre aşımı, ilk gelme veya runtime sayısı sahiplik kanıtı değildir. Yabancı cihazlar census bakımından tamamlanır ama paylaşım grubuna alınmaz.

Global yalnız deferred adapter JSON kayıtlarını taşır. 100 ms polling, native keşif ve mesaj dağıtımı içindir. Native LiveAPI handle’ları yeniden kullanılır; sabit parametre adları ve değişmeyen model mesajları tekrar işlenmez. Bu düzeltmenin gerçek profil kanıtı ve kabul sınırı `docs/performance-diagnosis/README.md` içinde kayıtlıdır. Kaynak yayınları Set, kalıcı UID, ayrı transport epoch, revision ve atomik Root/maske/ad taşır. Kaynak kaybında aynı epoch'un revision eşiği korunur. Kimlik çözümü bütün adayların assignment onayı ve unblock aşaması tamamlanana kadar ilgili yayınları engeller; değişen/silinen grup aşamalı assignment'ı geri alır. Kullanıcı seçimi, kimlik/oturum/adayı doğrular; tekrar seçim kimlik tahsis etmez. MIDI scripti ve basılı-nota defteri transporttan bağımsızdır.

## Otomatik kanıtın sınırı

`test-sharing.cjs`: gerçek model → gerçek MIDI; kaynak seçimleri, bozuk/eski/yanlış mesajlar, kaynak kaybı ve revision eşiği, basılı nota kanalı, çakışma kaydı, kaynak seçmeden kaydet/aç.

`test-sharing-adapter.cjs`: gerçek üretim adapter/model/MIDI, kontrollü Live API sınır ikamesi; startup kayıt barajı, üç kopyanın 6 sırası × 3 keeper seçimi, aynı anda/tekrar/eski seçim, runtime değişmiş kaydet/aç, gecikmiş anchor, yabancı cihaz yanında bağımsız Host, silinen adayda rollback. Bu native Max/Live davranışının ölçümü değildir.

## #20 kısa Live demo — HC01–HC03

AMXD ve beş JS dosyasını aynı klasörde tutun. A, B ve C ayrı kimlikli cihazlar olsun; C için A’yı çoğaltmayın. A/B keşfi çalışmadan sonraki adıma geçmeyin.

1. A’da Local / D Major seçip Host’a basın: çarpı yok, bütün düğme sarı. B’de Follow WhiteKeys seçin: ayrıca seçim olmadan A görünür; A’yı G yapınca B’nin Playing ve sesi G olur.
2. C’de Local / A Major ve Host açın: A kapanır, yalnız C sarıdır; B otomatik A Major çalar. A’yı değiştirmek B’yi etkilemez. Devir boyunca basılı nota eski hedefinde kapanır. A’nın kaynak türü ve gamı korunur.
3. C’de Host’u kapatın: B son gamı korur ve Waiting for Host gösterir. C’de tekrar açın: B elle seçim olmadan yeniden bağlanır.

| Kriter | Sonuç |
|---|---|
| HC01 native düğme, sarı renk ve otomatik keşif | Not run |
| HC02 gerçek Host devri ve basılı nota | Not run |
| HC03 gerçek kapat/yeniden bağlan | Not run |

Live/Max sürümü, fixture ve gözlenen sonuç gerçek denemede kaydedilir. Otomatik adapter testi native Live kanıtı değildir. HC04–HC05 kayıt/kimlik çözümü ve önceki güvenlik regresyonları Spec #23 / #21 / #22 kapsamında ayrıca bekler; bu demo bunları tamamlanmış saymaz.
