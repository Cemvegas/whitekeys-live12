---
status: accepted
---
# Anlık gam düzenleme, Host paylaşımı ve gam tanıma

2026-10-11: Kullanıcı A prototipinin düzenini ve renklerini, Mode ve Apply’ın kaldırılmasını, Continuous Degrees’in tek davranış olmasını, yerel değişikliklerin anında uygulanmasını ve Panic yanında ayrı Host düğmesini seçti. Bu yön ADR 0002’nin Draft/Apply ayrılığını ve ADR 0004’ün bu ayrılığı koruyan kapsam, kayıt ve yerleşim hükümlerini değiştirir; üretim kodu bu aşamada değişmez. HTML prototipi görsel referanstır, gerçek Live iletişimi veya kalıcı kimlik sürekliliği için kanıt değildir.

## Kesinleşen kapsam

- Scale Source seçenekleri Local, Follow Live ve Follow WhiteKeys olur. Yalnız Host açık WhiteKeys cihazları kaynak listesinde kanal + cihaz adıyla gösterilir.
- Yerel nota üyeliği, Root ve gam seçimi anında Sounding Scale’i günceller. Root çıkarılamaz. Mode ve Apply kontrolleri bulunmaz.
- Root sabitken cihazın desteklediği bilinen gamla tam eşleşme Scale adını belirler; eşleşmeyen üyelik Custom olur. Diğer Root eşleşmeleri kullanıcı seçimiyle uygulanır, mutlak pitch class kümesi korunur.
- Eski v2/v3 kayıtların yerel geçişi Sounding Scale’i esas alır; uygulanmamış taslak etkinleştirilmez. Eski Follow Live seçimi korunur ve kaynak hazır olunca güncel Live gamı benimsenir.
- MIDI 60 referansı, 1–12 nota desteği, MIDI sınırları, velocity, kanal bağımsızlığı, Black Keys, audition ve Panic korunur. Basılı notalar özgün hedeflerine kapanır.

## Onaylanan davranış kararları

Kullanıcı dört öneriyi onayladı: Follower üzerinde Host açmak son alınan gamı koruyarak Local’a geçirir; Follow WhiteKeys seçimi Host’u kapatır; Follow Live cihazı Host olabilir. Kaynak kaybında son gam ve kaynak seçimi korunur, Source unavailable görünür; aynı kaynak dönünce takip sürer. Local’a geçiş son gamı korur. Çoğaltılan cihaz yeni kimlik ve Host kapalı başlar; aynı Set’te Follower kaynağını korur. Bulunamayan kaynak başka cihaza sessizce bağlanmaz. Alternatif Root/gam eşleşmeleri Scale menüsünde ayrı bölümde sunulur.

## Teknik prototipin kanıtlaması gerekenler

Ayrı test cihazlarıyla aynı Set’te kaynak keşfi ve gam iletimi; iki Set arasında izolasyon; kalıcı cihaz kimliği ile geçici LiveAPI kimliğinin ayrılması; Set yeniden açılışı ve yükleme sırası; çoğaltma çakışması; yeniden adlandırma, silme, Host kapatma ve geri gelme. Doğrulanamayan davranışlar açıkça belirsiz kaydedilir. Gerçek Live kabulü kullanıcıya aittir.


Davranış yönü onaylıdır; kabul durumu transport veya kimlik yönteminin gerçek Live’da doğrulandığı anlamına gelmez. Uygulanabilir kapsam ve kabul kriterleri 2026-10-11 tarihli anlık gam/paylaşım spec taslağında incelemeye sunulmuştur.
