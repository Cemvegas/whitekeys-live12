# Üretim cihazı yüklenince Live'ın yavaşlaması — 2026-10-11

## Gerçek belirti ve tekrar sinyali

Kullanıcı #20–#21 üretim AMXD'sini track'e yükleyince Live'ın aşırı yavaşlayıp kilitlendiğini bildirdi. Çalışan Live 12.4.6 sürecinden iki saniyelik salt okunur `sample` alındı. Ana iş parçacığındaki 793 örneğin 701'i `jsliveapi_constructor` içinde: %88.4. Örnek `MaxPlugLib → main-thread scheduler → JavaScript → LiveAPI constructor` yolunu gösteriyor. Ham profil kullanıcı makinesinin geçici klasöründe tutuldu; repo veya test paketine dahil edilmedi.

Tek komutla tekrar değerlendirme:

```
python3 docs/performance-diagnosis/profile-live.py --sample-file /private/tmp/whitekeys-live-slow-20261011.sample.txt --check
```

Sonuç: `FAIL: native construction monopolizes Live UI`, oran `0.884`. Bu tarihsel kaydın yeniden analizi deterministiktir; kod değişince tarihsel kaydın sonucu değişmez. Canlı tekrar için aynı araç `--pid <Live PID> --check` ile yeni profil alır. İkinci canlı örnek alınamadan Live süreci kapanmıştı. Yeniden açılıp düzeltilmiş cihaz yüklenmeden native kabulün geçtiği söylenemez.

## Minimizasyon ve hipotezler

`node test-sharing-performance.cjs`, üretim adapterinin gerçek `init → Task.tick` çağrı yolunu bir track ve tek WhiteKeys/tek enrollment parametresine indirir. Native API sınırında nesne tahsisi ve model mesajları sayılır; fixture'ın Node süreleri gerçek Live hız ölçümü değildir.

Önce iki kez aynı başarısız sonuç alındı: 20 boşta yoklamada 140 ek LiveAPI nesnesi. Sıralı hipotezler: (1) sürekli native nesne oluşturma, (2) değişmeyen parametre adlarının yeniden taranması, (3) değişmeyen model/panel durumunun yeniden gönderilmesi. Her biri ayrı değişken olarak sınandı. İlk hipotez doğrudan native profildeki baskın yol ile eşleşti.

## Düzeltme ve regresyon

Adapter mevcut native handle'ları kullanır; geçersiz ID yeniden bağlanır, census'tan çıkan nesne referansları ayrılır, dispose bütün handle'ları bırakır. Parametre adı aynı native handle için tekrar okunmaz. Bağlam/kaynak listesi/seçici/durum değişmeden panel mesajı gönderilmez; model kaydı tekrar yüklendiğinde mesaj önbelleği sıfırlanır. Snapshot ve kullanıcı kimlik çözümü mesajları bastırılmaz; census sıklığı, kayıt barajı ve açık keeper seçimi değiştirilmedi.

Aynı 20 yoklamalık döngünün son sonucu: **0 ek native nesne, 0 tekrar parametre adı sorgusu, 0 değişmeyen panel mesajı**. 64 parametreli başka bir cihaz eklendiğinde de warm döngüde bu üç sayı sıfırdır. Yeniden init'te yeni native handle alınması ayrıca doğrulanır. Host/Follower/çakışma/foreign-first/eski seçim/restore regresyonları yeniden çalıştırılır.

Bu, ölçülmüş native nesne oluşturma fırtınasının kod yolunu kaldırır. Düzeltilmiş paketin gerçek Live'da yüklenmesi ve yeni profil karşılaştırması henüz beklemededir. #20–#21 ve #22 gerçek Live kabulü yapılmadan kapatılmaz.

Geçici debug logları eklenmedi. Profil aracı bu açıkça işaretlenmiş teşhis klasöründe kalır; üretim bundle'ına raw profile veya yeni teşhis altyapısı eklenmez.
