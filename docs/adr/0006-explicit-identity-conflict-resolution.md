---
status: accepted
---
# Kimlik çakışmasını açık kullanıcı seçimiyle çözme

2026-10-11: Kullanıcı normal Set açılışında otomatik Host/Follower bağlantılarının korunmasının önemli olduğunu belirtti ve yalnız kimlik çakışmasında bir kez kaynak seçme yaklaşımını onayladı.

## Karar

- Normal Set yeniden açılışında kayıtlı Host durumu ve Follower kaynak referansı korunur; kaynak hazır olduğunda takip otomatik devam eder. Her açılışta manuel seçim istenmez.
- Aynı kalıcı cihaz kimliğini taşıyan birden fazla cihaz görüldüğünde ilk gelen, runtime sayısı, isim veya track sırası üzerinden özgün seçilmez.
- Çakışan kimlik için paylaşım geçici durur. Cihazlar son Sounding Scale ile çalmaya devam eder; başka bir Host'a otomatik bağlanılmaz.
- Kullanıcı mevcut kimliği ve Host rolünü hangi cihazın koruyacağını bir kez açıkça seçer. Diğer çakışan cihazlar yeni kimlik ve Host kapalı alır.
- Mevcut kimliğe bağlı Follower referansları seçilen cihaza bağlı kalır. Yeniden kimliklenen Follower kopyalarının mevcut kaynak referansı korunur; başka Set kaynakları sessizce yeniden yorumlanmaz.
- Çözüm normal Set kaydıyla kalıcılaşır. Çözülmeden kaydedilen çakışma yeniden açılışta tekrar çözüm bekler; seçim yapılmış gibi davranılmaz.
- Çözüm yalnız ilgili kimliğin paylaşımını durdurur; bağımsız Host'lar ve yerel MIDI işleme devam eder.

## Önceki kararın değişmesi

ADR 0005'in özgün cihazı otomatik tanıma ve kopyaya otomatik yeni kimlik/Host OFF verme zorunluluğu, çakışma durumunda açık kullanıcı seçimiyle değiştirilir. Otomatik yeniden bağlanma, Set izolasyonu ve yanlış kaynağa bağlanmama koşulları korunur.

## Uygulama ve kabul sınırı

Bu belge davranış kararını kaydeder; uygulanmış veya Live'da kabul edilmiş çözüm değildir. #19 yeni sözleşmeyle doğrulanmadan #20–#21 paylaşım uygulamasına geçilmez; #22 gerçek Live kabulü tamamlanmadan kapanmaz. Üretim paylaşımı mevcut durumda kapalı kalır.

Yeni doğrulama: her iki kayıt sırası, Follower önce yüklenmesi, Host/Follower/Rack/track çoğaltma, çatışma çözülmeden kayıt/açılış, seçimden sonra kayıt/açılış, rename ve başka Set'e kopyalama. Geçici yükleme belirsizliği kalıcı çakışma sayılmamalı; seçim ve yeni kimlik tahsisi tutarlı biçimde tamamlanmalıdır. Otomatik testler gerçek Live kabulünün yerine geçmez.
