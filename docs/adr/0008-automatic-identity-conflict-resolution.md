---
status: accepted
---
# Kimlik çakışmasını otomatik çözme

2026-10-11: Kullanıcı kimlik çakışmasındaki manuel seçimin kaldırılmasını istedi. Belirsiz eski Set açılışında “İlk cihaz Host kalsın, diğerleri otomatik yeni kimlik alsın” seçeneğini açıkça seçti.

## Karar

- Manuel Identity conflict aday menüsü kaldırılır.
- Çalışan native Set oturumunda daha önce tek ve geçerli olarak kaydolmuş cihaz aynı kimliğin sahibi kalır. Sonradan kopya eklemek veya onu kanal sırasında öne taşımak mevcut sahipliği değiştirmez.
- Oturumda bilinen bir sahip yoksa aynı kimlikli cihazlardan native Set dolaşımında ilk olan kimliği ve kayıtlı Host tercihini korur. Bu sıra track, return, master ve Rack chain cihaz dolaşımıdır; adapter yükleme sırası veya runtime sayısının büyüklüğü değildir. İlk cihazın Host tercihi kapalıysa otomatik açılmaz.
- Diğerleri ayrı yeni kimlik ve Host kapalı alır; son gam, Black Keys ve Follower kaynak referansı korunur. Takipçiler korunan kimliği izler.
- Başlangıçta bütün native cihazların kayıtları görülür; geçersiz veya hazır olmayan çakışma üyesi varken kimlik tahsis edilmez. Çözüm mevcut atomik assignment/unblock işlemiyle otomatik ilerler. Aday silinirse işlem geri alınır ve güncel grupla otomatik tekrarlanır.
- Farklı kimliklerin çoklu Host tercihleri ayrı Host conflict davranışıdır. Kimlik çözümü yeni açık rol devri yaratmaz; tek aktif Host kuralı korunur.
- Set izolasyonu, eski snapshot reddi, basılı nota güvenliği ve normal Set kaydıyla yeni kimliklerin kalıcılaşması korunur.

## Önceki kararın değişmesi

ADR 0006’nın açık kullanıcı seçimi ve sıra üzerinden sahip seçmeme hükümleri bu açık kullanıcı tercihiyle değiştirilir. ADR 0007’nin kimlik çakışması sırasında manuel seçim önceliğine yaptığı atıf otomatik kimlik çözümü olarak okunur; farklı kimlikler arasında açık Host devri davranışı değişmez.

Belirsiz eski kayıtta ilk cihazın tarihsel özgün olduğu iddia edilmez; bu kullanıcının seçtiği deterministik kurtarma politikasıdır.

## Kanıt

Yeni otomatik adapter testleri: canlı Host/Follower kopyalama, native sırada kopya öne geçmesi, üç kopyanın altı initialization sırası, farklı runtime ile yeniden yükleme, silinen aday, geçersiz kayıt ve çözüm sırasında bağımsız açık Host eylemi. Gerçek Live çoğaltma/kayıt/açılış sonucu bu revizyonda henüz Not run.
