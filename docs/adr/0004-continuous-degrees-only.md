---
status: accepted
---
# Continuous Degrees tek eşleme davranışı olsun

Kullanıcının seçtiği yön, Mode menüsünü ve mod durum açıklamasını kaldırarak Continuous Degrees’i bütün gamlar için tek davranış yapmaktır. Yedi notalı gamlarda iki yaklaşım aynı MIDI eşlemesini üretir; diğer uzunluklarda Octave Anchored zaten Continuous Degrees’e döndüğü için ayrı tercih sonuç değiştirmeden arayüzü ve kayıt modelini karmaşıklaştırır. Bu karar ADR 0001’in mod tercihi, varsayılan mod ve fallback hükümlerini; ADR 0002’nin manuel mod değişimi hükmünü ve ADR 0003’ün Mode satırı yerleşimini tasarım düzeyinde geçersiz kılar; mevcut kod uygulama adımına kadar eski davranışı taşır; diğer hükümler korunur.

## Kesinleşen kapsam

- Mode menüsü, etiketi ve mod durum açıklaması kaldırılır. Boşalan alan Apply ve çalan gam bilgisini rahatlatmak için kullanılır; arayüz İngilizce kalır.
- Continuous Degrees 1–12 farklı pitch class için tek eşlemedir. MIDI 60 seçili Root’un 60 + Root değerine eşlenir; aşağı ve yukarı yönde aynı derece dizisi devam eder. MIDI 0–127 dışındaki sonuçlar bastırılır.
- Eski v2/v3 kayıtlar okunur. Mod tercihi artık davranışı etkilemez; yeni kayıtlar mod tercihi taşımaz.
- Draft Scale ile Sounding Scale ayrılığı, Apply, Follow Live, Root’un taslaktaki davranışı ve Root’un çıkarılamaması korunur.
- Gerçek Live kabul testi kullanıcı tarafından yapılır. Bu tasarım aşaması kodu değiştirmez.

## Onaylanan ayrıntılar

- Yeni kayıt sürümü v4 olur; v2/v3 yalnız okunur ve sonraki normal Set kaydında v4 yazılır. Root, gam adı/üyeliği, Draft/Sounding ayrılığı, Follow Live ve Black Keys eksiksiz korunur. Yeni v4 kayıtların eski cihaz sürümleriyle açılması desteklenmez; eski sürüme dönebilmek için eski Set kopyası gerekir.
- Panel 360×169 ve Scale Keyboard 332×62 kalır. Apply ayrı, rahat erişilen satıra; Playing ayrı bilgi satırına yerleşir. Continuous Degrees için yeni bir sabit etiket eklenmez.

## Kabul kriterleri

1. Mode menüsü, etiketi ve effective/fallback açıklaması bulunmaz; panelin bütün görünür kontrolleri 360×169 sınırına sığar.
2. Yedi notalı gamlarda tüm MIDI girişleri ve 12 Root için önceki sürümle aynı nota çıktısı alınır; 1–12 notalı gamların mevcut Continuous Degrees çıktısı korunur.
3. Sekiz notalı gamda MIDI 60’tan başlayan C D E F G A B üst-C derece 1–8’i, üst-D sonraki oktavın derece 1’ini çalar. Referans altındaki beyaz tuşlarda dizi tutarlı devam eder.
4. V2 ve v3 kayıt örnekleri korunmuş durumla açılır; v3’ün her iki mod tercihi aynı MIDI sonucunu verir. Yeni kayıt mod tercihi içermez; yeni formatın kaydet/yükle döngüsü durum kaybı yaratmaz. Geçersiz kayıt doğrulaması gevşetilmez.
5. Taslak düzenleme çalan gamı değiştirmez; Apply yalnız yerel taslağı etkinleştirir. Follow Live otomatik güncellenir; açılması taslağı bırakıp güncel Live gamını benimser.
6. Apply, Root ve Live değişimleri sırasında basılı notalar özgün note-on hedeflerine doğru kanalda kapanır; velocity, tekrarlı notalar, Black Keys, audition ve Panic davranışları korunur.
7. MIDI sınırı dışındaki sonuçlar bastırılır; bunların note-off mesajları yanlış bir notayı kapatmaz.
8. Uygulamada TDD, mevcut MIDI/durum regresyonları, güncellenmiş paket bütünlüğü kontrolü ve son kod incelemesi tamamlanır. Gerçek Live’da görünürlük, eski Set açma/kaydetme ve çalma kabulünü kullanıcı doğrular.

2026-10-11: Kullanıcının anlık düzenleme kararıyla Draft/Apply hükümleri [ADR 0005](0005-immediate-scale-editing-and-sharing.md) tarafından güncellenmiştir. Son kapsam, incelemeye sunulan anlık gam/paylaşım spec’inde tanımlanır. Üretim kodu henüz değiştirilmemiştir.
