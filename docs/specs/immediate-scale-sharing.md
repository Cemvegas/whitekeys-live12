# WhiteKeys Live 12 — Anlık gam düzenleme, Host paylaşımı ve gam tanıma

> 2026-10-11 sonraki kullanıcı kararı: Manuel kimlik seçimi kaldırılmıştır. İlgili eski hükümler yerine [otomatik kimlik çözümü değişikliği](automatic-identity-resolution.md) ve workspace ADR 0008 uygulanır.

Durum: İnceleme taslağı · 2026-10-11. Kullanıcı davranış kararları onaylıdır; paylaşımın teknik yöntemi doğrulama bekler. Bu belge üretim kodu, ticket veya GitHub yayını oluşturmaz.

## Problem Statement

Mode seçimi mevcut MIDI sonucunu değiştirmeden arayüzü sıkıştırıyor. Apply, oyuncunun düzenlediği notaları duymasını geciktiriyor. Birden fazla kanaldaki WhiteKeys cihazlarında aynı gamı ayrı ayrı ayarlamak gerekiyor; nota seçiminin bilinen bir gam oluşturduğunu oyuncu kendisi buluyor. Amaç, tek ve doğrudan eşleme ile düzenleme yapmak, seçilen kaynak cihazın gamını paylaşmak ve gam adını güvenilir biçimde tanımak.

## Solution

360×169 panelde A prototipinin düzeni ve renkleri kullanılır; 332×62 Scale Keyboard korunur. Mode, fallback açıklaması, Draft ve Apply kaldırılır. Local düzenlemeleri anında Sounding Scale olur. Continuous Degrees bütün 1–12 notalı gamlarda tek eşlemedir.

Scale Source, Local / Follow Live / Follow WhiteKeys seçimlerini sunar. Panic yanında bağımsız Host anahtarı vardır. Host açık cihazlar kendi Sounding Scale bilgilerini aynı Set içindeki takipçilere sunar. Kaynak listesi kanal ve cihaz adını gösterir; bağlantı görünür isimden bağımsız kimlikle tutulur.

Yerel nota seçimi, mevcut Root üzerinde desteklenen bir gamla tam eşleştiğinde Scale adını günceller. Başka Root eşleşmeleri Scale menüsünün ayrı bölümünde kullanıcıya sunulur; otomatik Root değişimi yapılmaz.

## User Stories

1. Bir oyuncu olarak tek eşleme davranışı kullanmak istiyorum; böylece sonuç değiştirmeyen bir mod seçmek zorunda kalmam.
2. Bir oyuncu olarak 1–12 notalı gamların bütün derecelerini beyaz tuşlarda çalmak istiyorum; böylece yedi notadan uzun gamlarda derece kaybetmem.
3. Bir oyuncu olarak seçtiğim notayı hemen duymak istiyorum; böylece Apply beklemem.
4. Bir oyuncu olarak Root'un gam içinde kalmasını istiyorum; böylece geçersiz boş gam oluşturmam.
5. Bir oyuncu olarak Root'u değiştirince yerel gamın hemen transpoze olmasını istiyorum; böylece yeni ton merkezinde çalayım.
6. Bir oyuncu olarak notalarım bilinen bir gamla eşleşince adını görmek istiyorum; böylece seçimin müzikal karşılığını anlayayım.
7. Bir oyuncu olarak başka Root yorumlarını seçebilmek istiyorum; böylece aynı nota kümesini farklı ton merkezinde kullanayım.
8. Bir oyuncu olarak Live'ın güncel gamını takip etmek istiyorum; böylece Live seçimlerini tekrar girmem.
9. Bir oyuncu olarak bir WhiteKeys cihazını Host yapmak istiyorum; böylece gamını diğer kanallara paylaşayım.
10. Bir oyuncu olarak Host'un Live'ı takip ederken paylaşabilmesini istiyorum; böylece bir kaynak üzerinden güncelleyeyim.
11. Bir oyuncu olarak kaynağı kanal ve cihaz adıyla seçmek istiyorum; böylece doğru Host'u ayırt edeyim.
12. Bir oyuncu olarak birden fazla Host arasından açıkça seçim yapmak istiyorum; böylece yanlış kaynağa bağlanmam.
13. Bir oyuncu olarak Host'un gam düzenlemesini takipçilerde hemen kullanmak istiyorum; böylece bütün kanallar aynı gamda kalsın.
14. Bir oyuncu olarak takipçi modunda gam düzenlemesinin kapalı olmasını istiyorum; böylece kaynaktan gelen gamla yerel düzenleme çakışmasın.
15. Bir oyuncu olarak Local'a dönünce son aldığım gamı korumak istiyorum; böylece bu gam üzerinden düzenlemeye devam edeyim.
16. Bir oyuncu olarak takipçiyken Host açınca Local'a geçmek istiyorum; böylece döngü oluşturmadan kaynak olayım.
17. Bir oyuncu olarak Host kapanınca son gamı çalmak istiyorum; böylece performans kesilmesin.
18. Bir oyuncu olarak kaynağın bulunamadığını görmek istiyorum; böylece güncellemelerin neden gelmediğini anlayayım.
19. Bir oyuncu olarak aynı Host geri gelince takibin sürmesini istiyorum; böylece yeniden seçim yapmam.
20. Bir oyuncu olarak kanal veya cihaz adını değiştirince bağlantının korunmasını istiyorum; böylece isim değişikliği performansı bozmasın.
21. Bir oyuncu olarak Set açılışında kayıtlı Host'un bulunmasını istiyorum; böylece kaynak yükleme sırasına bağlı yanlış eşleşme oluşmasın.
22. Bir oyuncu olarak cihaz kopyasının yeni kimlik ve Host kapalı başlamasını istiyorum; böylece yanlışlıkla ikinci kaynak oluşturmayayım.
23. Bir oyuncu olarak aynı Set'teki takipçi kopyasının kaynağını korumasını istiyorum; böylece yeni kanalı hızlıca ekleyeyim.
24. Bir oyuncu olarak başka Set'e kopyalanan cihazın yanlış kaynağa bağlanmamasını istiyorum; böylece aynı isimli farklı Host'lar karışmasın.
25. Bir oyuncu olarak eski Set'in çalan gamının korunmasını istiyorum; böylece uygulanmamış eski taslak performansı değiştirmesin.
26. Bir oyuncu olarak gam veya kaynak değişirken basılı notaların doğru kapanmasını istiyorum; böylece takılı notalar oluşmasın.
27. Bir oyuncu olarak Black Keys, audition ve Panic'in cihazımda bağımsız kalmasını istiyorum; böylece diğer kanalların performansına müdahale etmem.
28. Bir oyuncu olarak bütün kontrollerin Live panelinde görünmesini istiyorum; böylece kırpılmış menü veya düğmelerle karşılaşmam.

## Implementation Decisions

### Eşleme ve Sounding Scale

- Sounding Scale atomik olarak Root (0–11), sıralı ve tekrarsız Root'a göre aralıklar (0–11, ilk aralık 0) ve görüntülenen addan oluşur. Üyelik 1–12 notadır. Ayrı taslak yoktur.
- MIDI 60'ın beyaz tuş derece indeksi 0'dır. Fiziksel beyaz tuşlar aşağı/yukarı yönde yedili fiziksel tuş dizisi boyunca numaralanır; seçili gamın derece sayısına göre dizinin her tamamlanışında ses yüksekliği 12 yarım ses ilerler. Negatif yönde floor bölme kullanılır. MIDI 60 çıktısı 60 + Root olur.
- Çıktı 0–127 dışında ise yeni nota bastırılır; nota hedefini sınır içine sıkıştırma veya oktav kaydırma yapılmaz.
- Yerel Root değişimi aralıkları korur, mutlak notaları transpoze eder. Alternatif Root/gam seçimi ise mutlak pitch class kümesini korur. Bu iki işlem ayrı davranışlardır.
- Root üyelik tıklaması etkisizdir; diğer notalar tek tek eklenir/çıkarılır ve sonuç hemen uygulanır. Host açıkken ara düzenleme adımları da paylaşılır.

### Kaynak ve Host geçişleri

| İşlem | Sonuç |
|---|---|
| Local seç | Son Sounding Scale korunur; yerel düzenleme açılır. |
| Follow Live seç | Yerel düzenleme kapanır; hazırsa güncel Live gamı atomik alınır. Host açık kalabilir. |
| Follow WhiteKeys kaynağı seç | Host kapanır; yerel düzenleme kapanır; kaynak hazırsa gamı alınır. |
| Follower üzerinde Host aç | Kaynak takibi bırakılır; son gamla Local olunur ve paylaşım açılır. |
| Local/Follow Live üzerinde Host aç | Scale Source değişmez; çalan gam paylaşılır. |
| Host kapat | Scale Source ve Sounding Scale değişmez; cihaz listeden çıkar. |
| Kaynak kapanır/silinir | Kaynak referansı ve son gam korunur; Source unavailable görünür. |
| Aynı kaynak geri gelir | Kaynak seçimi değişmeden güncel gam benimsenir. |

- Kendi kendine takip ve Host/Follower zinciri desteklenmez. Kaynak olabilmek için Host açık ve Scale Source Local veya Follow Live olmalıdır. Host kapatma mevcut takipçilerin kaynak kimliğini silmez.
- Birden fazla Host olduğunda kullanıcı seçer; ilk bulunan Host'a otomatik bağlanma yapılmaz. Kaynak seçmeden Follow WhiteKeys açılması son gamı tutar ve Select a Host durumunu gösterir; Host kapalıdır.
- Yeni cihaz, mevcut varsayılan kaynak davranışını koruyarak Follow Live ve Host kapalı başlar. Live hazır değilken varsayılan C Major korunur, Live unavailable gösterilir. Bu son-gamı-koru kuralı Follow Live bağlantı kaybı için de geçerlidir; mevcut bağlantı kaybında susturma davranışı bu kapsamda değiştirilir.
- Root/Scale ve üyelik düzenleme yalnız Local'da açıktır. Audition, Black Keys ve Panic kaynak seçiminden bağımsız kullanılabilir.
- Paylaşılan veri yalnız gamın Root, üyelik ve adıdır. Black Keys, MIDI kanal/velocity, basılı nota kayıtları, audition ve Panic paylaşılmaz.

### Gam tanıma

- Katalog mevcut cihazın gamlarını kapsar: Major, Minor, Dorian, Mixolydian, Lydian, Phrygian, Locrian, Harmonic Minor, Melodic Minor, Major Pentatonic, Minor Pentatonic ve Whole Tone. Tanıma tam küme eşitliğidir; benzerlik veya eksik nota tahmini yoktur.
- Local düzenleme sonrası seçili Root'taki eşleşme ad olur; eşleşme yoksa Custom olur. Root otomatik değiştirilmez. Birden fazla katalog adı aynı aralıklara karşılık gelirse mevcut katalog sırası deterministik önceliktir.
- Scale menüsünde mevcut Root için normal gam seçenekleri ve ayrı Also matches bölümü bulunur. Alternatif etiket Root + Scale adını içerir; mevcut Root eşleşmesi alternatif olarak tekrarlanmaz. Alternatifler Root sırası, ardından katalog sırasıyla listelenir.
- Alternatif seçimi Root, aralıklar ve adın tek güncellemesidir; mutlak pitch class kümesi değişmez. Seçili Root'un referans nota eşlemesi değişebilir; basılı nota hedefleri değişmez.
- Follow kaynaklarından gelen Root ve üyelik değiştirilmez; kaynak adı aktarılır. Tanıma yerel düzenleme/adlandırma içindir, Live'ın bilinmeyen gam adını otomatik ezmez. Local'a geçilince katalog tanıması güncel üyeliğe uygulanır.

### Arayüz

- A prototipi bilgi hiyerarşisini ve renklerini belirler; tarayıcı dışındaki laboratuvar düğmeleri ve tanılama alanları ürüne taşınmaz. HTML prototipinde dışarıda duran Host seçimi gerçek cihazda 360×169 içinde tamamlanmalıdır.
- Panel #292e2c, ana metin #d8ded9; kontrol zemini #424b45, kenar #657168, metin #dce3dd; aktif Host #b7d2a7 ve koyu metin #203021. Beyaz tuşlar #828c86, seçili tuşlar #d0dcca; Root vurgusu #e0b471; seçili siyah tuşlar #789968.
- Scale Source seçimi, Host ve Panic görünür üst kontrollerdir; kaynak seçimi Follow WhiteKeys menüsündeki Host girdilerinden yapılabilir. Kaynak etiketi kanal + cihaz adıdır; aynı adlarda cihaz sırası ile ayrıştırılır. Uzun etiketler panelde kısaltılabilir, menüde tam etiket erişilebilir olmalıdır.
- Keyboard 332×62 kalır. Root, Scale, Black Keys, nota sayısı ve Playing/bağlantı bilgisi görünürdür. Mode, Apply, Draft veya fallback satırı bulunmaz. Host durumu yalnız renkle değil açık/kapalı kontrol durumuyla anlaşılır.
- Following: kaynak adı, Source unavailable, Live unavailable ve Select a Host durumları gösterilir. Durum nedeniyle Playing gamı kaybolmaz; son gam bilgisine erişim korunur. Piksel yerleşimi uygulamada Max ölçümüyle kesinleştirilir.

### Kayıt şeması ve geçiş

Yeni kayıt sürümü v4'tür. Mantıksal alan sözleşmesi aşağıdadır; pattr taşıma biçimi uygulamada seçilir, bu alanların anlamını değiştiremez.

| Alan | Tip / kural |
|---|---|
| version | Tam sayı 4 |
| deviceIdentity | Kalıcı, boş olmayan cihaz kimliği; geçici LiveAPI ID veya görünür isim değildir |
| setIdentity | Kaynak referansının ait olduğu Set bağlamı; geçici LiveAPI ID kalıcı Set kimliği olarak kabul edilmez |
| sourceKind | Local / Live / WhiteKeys |
| hostEnabled | Boolean; WhiteKeys kaynağında false olmalıdır |
| sourceReference | WhiteKeys için kaynak Set ve cihaz kimliği; diğer kaynaklarda boş |
| sourceLabel | İsteğe bağlı son bilinen etiket; bağlantı anahtarı değildir |
| soundingRoot | Tam sayı 0–11 |
| soundingMask | Tam sayı 1–4095; Root'a göre bit 0 açık |
| soundingName | Görüntülenen gam adı |
| blackKeys | Pass / Ignore |

- Yeni kayıtta mod tercihi, Draft veya Apply durumu yoktur. Bağlantı hazır değilken kullanılacak son Sounding Scale saklanır; basılı nota ve audition durumu saklanmaz.
- V2/v3 doğrulaması gevşetilmez. Geçerli eski kayıtların active/sounding Root, üyelik ve Black Keys bilgisi alınır; draft alanları ve v3 mod tercihi etkinleştirilmez. Eski Follow flag yeni Local/Live seçimine çevrilir. Host kapalı, kaynak referansı boş, yeni cihaz kimliğiyle başlar.
- Geçiş sonrası Local adlandırması üyeliğe göre tanınır. Eski Follow Live açıksa önce kayıtlı son gam tutulur; Live hazır olduğunda güncel Live gamı gelir.
- Yeni v4 kayıt eski sürümlerde açılma garantisi taşımaz. Geri dönüş eski cihaz ve geçiş öncesi Set kopyasıyla yapılır. Kullanıcı eylemi veya normal Set kaydı dışında Set'e zorla kayıt yazılmaz.
- Geçersiz sürüm/Root/maske/kaynak birleşimi atomik reddedilir; kısmi state veya geçersiz MIDI konfigürasyonu oluşturulmaz. Geçersiz v4 kayıt kullanıcı tarafından geçerli biçimde düzeltilmeden kaynak olarak yayımlanmaz.

### Paylaşım sözleşmesi ve kimlik

- Kaynak güncellemesi aynı Set kapsamındaki kalıcı kaynak kimliği, oturum nesli, sıralı revision ve atomik gam snapshot'ı taşır. Follower yalnız seçili kaynak ve güncel oturumun geçerli güncellemelerini benimser; geç gelen/eski veya bozuk paket mevcut gamı bozmaz.
- Yeniden adlandırma etiketi değiştirir, kimliği değiştirmez. Silinen kaynağın yerine aynı isimle yeni cihaz eklemek otomatik yeniden bağlamaz. Aynı kaynağın yeniden erişilebilir olması kimlikle belirlenir.
- Set yeniden açılışında yükleme sırası bağımsızdır. Follower önce yüklenirse son gamı çalar; kayıtlı Host hazır olduğunda bağlanır. Kimlik çözümü başarısızsa yanlış eşleşme yerine Source unavailable gösterilir.
- Aynı Set'te kopyalanan cihaz yeni kimlik ve Host kapalı başlar; Follower kaynak referansını korur. Başka Set'te kaynak referansı sessizce yeniden yorumlanmaz. Kaynak yoksa son gam korunur.
- Uygulama transport seçimi henüz onaylı değildir. Teknik prototipte Global, pattr, 250 ms polling ve geçici LiveAPI Set kapsamı kullanılması ürün mimarisi kararı veya gecikme hedefi değildir.

### Paylaşım uygulamasından önce doğrulama koşulu

Aşağıdakiler gerçek Live kanıtıyla çözümlenmeden paylaşım transportu/kimlik yöntemi kesinleşmiş sayılmaz ve paylaşım üretim uygulaması hazır ticket olarak ele alınmaz:

1. Ayrı cihazlar aynı Set'te keşif ve gam güncellemesi yapabiliyor; başka Set verisi sızmıyor.
2. Geçici LiveAPI ID yerine kalıcı kaynak referansı Set kapat/aç ve farklı yükleme sıralarında doğru cihaza çözülüyor.
3. Cihaz çoğaltma ile aynı cihazın Set yeniden açılışı ayrıştırılıyor; orijinal kimlik korunuyor, kopya yeni kimlik ve Host kapalı alıyor. Yalnız canlı çakışma kontrolü yeterli kanıt değildir.
4. Kanal/cihaz adı değişikliği, Host kapatma, silme ve geri gelme davranışları doğru; eski kayıtlar yanlış Host'a bağlanmıyor.
5. Geçerli güncelleme nota işleme akışını bloke etmiyor; güncelleme atomik ve eski güncellemeye dayanıklı.

Kanıt raporu Live/Max sürümü, test adımı ve Passed/Failed/Not run içerir. Başarısız durumda yöntem iyileştirilir veya karar kullanıcıyla yeniden açılır. Kullanıcının “uygundur” yanıtı prototip yaklaşımının onayıdır; test sonucu olarak sayılmaz. Arayüz, anlık düzenleme ve tanıma işleri bu doğrulamadan bağımsız ilerleyebilir.

### Modül sınırları

Mevcut cihaz durum modeli, Scale Keyboard görünümü, MIDI işleyicisi, Live gözlemci adaptörü ve paket bütünlüğü kontrolü güncellenir. Paylaşım adaptörü durum modeline kaynak keşif/kayıp/gam olaylarını iletir; MIDI işleyicisi transport veya kimlik bilmez. Model bütün kaynaklar için tek Sounding Scale konfigürasyonu üretir. Tanıma katalog ve üyelik üzerinden deterministik hesaplanır. Prototip tanılama kodu üretime kopyalanmaz.

## Testing Decisions

Ana test sınırı mevcut mesaj senaryolarıdır: kullanıcı/kaynak/kayıt olayları girilir; görünür durum ve gerçek MIDI mesaj çıktısı doğrulanır. Ayrı transport ayrıntılarına bağımlı testler yerine aynı sınırda birden fazla cihaz modeli ve kontrollü keşif/kayıp/güncelleme olayları kullanılır. Mevcut MIDI ve durum testleri örnek alınır. Bu test sınırı spec incelemesiyle birlikte onaya sunulur.

### Otomatik kabul kriterleri

- AC01: 1–12 uzunluk, 12 Root ve bütün MIDI notaları için Continuous Degrees eşlemesi; referans altı negatif derece/oktav, sekiz notalı üst-C derece 8 ve üst-D sonraki Root örnekleri doğrulanır. Yedi notalı önceki çıktı aynıdır.
- AC02: Local nota/Root/Scale değişimi ek eylem olmadan sonraki note-on çıktısını değiştirir; Root çıkarma etkisiz, nota sayısı hiçbir zaman 0 veya 12 üstü değildir.
- AC03: Her katalog gamı ve Root için tam eşleşme, Custom eşleşmezlik, belirsiz modal alternatifler ve deterministik sıra doğrulanır. Alternatif seçimi mutlak pitch class kümesini korur.
- AC04: Kaynak/Host geçiş tablosunun her satırı doğrulanır; takip sırasında yerel mutasyon reddedilir; kendine takip/döngü oluşturulmaz.
- AC05: Kaynak kaybı sonrası son gamla note-on devam eder, kaynak seçimi korunur, aynı kaynak dönüşünde güncellenir; farklı kimlik/Set veya eski revision kabul edilmez.
- AC06: Çoklu takipçi aynı gamı alır; Black Keys, audition ve Panic cihazlar arasında yayılmaz.
- AC07: Gam/Root/kaynak değişimi, kaynak kaybı ve alternatif Root seçimi sırasında basılı ve tekrarlı notalar özgün hedeflerine doğru kanalda kapanır; velocity, running status ve mevcut MIDI edge-case çıktıları korunur.
- AC08: MIDI sınırı dışındaki bastırılmış note-on'a ait note-off başka hedefi kapatmaz; Panic yerel aktif notaları kapatır.
- AC09: Geçerli v2/v3 örnekleri Sounding Scale'i korur, uygulanmamış taslağı kullanmaz; iki v3 mod tercihi aynı sonucu verir. Follow Live hazır olunca güncel kaynak kazanır.
- AC10: V4 kaydet/yükle kaynak, kimlik, Host, gam ve Black Keys alanlarını korur. Bozuk kayıt kısmi state oluşturmaz; çoğaltma olay senaryoları onaylanan politikayı izler. Simüle çoğaltma testi gerçek Live kimlik kanıtının yerine geçmez.
- AC11: Kaynak menüsü ad değişimini gösterir, kimliği korur; aynı adlar ayrıştırılır; kaybolan seçili kaynak görünür kalır, başka Host otomatik seçilmez.
- AC12: AMXD payload ile kaynak patch aynı; yerel JS bağımlılıkları eksiksiz; görünür bütün kontroller 360×169, klavye 332×62; Mode/Apply/Draft kontrolleri yok. Paket ve durum şeması kontrolleri güncellenir.

### Gerçek Live kabulü — kullanıcı

- HC01: A renkleri, okunaklılık, Host/Source/Root/Scale/Black Keys/Panic ve Playing durumları yerel panelde kırpılmadan görünür. Uzun kaynak etiketleri ve Also matches menüsü kullanılabilir.
- HC02: İki ve daha fazla cihazda Host gam değişimi takipçilere gider; kaynak kapatma/geri açma, rename ve yanlış kaynağa bağlanmama doğrulanır.
- HC03: Set kayıt/açılış, kaynak önce/sonra yüklenmesi, Host ve Follower çoğaltma, başka Set'e kopyalama için kimlik koşulları kanıtlanır.
- HC04: Eski Set geçişi ve yeni Set yeniden açılışında doğru gam duyulur; basılı notalar, audition, Panic, Black Keys ve MIDI sınır davranışı gerçek enstrümanla denenir.

Uygulama TDD ile dış davranış dilimleri halinde yapılır; son kod incelemesi spec ve kod standartları üzerinden yürütülür. Otomatik kontrollerin geçmesi gerçek Live kabulünü kapatmaz.

## Out of Scope

Başka üreticilerin plugin'leri; farklı Live Set'ler veya ağ üzerinden gam paylaşımı; Host zinciri ve çoklu kaynak birleştirme; otomatik Root tahmini; yaklaşık gam tanıma; kullanıcı gam kataloğu yönetimi; mikrotonalite; undo geçmişi; global Panic; prototip laboratuvarı; eski cihaz sürümleriyle v4 kayıt uyumluluğu. Arayüzde Draft/Apply geri getirilmez.

## Further Notes

- ADR 0001'in Continuous Degrees matematiği ve yedi notalı uyumluluk hükümleri korunur; mod tercihi/fallback kalkar.
- ADR 0002'nin Draft/Apply ve yerel düzenlemelerin Follow Live'dan otomatik çıkması hükümleri kaldırılır; basılı nota güvenliği korunur.
- ADR 0003'ün 169 px sınırı ve 332×62 klavyesi korunur; Mode/Apply satırları yeni kontrollere yer verir.
- ADR 0004'ün v4 yönü ve tek eşlemesi korunur; Draft/Apply kayıt ve UI hükümleri bu spec ve ADR 0005 ile değiştirilir.
- ADR 0005 davranış yönünü kaydeder; transport ve kimlik yöntemi halen açık teknik doğrulama konusudur.
- Mevcut görsel ve teknik prototipler referanstır. Teknik prototip için bildirilen çalışma sonucu yoktur; verdict NOT RUN. Görsel onay gerçek Max/Live testinin yerine geçmez.
- Sonraki aşama kullanıcı spec onayından sonra /to-tickets, ardından /implement-spec'tir. Paylaşım doğrulaması ayrı bağımlılık olur; bağımsız işler buna gereksiz yere bağlanmaz. Bu aşamada yayım veya uygulama yapılmamıştır.
