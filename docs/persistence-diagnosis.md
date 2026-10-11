# Kayıt ve çoğaltma teşhisi — 2026-10-11

Üretim kayıt hatası düzeltildi. Paylaşım kimliği doğrulaması tamamlanmadı: #19 ve #22 açık, #20–#21 başlatılmadı. Üretim Host devre dışı.

## Neden

Eski teknik prototipe `setvalueof(1)` verilmesi `undefined` gam/kimlik ve geçersiz Root üretti. Gerçek Live Set kaydında liste yerine yalnız sürüm sayısı vardı. Üretim cihazı bozuk kaydı reddederek varsayılanlara döndüğü için özel gam, Scale Source ve Black Keys kayboluyordu.

Max pattr metnindeki `@parameter_enable 1` yeterli değildi: `saved_object_attributes.parameter_enable=1` da gerekiyor. Ayrıca `parameter_invisible=2` (Hidden) yerine `1` (Stored Only) kullanılmalı. Üretim patch ve AMXD bu iki ayarla düzeltildi; MIDI ve model JS değiştirilmedi.

Kaynak: [pattr referansı](https://docs.cycling74.com/reference/pattr/) ve [pattr kılavuzu](https://docs.cycling74.com/userguide/pattr/).

## Gerçek Live kanıtı

Deneyler ayrı `WhiteKeys Acceptance 2026-10-11.als` test Set’inde yapıldı.

| Probe | Ayar | Kaydet/aç sonucu |
|---|---|---|
| A | Eski yapı | Listenin yerine `[1]` |
| B | Kaydedilmiş enable=1, Hidden | Düzenleme kayboldu, başlangıç değeri geldi |
| C | Enable=1, Stored Only | Düzenlenmiş listenin tamamı geri geldi |

Üretimin dört JS dosyasını aynen kullanan test kopyaları karşılaştırıldı. Fixture düğmeleri mevcut UI fonksiyonlarını çağırdı; normal menü etkileşimi kabul edilmiş sayılmadı.

| Ayar | Eski patch | Düzeltilmiş patch |
|---|---|---|
| Local / F Custom 8 nota / Black Keys ignore | Follow Live / C Major / passthrough’a döndü | Üç ayar da korundu |
| Follow Live / Black Keys ignore | Önceki karşılaştırmada ayar kaybı | Follow Live ve ignore korundu |

Düzeltilmiş v1 paylaşım probe’da normal Host çoğaltması yeni kimlik ve Host OFF verdi. Takipçi kopyası hedef kaynağı korudu. Üç cihazın kimlikleri, hedefleri ve 8 notalı gamları kaydet/aç sonrası korundu; undefined oluşmadı. Bu kanıt aynı track ve normal yükleme sırası içindir.

## Kimlikte kalan konu

Eski collision algoritması VM deneyinde kopya önce kaydolunca asıl cihazın kimliğini değiştirip Host’u kapatıyor. Normal Live çoğaltmasının geçmesi tüm sıraların güvenli olduğunu kanıtlamıyor.

`live.object` persistent self-reference kopyada kopyanın kendisine eşlendi; tek başına asıl/kopya ayrımı sağlamadı. [Referans](https://docs.cycling74.com/reference/live.object).

Ayrı v2 sahiplik deneyi kaydedilmiş sahip runtime ID ile copy-first VM testini geçti. Live’da kopya farklı kimlik aldı; 8 notalı gam ve kimlikler Live kapatılıp test Set’i açılınca bu örnekte korundu. Max sürecinin tamamen soğuk başlangıcı, başka Set/track/Rack, farklı yükleme sırası ve adayın Host ON döngüsü doğrulanmadı. Aday üretime aktarılmadı ve kalıcı kimlik çözümü olarak kabul edilmedi.

## Otomatik kanıt ve sınır

`test-persistence.py` önce eksik enable alanında başarısız oldu, düzeltmeden sonra geçti. Bu serileştirme sınırı testi gerçek Live döngüsünden ayrıdır. State 550, MIDI 4833 assertion; UI ve paket bütünlük kontrolleri geçti. Teknik restore testi 1 geçerli ve 11 geçersiz girdiyi doğruladı.

Yerel deney kaynakları `work/persistence-debug/`, paylaşım restore düzeltmesi `outputs/whitekeys-sharing-technical-prototype/` altında; üretim paketi değildir.

#19 Set izolasyonu, süreklilik, yükleme sırası ve çoğaltma matrisi tamamlanmadan geçmez. #20–#21 bekliyor; #22 tam Live/MIDI kabulünden önce kapatılmaz. Yalnız sürüm sayısı saklanmış eski Set’lerde kaybolmuş özel gam geri üretilemez; ayarlar yeniden kurulup düzeltilmiş cihazla kaydedilmelidir.
