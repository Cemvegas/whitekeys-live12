# WhiteKeys Live 12 — Anlık gam düzenleme, Host paylaşımı ve gam tanıma

> 2026-10-11 sonraki kullanıcı kararı: Manuel kimlik seçimi kaldırılmıştır. İlgili eski hükümler yerine [otomatik kimlik çözümü değişikliği](automatic-identity-resolution.md) ve workspace ADR 0008 uygulanır.

Durum: Güncellenmiş spec · 2026-10-11. Tek aktif Host, otomatik Follow WhiteKeys ve sarı Host düğmesi kullanıcı talebidir. ADR 0007, ADR 0005’in çoklu Host ve manuel kaynak seçimi hükümlerini değiştirir; ADR 0006 kimlik çakışmasında önceliklidir. Bu revizyonun uygulaması ve gerçek Live kabulü henüz tamamlanmış değildir.

## Problem Statement

Mode seçimi mevcut MIDI sonucunu değiştirmeden arayüzü sıkıştırıyor. Apply, oyuncunun düzenlediği notaları duymasını geciktiriyor. Birden fazla kanaldaki WhiteKeys cihazlarında aynı gamı ayrı ayrı ayarlamak gerekiyor; nota seçiminin bilinen bir gam oluşturduğunu oyuncu kendisi buluyor. Host yanındaki çarpı ve etkinliği anlaşılmayan düğme kullanımı belirsizleştiriyor; Follow WhiteKeys içinde ayrıca Host seçmek gereksiz bir adım oluşturuyor. Amaç, tek ve doğrudan eşleme ile düzenleme yapmak, Set’in tek aktif Host’unun gamını otomatik paylaşmak ve gam adını güvenilir biçimde tanımak.

## Solution

360×169 panelde A prototipinin düzeni ve renkleri kullanılır; 332×62 Scale Keyboard korunur. Mode, fallback açıklaması, Draft ve Apply kaldırılır. Local düzenlemeleri anında Sounding Scale olur. Continuous Degrees bütün 1–12 notalı gamlarda tek eşlemedir.

Scale Source, Local / Follow Live / Follow WhiteKeys seçimlerini sunar. Panic yanında, bütün yüzeyine tıklanabilen tek Host düğmesi vardır; çarpı kaldırılır, aktif Host sarı gösterilir. Set başına en fazla bir aktif Host vardır. Başka cihazda Host açıldığında önceki Host kapanır ve mevcut Follower’lar yeni Host’a otomatik bağlanır. Follow WhiteKeys seçimi ayrıca Host seçtirmez. Aktif kaynağın kanal ve cihaz adı durum satırında gösterilir; bağlantı görünür isimden bağımsız kimlikle tutulur. Kimlik çakışmasında ADR 0006’nın tek seferlik kullanıcı seçimi korunur.

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
11. Bir oyuncu olarak Follow WhiteKeys seçince Set’in aktif Host’una otomatik bağlanmak istiyorum; böylece ikinci bir kaynak seçimi yapmayayım.
12. Bir oyuncu olarak başka cihazı Host yaptığımda önceki Host’un kapanmasını ve Follower’ların yeni Host’a geçmesini istiyorum; böylece Set’te tek paylaşım kaynağı olsun.
13. Bir oyuncu olarak Host'un gam düzenlemesini takipçilerde hemen kullanmak istiyorum; böylece bütün kanallar aynı gamda kalsın.
14. Bir oyuncu olarak takipçi modunda gam düzenlemesinin kapalı olmasını istiyorum; böylece kaynaktan gelen gamla yerel düzenleme çakışmasın.
15. Bir oyuncu olarak Local'a dönünce son aldığım gamı korumak istiyorum; böylece bu gam üzerinden düzenlemeye devam edeyim.
16. Bir oyuncu olarak takipçiyken Host açınca Local'a geçmek istiyorum; böylece döngü oluşturmadan kaynak olayım.
17. Bir oyuncu olarak Host kapanınca son gamı çalmak istiyorum; böylece performans kesilmesin.
18. Bir oyuncu olarak kaynağın bulunamadığını görmek istiyorum; böylece güncellemelerin neden gelmediğini anlayayım.
19. Bir oyuncu olarak aynı Host geri gelince takibin sürmesini istiyorum; böylece yeniden seçim yapmam.
20. Bir oyuncu olarak kanal veya cihaz adını değiştirince bağlantının korunmasını istiyorum; böylece isim değişikliği performansı bozmasın.
21. Bir oyuncu olarak Set açılışında kayıtlı Host'un bulunmasını istiyorum; böylece kaynak yükleme sırasına bağlı yanlış eşleşme oluşmasın.
22. Bir oyuncu olarak kimlik çakışmasında mevcut kimliği koruyacak cihazı bir kez seçmek istiyorum; böylece diğer kopyalar yeni kimlik ve Host kapalı alırken kayıtlı takipçiler seçtiğim kaynağı izlesin.
23. Bir oyuncu olarak aynı Set'teki takipçi kopyasının kaynağını korumasını istiyorum; böylece yeni kanalı hızlıca ekleyeyim.
24. Bir oyuncu olarak başka Set'e kopyalanan cihazın yanlış kaynağa bağlanmamasını istiyorum; böylece aynı isimli farklı Host'lar karışmasın.
25. Bir oyuncu olarak eski Set'in çalan gamının korunmasını istiyorum; böylece uygulanmamış eski taslak performansı değiştirmesin.
26. Bir oyuncu olarak gam veya kaynak değişirken basılı notaların doğru kapanmasını istiyorum; böylece takılı notalar oluşmasın.
27. Bir oyuncu olarak Black Keys, audition ve Panic'in cihazımda bağımsız kalmasını istiyorum; böylece diğer kanalların performansına müdahale etmem.
28. Bir oyuncu olarak bütün kontrollerin Live panelinde görünmesini istiyorum; böylece kırpılmış menü veya düğmelerle karşılaşmam.

29. Bir oyuncu olarak normal Set açılışında Host ve Follower bağlantılarımın otomatik dönmesini istiyorum; böylece her açılışta kaynak seçmeyeyim.
30. Bir oyuncu olarak kimlik çakışmasını açıkça görmek istiyorum; böylece paylaşımın neden durduğunu anlayayım.
31. Bir oyuncu olarak çakışan cihazları kanal, cihaz ve konum bilgisiyle ayırt etmek istiyorum; böylece mevcut kimliği doğru cihazda koruyayım.
32. Bir oyuncu olarak çakışma çözülürken son gamla çalmaya devam etmek istiyorum; böylece performans kesilmesin.
33. Bir oyuncu olarak seçimimi Set ile kaydetmek istiyorum; böylece sonraki açılışlarda aynı soruyu yanıtlamayayım.
34. Bir oyuncu olarak çözümlenmemiş çakışmanın kayıttan sonra da görünmesini istiyorum; böylece cihaz sessizce yanlış kaynağa bağlanmasın.
35. Bir oyuncu olarak çakışmanın yalnız ilgili kimliğin paylaşımını durdurmasını istiyorum; böylece yerel MIDI ve çakışmadan etkilenmeyen aktif Host çalışmaya devam etsin.
36. Bir oyuncu olarak Host düğmesine doğrudan basmak ve etkin olduğunda sarı görmek istiyorum; böylece küçük bir çarpıyı hedeflemeden durumunu anlayayım.
37. Bir oyuncu olarak hiç Host yokken son gamı koruyup Waiting for Host görmek istiyorum; böylece Host açılınca takip kendiliğinden başlasın.
38. Bir oyuncu olarak Host devrinden sonra eski kaynağın gecikmiş güncellemelerinin reddedilmesini istiyorum; böylece gam eski Host’a geri dönmesin.
39. Bir oyuncu olarak kayıttan gelen birden fazla Host talebinin yükleme sırasıyla çözülmemesini istiyorum; böylece hangi cihazı Host yapacağımı açıkça belirleyeyim.
40. Bir oyuncu olarak otomatik Host değişiminin kimlik çakışması seçimini atlamamasını istiyorum; böylece kopyalardan yanlış olanına bağlanmayayım.

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
| Follow WhiteKeys seç | Cihazın Host rolü kapanır; yerel düzenleme kapanır; Set’in tek geçerli aktif Host’una otomatik bağlanılır. |
| Follower üzerinde Host aç | Takip bırakılır; son gamla Local olunur ve tek aktif Host rolü bu cihaza geçer. |
| Local/Follow Live üzerinde Host aç | Scale Source değişmez; tek aktif Host rolü bu cihaza geçer. |
| Başka cihaz Host olur | Önceki Host kapanır; onun Scale Source ve gamı korunur. Mevcut Follower’lar yeni Host’un gamını otomatik alır. Önceki Host kendiliğinden Follower yapılmaz. |
| Aktif Host kapat/sil | Follower’lar son gamı ve son kaynak referansını korur; Waiting for Host görünür. |
| Aynı Host geri gelir veya kullanıcı başka cihazı Host yapar | Geçerli aynı Set kaynağı hazır olduğunda takip otomatik başlar; elle Host seçilmez. |

- Set başına en fazla bir aktif Host vardır. Başka cihazdaki açık Host eylemi bir rol devridir; eski rol kaldırılıp yeni rol tek tutarlı sonuç olarak yayımlanır. Follower’lar yalnız yeni Host’un güncel oturumunu kabul eder.
- Eşzamanlı açık Host talepleri tutarlı bir sırada işlenir; son kabul edilen açık kullanıcı eylemi kazanır. Tekrar iletilen aynı eylem ikinci devir yaratmaz. Keşif veya yükleme sırası kullanıcı eylemi sayılmaz.
- Normal kayıttan tek Host dönünce yükleme sırasından bağımsız otomatik takip başlar. Eski kayıtlarda farklı kimliklerle birden fazla Host talebi varsa rastgele biri seçilmez: paylaşım bekler, Host conflict gösterilir. Kullanıcının istediği cihazda Host’a bir kez basması diğer talepleri kapatır. Bu rol seçimi, aynı kimlik çakışmasındaki ADR 0006 seçiminin yerine geçmez.
- Kendi kendine takip ve Host/Follower zinciri desteklenmez. Host yalnız Local veya Follow Live ile paylaşabilir. Follow WhiteKeys hiçbir manuel Host menüsü veya Select a Host adımı içermez.
- Kimlik çakışması otomatik bağlantı ve rol devrinden önce gelir. Çakışmadan etkilenen Follower son gamda bekler; başka Host’a geçerek bu engeli atlayamaz. Çözüm sonrası korunan kimliğin takibi ADR 0006’ya göre sürer; daha sonraki açık Host devri yeni geçerli kaynağa geçirebilir.
- Yeni cihaz Follow Live ve Host kapalı başlar. Live hazır değilken varsayılan C Major korunur, Live unavailable gösterilir. Follow Live bağlantı kaybında son gam korunur.
- Root/Scale ve üyelik düzenleme yalnız Local’da açıktır. Audition, Black Keys ve Panic kaynak seçiminden bağımsızdır.
- Paylaşılan veri yalnız gamın Root, üyelik ve adıdır. Black Keys, MIDI kanal/velocity, basılı nota kayıtları, audition ve Panic paylaşılmaz.

### Gam tanıma

- Katalog mevcut cihazın gamlarını kapsar: Major, Minor, Dorian, Mixolydian, Lydian, Phrygian, Locrian, Harmonic Minor, Melodic Minor, Major Pentatonic, Minor Pentatonic ve Whole Tone. Tanıma tam küme eşitliğidir; benzerlik veya eksik nota tahmini yoktur.
- Local düzenleme sonrası seçili Root'taki eşleşme ad olur; eşleşme yoksa Custom olur. Root otomatik değiştirilmez. Birden fazla katalog adı aynı aralıklara karşılık gelirse mevcut katalog sırası deterministik önceliktir.
- Scale menüsünde mevcut Root için normal gam seçenekleri ve ayrı Also matches bölümü bulunur. Alternatif etiket Root + Scale adını içerir; mevcut Root eşleşmesi alternatif olarak tekrarlanmaz. Alternatifler Root sırası, ardından katalog sırasıyla listelenir.
- Alternatif seçimi Root, aralıklar ve adın tek güncellemesidir; mutlak pitch class kümesi değişmez. Seçili Root'un referans nota eşlemesi değişebilir; basılı nota hedefleri değişmez.
- Follow kaynaklarından gelen Root ve üyelik değiştirilmez; kaynak adı aktarılır. Tanıma yerel düzenleme/adlandırma içindir, Live'ın bilinmeyen gam adını otomatik ezmez. Local'a geçilince katalog tanıması güncel üyeliğe uygulanır.

### Arayüz

- A prototipinin bilgi hiyerarşisi, 360×169 panel ve 332×62 Scale Keyboard korunur. Laboratuvar kontrolleri ürüne taşınmaz; manuel Host seçim menüsü kaldırılır.
- Panel #292e2c, ana metin #d8ded9; kontrol zemini #424b45, kenar #657168, metin #dce3dd. Aktif Host sarı #f2c94c, koyu metin #203021 olur. Beyaz tuşlar #828c86, seçili tuşlar #d0dcca; Root #e0b471; seçili siyah tuşlar #789968.
- Host yanındaki çarpı kaldırılır. Host yazısı ve düğmenin tamamı aynı açık/kapalı eylemini çalıştırır. Etkinlik yalnız renkle değil kontrolün açık/kapalı durumuyla da anlaşılır. Bekleyen veya çakışma nedeniyle paylaşamayan kayıtlı Host tercihi aktif sarı olarak gösterilmez.
- Scale Source yalnız Local / Follow Live / Follow WhiteKeys seçeneklerini sunar. Following: kanal + cihaz adı bilgi satırıdır; kaynak seçme kontrolü değildir. Uzun adlar kısaltılabilir; tam etiket erişilebilir kalır ve bağlantı anahtarı olarak kullanılmaz.
- Root, Scale, Black Keys, nota sayısı ve Playing bilgisi görünürdür. Mode, Apply, Draft veya fallback satırı bulunmaz.
- Following: kaynak adı, Waiting for Host, Host conflict, Identity conflict ve Live unavailable durumları görünürdür. Son gam bilgisi durum mesajları nedeniyle kaybolmaz. ADR 0006 aday seçimi yalnız kimlik çakışmasında sunulur; normal takipte seçim istenmez.

### Kayıt şeması ve geçiş

Yeni kayıt sürümü v4'tür. Mantıksal alan sözleşmesi aşağıdadır; pattr taşıma biçimi uygulamada seçilir, bu alanların anlamını değiştiremez.

| Alan | Tip / kural |
|---|---|
| version | Tam sayı 4 |
| deviceIdentity | Kalıcı, boş olmayan cihaz kimliği; geçici LiveAPI ID veya görünür isim değildir |
| setIdentity | Kaynak referansının ait olduğu Set bağlamı; geçici LiveAPI ID kalıcı Set kimliği olarak kabul edilmez |
| sourceKind | Local / Live / WhiteKeys |
| hostEnabled | Boolean; WhiteKeys kaynağında false olmalıdır |
| sourceReference | WhiteKeys için otomatik yönetilen kaynak Set ve cihaz kimliği; henüz Host yoksa boş olabilir, kayıpta son referans korunur; diğer kaynaklarda boş |
| sourceLabel | İsteğe bağlı son bilinen etiket; bağlantı anahtarı değildir |
| soundingRoot | Tam sayı 0–11 |
| soundingMask | Tam sayı 1–4095; Root'a göre bit 0 açık |
| soundingName | Görüntülenen gam adı |
| blackKeys | Pass / Ignore |

- Tek aktif Host rolü ve otomatik Follower referansları normal Set kaydıyla korunur. Eski çoklu Host kayıtlarının güvenli bekleme davranışı korunur; kayıt yüklenmesi açık Host eylemi üretmez. Gerekli kayıt metadata’sı uygulamada belirlenir; v4 doğrulaması ve eski kayıt geçişi korunur.
- Yeni kayıtta mod tercihi, Draft veya Apply durumu yoktur. Bağlantı hazır değilken kullanılacak son Sounding Scale saklanır; basılı nota ve audition durumu saklanmaz.
- V2/v3 doğrulaması gevşetilmez. Geçerli eski kayıtların active/sounding Root, üyelik ve Black Keys bilgisi alınır; draft alanları ve v3 mod tercihi etkinleştirilmez. Eski Follow flag yeni Local/Live seçimine çevrilir. Host kapalı, kaynak referansı boş, yeni cihaz kimliğiyle başlar.
- Geçiş sonrası Local adlandırması üyeliğe göre tanınır. Eski Follow Live açıksa önce kayıtlı son gam tutulur; Live hazır olduğunda güncel Live gamı gelir.
- Yeni v4 kayıt eski sürümlerde açılma garantisi taşımaz. Geri dönüş eski cihaz ve geçiş öncesi Set kopyasıyla yapılır. Kullanıcı eylemi veya normal Set kaydı dışında Set'e zorla kayıt yazılmaz.
- Geçersiz sürüm/Root/maske/kaynak birleşimi atomik reddedilir; kısmi state veya geçersiz MIDI konfigürasyonu oluşturulmaz. Geçersiz v4 kayıt kullanıcı tarafından geçerli biçimde düzeltilmeden kaynak olarak yayımlanmaz.

### Paylaşım sözleşmesi ve kimlik

- Kaynak güncellemesi aynı Set kapsamındaki kalıcı kaynak kimliği, oturum nesli, sıralı revision ve atomik gam snapshot'ı taşır. Follower yalnız otomatik bağlandığı aktif kaynak ve güncel oturumun geçerli güncellemelerini benimser; geç gelen/eski veya bozuk paket mevcut gamı bozmaz.
- Yeniden adlandırma etiketi değiştirir, kimliği değiştirmez. Silinen kaynağın yerine aynı isimle yeni cihaz eklemek tek başına yeniden bağlamaz. Kullanıcının yeni cihazı açıkça Host yapması ise aynı Set içinde geçerli bir rol devridir; farklı kimliğe otomatik geçiş bu eylemle yetkilendirilir. Aynı kaynağın yeniden erişilebilir olması kimlikle belirlenir.
- Set yeniden açılışında yükleme sırası bağımsızdır. Follower önce yüklenirse son gamı çalar; kayıtlı Host hazır olduğunda bağlanır. Host yoksa Waiting for Host; çakışma varsa uygun conflict durumu gösterilir, yanlış eşleşme yapılmaz.
- Aynı kalıcı kimliği taşıyan cihazlar çakışırsa ilgili kimliğin paylaşımı durur, son gam çalmaya devam eder. Kullanıcı mevcut kimliği ve Host rolünü koruyacak cihazı bir kez seçer; diğer cihazlar yeni kimlik ve Host kapalı alır. Mevcut Follower referansları korunan kimliği izler; Follower kopyaları kaynak referansını korur. Çözüm normal Set kaydıyla kalıcılaşır; çözülmemiş çakışma yeniden açılışta çözüm bekler. Çakışmadan etkilenmeyen tek aktif Host’un paylaşımı ve yerel MIDI etkilenmez. Başka Set'te kaynak referansı sessizce yeniden yorumlanmaz. Kaynak yoksa son gam korunur.
- Uygulama transport seçimi henüz onaylı değildir. Teknik prototipte Global, pattr, 250 ms polling ve geçici LiveAPI Set kapsamı kullanılması ürün mimarisi kararı veya gecikme hedefi değildir.

### Çakışma çözümünün dış davranışı

- Çakışma, aynı Set kapsamındaki aynı kalıcı kimliği birden fazla mevcut cihazın talep etmesidir. Tek cihazın hazır olmaması çakışma değildir. Runtime ID, kayıt sırası, isim veya süre aşımı kimliği kimin koruyacağına karar vermez.
- Çakışma tespit edildiğinde ilgili kimlikten gam kabulü ve yayımı durur. Son Sounding Scale ve basılı nota hedefleri korunur. Eski oturumdan gelen paketler çözümden sonra da reddedilir.
- Cihaz panelinde Identity conflict ve mevcut kimliği koruyacak cihazı seçme eylemi sunulur. Adaylar kanal + cihaz adı ve gerekirse Rack/chain/cihaz konumuyla ayrıştırılır. Bu etiketler bağlantı anahtarı değildir; seçim geçerli oturumdaki belirli cihaza yönelir. Liste yenilenir; kaybolmuş aday veya eski çakışma için seçim uygulanmaz.
- Seçim tek bir tutarlı sonuç üretir: seçilen cihaz eski kimliği ve kayıtlı Host tercihini korur; diğer adayların her biri farklı yeni kimlik ve Host kapalı alır. Seçilen cihaz Follower ise Host açılmaz ve kaynak seçimi korunur. Çakışma çözümü kendi başına yeni Host devri yaratmaz. Kayıtlı Host tercihi korunur; paylaşım tekrar başlamadan tek aktif Host koşulu uygulanır. Farklı kimliklerin çelişen Host talepleri varsa ayrı Host conflict beklemesi sürer.
- Bütün kimlik güncellemeleri tutarlı biçimde tamamlanmadan ilgili paylaşım yeniden başlamaz. Tekrar gönderilen seçim tekrar kimlik tahsis etmez; eşzamanlı seçimler birden fazla sahip yaratmaz. Aday grubu değişirse kullanıcı güncel gruptan yeniden seçim yapar.
- Follower’lar eski kimliği koruyan kaynağı izler; yeni kimlikli kopyaya sessizce taşınmaz. Kopyaların son gamı, Black Keys ve kaynak referansı korunur; kendini takip eden geçersiz bir birleşim yayımlanmaz.
- Seçimin ve yeni kimliklerin v4 kayıtları normal Set kaydına dahil edilir. Zorunlu otomatik Set kaydı yoktur. Çözülmemiş çakışmanın kayıtları korunur; yeniden açılışta güvenli çakışma durumuna döner.
- Başka Set'e taşınan cihaz mevcut Set'in kaynak referansını kendi bağlamına çeviremez. Aynı etiket veya runtime sayısı kaynak eşitliği sağlamaz. Set izolasyonunu sağlayan gerçek adapter ayrıca kanıtlanır.

### Gerçek Live kanıtı ve kabul sınırı

Keşif, kalıcı kimlik, Set izolasyonu, yeniden açılış, kimlik çakışması ve MIDI güvenliği gerçek Live’da ayrıca doğrulanır. Otomatik simülasyon native Live kanıtı değildir. Önceki #19 kapanışı bu yeni tek Host ve sarı düğme revizyonunun kabulü sayılmaz. Bu revizyon için aşağıdaki Live kriterleri Passed olmadan üretim kabulü tamamlanmış sayılmaz; denenmeyen koşullar Not run kalır. Mevcut teşhis çalışmaları korunur; bu davranış güncellemesi yeni transport, koordinatör veya teşhis mimarisi gerektirmez.

### Modül sınırları

Mevcut cihaz durum modeli, Scale Keyboard görünümü, MIDI işleyicisi, Live gözlemci adaptörü ve paket bütünlüğü kontrolü güncellenir. Paylaşım adaptörü durum modeline kaynak keşif/kayıp/gam olaylarını iletir; MIDI işleyicisi transport veya kimlik bilmez. Model bütün kaynaklar için tek Sounding Scale konfigürasyonu üretir. Tanıma katalog ve üyelik üzerinden deterministik hesaplanır. Prototip tanılama kodu üretime kopyalanmaz.

## Testing Decisions

Ana test sınırı mevcut mesaj senaryolarıdır: kullanıcı/kaynak/kayıt olayları girilir; görünür durum ve gerçek MIDI mesaj çıktısı doğrulanır. Ayrı transport ayrıntılarına bağımlı testler yerine aynı sınırda birden fazla cihaz modeli ve kontrollü keşif/kayıp/güncelleme olayları kullanılır. Mevcut MIDI ve durum testleri örnek alınır. Kullanıcı bu sınırı 2026-10-11 tarihinde onayladı: önce otomatik kod testleri, ardından kullanıcının gerçek Live çoğaltma ve Set kapat/aç denemesi. Mevcut Scale Keyboard → durum modeli → MIDI mesaj senaryoları ve kayıt parametresi kontrolleri örnek alınır. Kontrollü adapter olayları native Live kanıtı değildir; testler registry iç yapısını veya rastgele kimliğin biçimini değil dış davranışı doğrular.

### Otomatik kabul kriterleri

- AC01: 1–12 uzunluk, 12 Root ve bütün MIDI notaları için Continuous Degrees eşlemesi; referans altı negatif derece/oktav, sekiz notalı üst-C derece 8 ve üst-D sonraki Root örnekleri doğrulanır. Yedi notalı önceki çıktı aynıdır.
- AC02: Local nota/Root/Scale değişimi ek eylem olmadan sonraki note-on çıktısını değiştirir; Root çıkarma etkisiz, nota sayısı hiçbir zaman 0 veya 12 üstü değildir.
- AC03: Her katalog gamı ve Root için tam eşleşme, Custom eşleşmezlik, belirsiz modal alternatifler ve deterministik sıra doğrulanır. Alternatif seçimi mutlak pitch class kümesini korur.
- AC04: Kaynak/Host geçiş tablosunun her satırı doğrulanır; takip sırasında yerel mutasyon reddedilir; kendine takip/döngü oluşturulmaz.
- AC05: Kaynak kaybı sonrası son gamla note-on devam eder, kaynak seçimi korunur, aynı kaynak dönüşünde güncellenir; yetkilendirilmiş Host devri dışındaki farklı kimlik, başka Set veya eski revision kabul edilmez.
- AC06: Çoklu takipçi aynı gamı alır; Black Keys, audition ve Panic cihazlar arasında yayılmaz.
- AC07: Gam/Root/kaynak değişimi, kaynak kaybı ve alternatif Root seçimi sırasında basılı ve tekrarlı notalar özgün hedeflerine doğru kanalda kapanır; velocity, running status ve mevcut MIDI edge-case çıktıları korunur.
- AC08: MIDI sınırı dışındaki bastırılmış note-on'a ait note-off başka hedefi kapatmaz; Panic yerel aktif notaları kapatır.
- AC09: Geçerli v2/v3 örnekleri Sounding Scale'i korur, uygulanmamış taslağı kullanmaz; iki v3 mod tercihi aynı sonucu verir. Follow Live hazır olunca güncel kaynak kazanır.
- AC10: V4 kaydet/yükle kaynak, kimlik, Host, gam ve Black Keys alanlarını korur. Bozuk kayıt kısmi state oluşturmaz; normal yeniden açılışta kimlik/Host durumu korunur ve kaynak hazır olduğunda manuel seçim olmadan takip başlar. Simüle çoğaltma testi gerçek Live kimlik kanıtının yerine geçmez.
- AC11: Follow WhiteKeys tek aktif Host’a manuel seçim olmadan bağlanır; Follower önce veya sonra yüklense aynı sonuç oluşur. Rename etiketini günceller, kimlik korunur; eş adlı farklı cihaz yalnız isim nedeniyle benimsenmez. Host yokken son gam ve Waiting for Host korunur; Host hazır olunca otomatik bağlanılır.
- AC12: AMXD payload ile kaynak patch aynı; yerel JS bağımlılıkları eksiksiz; görünür bütün kontroller 360×169, klavye 332×62; Mode/Apply/Draft ve Host çarpısı/manuel Host menüsü yok. Host düğmesinin bütün yüzeyi aynı eyleme yönlenir; yalnız aktif Host sarıdır, kapalı/engellenmiş durum sarı değildir. Paket ve durum şeması kontrolleri güncellenir; native tıklama ve renk ayrıca Live’da doğrulanır.

- AC13: İki ve üç aynı kimlikli cihaz için bütün kayıt sıraları ilgili paylaşımı durdurur; otomatik sahip seçilmez. Follower yeni snapshot kabul etmez, son gam ve note-on/note-off devam eder; çakışmadan etkilenmeyen aktif Host ve yerel MIDI etkilenmez.
- AC14: Her aday ayrı ayrı seçildiğinde yalnız seçilen cihaz mevcut kimliği ve kayıtlı Host tercihini korur. Diğerleri benzersiz yeni kimlik/Host kapalı alır. Mevcut Follower’lar eski kimliği izler; Follower kopyasının kaynak referansı ve yerel tercihleri korunur.
- AC15: Seçim sonrası tüm cihazların kaydet/yükle turunda çözüm korunur, yükleme sırası ve değişen runtime sayıları yeniden seçim gerektirmez. Çözülmeden kaydet/yükle çakışmayı yeniden gösterir; bozuk kayıt çözüm sayılmaz.
- AC16: Tekrar seçim, eşzamanlı iki seçim, silinen aday, yeni aday ve eski oturumdan gelen seçim tutarlı sonuç verir; bir kimliğe iki sahip veya kısmi çözüm yayımlanmaz. Son gam ve basılı nota güvenliği korunur.
- AC17: Hazır olmayan tek kaynak çakışma sorusu üretmez; hazır olduğunda otomatik bağlanır. Yeniden adlandırma ve runtime sayısı değişimi kalıcı kimliği değiştirmez. Başka Set veya yalnız aynı etiketi taşıyan farklı kaynak sessizce benimsenmez; aynı Set’te açık Host devri yeni kimliğe bağlantıyı yetkilendirir.
- AC18: Çakışma durumu ve aday seçimi 360×169 panelden erişilebilir, eş adlı adaylar ayrıştırılır; çözüm sonrası normal kaynak durumu geri gelir. Çözülmemiş durum kayıt sırasında gizlenmez.


- AC19: Local ve Follow Live kaynaklı Host A’dan Host B’ye açık rol devrinde A kapanır, B tek aktif/sarı Host olur; bütün mevcut Follower’lar B’nin atomik gamını alır. A kaynak türü ve gamını korur, kendiliğinden Follower olmaz. B önceden Follower ise son gamıyla Local’a geçer. A’nın sonraki/eski oturum snapshot’ları Follower gamını değiştirmez.
- AC20: Tekrarlı ve eşzamanlı Host aç/kapat olayları hiçbir dış durumda iki aktif Host yayımlamaz; son kabul edilen açık talep kazanır. Devir ve kaynak kaybı sırasında basılı notalar özgün hedeflerine kapanır.
- AC21: Farklı kimlikli çoklu Host tercihleriyle kayıt yükleme bütün sıralarda Host conflict ve son gamı korur; yükleme sırasından kazanan çıkarılmaz. Bir cihazda açık Host eylemi tek rolü belirler; kaydet/yükle sonrası otomatik takip döner.
- AC22: Etkilenen kimlik çakışmasında yeni Host keşfi veya Host düğmesi ADR 0006 beklemesini atlamaz; Follower başka kaynağa kaçmaz. Açık kimlik seçimi eski referansları korur, kopyalar Host kapalı olur; çözüm sonrası tek Host şartı sağlanır.
- AC23: Mevcut üretim paylaşım adaptörü testinde iki gerçek cihaz script’i kontrollü LiveAPI keşif olaylarıyla çalıştırılır; Host ilanı Follower tarafından görülür, otomatik bağlantı/devir ve gam çıktısı doğrulanır. Keşif işareti/paket bağımlılıklarıyla ilgili mevcut regresyon kapsamı korunur; sahte LiveAPI sonucu gerçek Live başarısı olarak sunulmaz.

### Gerçek Live kabulü — beş kısa senaryo

Hazırlığı ve otomatik kontrolleri ajan yapar; kullanıcıdan yalnız gerekli fiziksel işlemler istenir. A ve B ile keşif doğrulanmadan çoğaltmaya geçilmez. Devir için C ayrı kimlikli cihaz olarak hazırlanır; aynı kimlikli duplicate bu hazırlığın yerine kullanılmaz.

| Kriter | Kısa işlem ve beklenen sonuç |
|---|---|
| HC01 · Aç ve takip et | A’da Host düğmesine bas: çarpı yok, düğme sarı. B’de Follow WhiteKeys seç: ayrıca Host seçmeden A görünür ve A’nın gam değişimini takip eder. |
| HC02 · Host devret | C’de Host aç: A kapanır, yalnız C sarıdır, B otomatik C’yi takip eder. A’yı değiştirmek B’yi etkilemez. Basılı nota devirden sonra doğru kapanır. |
| HC03 · Kapat ve geri aç | C’de aynı Host düğmesine bas: sarı söner; B son gamda kalıp Waiting for Host gösterir. C’de tekrar aç: B seçim istemeden yeniden takip eder. |
| HC04 · Kaydet ve aç | Set’i kaydet, Live’ı tamamen kapat/aç: tek Host ve otomatik takip geri gelir, soru çıkmaz. Kaynak yüklenene kadar son gam korunur; Follower önce yüklenme koşulu gözlenmediyse o alt sonuç Not run olur. |
| HC05 · Kimlik çakışması | Aktif Host’u çoğalt: Identity conflict, ilgili paylaşım durur, son gam çalar; otomatik kopya seçilmez veya başka Host’a kaçılmaz. Koruyacak cihazı bir kez seç: diğer kopya Host kapalı, B korunan kimliği izler. Kaydet/kapat/aç sonrası soru tekrarlanmaz. Çözülmeden kaydedilen ayrı fixture yeniden açıldığında conflict kalır. |

Önceki kabulün v2/v3 geçişi, Rack/track/Follower çoğaltması, eş adlı adaylar, aday değişimi, başka Set izolasyonu, Black Keys/audition/Panic ve gerçek enstrümanla MIDI güvenliği kapsamı kaldırılmaz. Ajan mevcut kanıtları bu revizyona karşı kontrol eder; etkilenen veya kanıtsız koşulları kısa fixture adımlarıyla ayrıca doğrular ve Not run olanları tamamlandı saymaz. Bu ek regresyonlar beş ana senaryonun geçtiği iddiasıyla örtülmez.

Her kriter için Live/Max sürümü, fixture, beklenen/gözlenen sonuç ve Passed/Failed/Not run kaydedilir. Otomatik sonuç ve önceki revizyonun kabulü bu revizyonun Live sonucu sayılmaz. Computer Use ile tekrarlı tıklama denemeleri yapılmaz; gerekli fiziksel işlem kısa ve açık verilir.

Uygulama TDD ile dış davranış dilimleri halinde yapılır; son kod incelemesi spec ve kod standartları üzerinden yürütülür. Otomatik kontrollerin geçmesi gerçek Live kabulünü kapatmaz.

## Out of Scope

Başka üreticilerin plugin'leri; farklı Live Set'ler veya ağ üzerinden gam paylaşımı; birden fazla eşzamanlı aktif Host, manuel Follow WhiteKeys Host seçimi, Host zinciri ve çoklu kaynak birleştirme; otomatik Root tahmini; yaklaşık gam tanıma; kullanıcı gam kataloğu yönetimi; mikrotonalite; undo geçmişi; global Panic; prototip laboratuvarı; eski cihaz sürümleriyle v4 kayıt uyumluluğu. Arayüzde Draft/Apply geri getirilmez. Çakışmada özgün/kopya ayrımını otomatik tahmin etmek, her normal açılışta manuel kaynak seçimi ve yardımcı koordinatör cihazını onaysız kapsam içine almak kapsam dışıdır.

## Further Notes

- ADR 0001'in Continuous Degrees matematiği ve yedi notalı uyumluluk hükümleri korunur; mod tercihi/fallback kalkar.
- ADR 0002'nin Draft/Apply ve yerel düzenlemelerin Follow Live'dan otomatik çıkması hükümleri kaldırılır; basılı nota güvenliği korunur.
- ADR 0003'ün 169 px sınırı ve 332×62 klavyesi korunur; Mode/Apply satırları yeni kontrollere yer verir.
- ADR 0004'ün v4 yönü ve tek eşlemesi korunur; Draft/Apply kayıt ve UI hükümleri bu spec ve ADR 0005 ile değiştirilir.
- ADR 0007, ADR 0005’in çoklu Host ve manuel kaynak seçimi ile eski Host renk/gösterim hükümlerini değiştirir. ADR 0005’in diğer davranışları korunur; kimlik çakışmasında ADR 0006 önceliklidir. Otomatik özgün/kopya ayrımı kabul şartı kaldırılmıştır; otomatik normal restore ve yanlış kaynağa bağlanmama korunur.
- Mevcut commit edilmemiş teşhis ve üretim çalışmaları korunur. Bu revizyon şartname ve kabul kriterlerini günceller; otomatik test kodu veya cihaz uygulamasının tamamlandığı iddiasını taşımaz.
- GitHub’da #19 kapanmıştır; bu spec yayını #19’u yeniden açmaz veya önceki kabulü yeni revizyona taşımaz. #20–#22’nin uygulama, kayıt ve kabul kapsamı yeni sözleşmeye uyarlanır; Host düğmesi için önceki arayüz kapsamıyla ilişki belirtilir. #22 bu revizyonun gerçek Live kabulü tamamlanmadan kapanmaz. ADR 0006’daki dönemsel uygulama durum notu tarihsel bağlamdır; kimlik davranış kararı aynen geçerlidir.
- Sonraki adım /to-tickets ile mevcut ticket’ların kapsamını ve bağımlılıklarını güncellemektir; bu spec yayını ticket’ları çözülmüş veya uygulamayı tamamlanmış saymaz.
