# Otomatik kimlik çözümü — 2026-10-11 değişikliği

Yetkili kullanıcı kararı: [ADR 0008](../adr/0008-automatic-identity-conflict-resolution.md). Bu belge Spec #23’ün manuel Identity conflict seçimini isteyen eski hükümlerini (AC13–AC16, AC18, AC22 ve HC05’in seçim adımı dahil) değiştirir. Diğer MIDI, Set izolasyonu, tek Host ve performans şartları korunur.

1. Manuel aday menüsü görünmez; kullanıcı kimlik seçmez.
2. Canlı oturumda önceden tek/geçerli cihaz mevcut kimlik ve Host tercihini korur; yeni kopya farklı kimlik ve Host kapalı alır. Kopyanın native sırada öne taşınması mevcut sahipliği değiştirmez.
3. Eski Set aynı kimlikli cihazlarla açılırsa native Set dolaşımındaki ilk cihaz kimliği ve kayıtlı Host tercihini korur. Initialization sırası, görünür isim ve runtime sayısı büyüklüğü kazananı belirlemez. Bu bir kurtarma politikasıdır; tarihsel özgünlük iddiası değildir.
4. Bütün native kayıtlar görünmeden veya bir çakışma üyesinin kaydı geçersizken otomatik tahsis yapılmaz. Identity conflict yalnız geçici bekleme durumudur; cihazlar son gamla çalar.
5. Kopyaların gamı, Black Keys ve Follower kaynak referansı korunur. Mevcut Follower korunmuş kimliği izler; çözüm sürerken başka Host’a kaçmaz. Sonraki açık Host devri normal işler.
6. Kimlik çözümü mevcut assignment/unblock işlemiyle atomiktir. Aday grubu değişirse geri alınır ve otomatik yeniden denenir; kullanıcıdan yeniden seçim istenmez.
7. Normal Set kaydı yeni kimlikleri saklar. Çözülmemiş eski kayıt yeniden açıldığında aynı otomatik politika uygulanır.
8. Farklı kimlikli çoklu Host tercihi ayrı Host conflict’tir; kimlik çözümü otomatik yeni Host tercihi yaratmaz.

## Otomatik kanıt

`node test-auto-identity.cjs`, gerçek üretim adapter/model/MIDI scriptlerini kontrollü LiveAPI sınırında çalıştırır. Canlı Host ve Follower kopyalama, kopya-first native sıra, bütün üç-kopya initialization sıraları, saved reopen, silinen aday, geçersiz restore ve çözüm sırasında açık Host devri doğrulanır. Diğer adapter, MIDI, UI ve idle performance regresyonları sürer.

## Kısa Live kabulü

A Host, B Follow WhiteKeys olsun. A’yı çoğaltın: aday seçimi çıkmamalı; A Host kalmalı, kopya Host kapalı olmalı, B takip etmeli. Kopya track’i A’dan önceye taşıyıp tekrar çoğaltmayı deneyin: canlı mevcut kimlik değişmemeli. Set’i kaydedip tamamen kapat/açın: seçim sorulmadan bağlantı dönmeli. Eski aynı-kimlikli Set fixture’ında ilk native cihaz kimliği/Host tercihini korumalı. Follower, Rack ve track kopyalarında gam/Black Keys ve basılı nota çıktısı korunmalı.

Bu revizyonun gerçek Live sonucu: **Not run**. Simülasyon native Live kanıtı değildir.
