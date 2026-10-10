# T4 / #19 — Paylaşım ve kimlik doğrulama hazırlığı

Tarih: 2026-10-11. Verdict: **NOT RUN (gerçek Live)**. Üretim transportu/kimlik yöntemi onaylanmadı. Ticket #19 açık kalmalıdır; #20/#21 paylaşım ve kalıcı ilişki uygulaması bu kapıya bağlıdır. Bu rapor insan testinin yerine geçmez.

## İncelenen kanıt

Onaylı anlık gam/paylaşım spec'i ve ayrı paylaşım prototipinin JS, Max patch, README dosyaları incelendi. Prototip MIDI'yi olduğu gibi geçirir; Sounding Scale bilgisini gösterir. Follow Live adaptörü, gerçek nota eşlemesi, tam gam kataloğu, üretim revision/oturum sözleşmesi kapsam dışıdır. Üretim cihazına bu kod kopyalanmamalıdır.

Global JSON bus, 250 ms Task polling, 2 s eskime, pattr ile `[1,uid,hosting,target,root,...notes]` kaydı kullanılıyor. Görünür isim bağlantı anahtarı değil UID etiketi. Scope `live_set` LiveAPI ID'sidir; Set kimliği kayıtta yoktur. Rastgele token yalnız süreçte oluşturulur; kaynak referansı UID'dir.

## Yerel kod deneyi — gerçek Live değildir

Node VM içinde Max çağrıları taklit edilerek iki davranış doğrudan tekrarlandı:

1. Follower tick valid Host snapshot'ı aldı: root=3, notes=[0,3,7], ancak **notifyclients çağrısı=0**. Son alınan gam değişiminde pattr müşterisine değişiklik duyurusu yapılmıyor. Gerçek Set kaydının bu yüzden eski gamı kaydetmesi olasıdır; kesin Max sonucu kullanıcı testi gerektirir.
2. Kaydedilmiş orijinal UID'ye sahip cihazdan önce aynı UID kopyası registry'ye girince, orijinal tick sonunda **orijinal UID korunmadı ve Host=0** oldu. Canlı çakışma denetimi yalnız ikinci gelene yeni kimlik verir; onun kopya mı orijinal mi olduğuna dair kanıtı yoktur. Yeniden açılış/çoğaltma ayrımı çözümlenmiş değildir.

Bu deneyler yazılan algoritmanın sınırını gösterir; ses/Live çalışma başarısı iddiası değildir. Üretim kodu değiştirilmedi. Ayrı probe JS içinde yalnız follower snapshot değişiminde notifyclients eksikliği düzeltildi; aynı snapshot tekrarında bildirim yapılmaz. Gerçek pattr/Live kaydı hâlâ doğrulanmalıdır.

## Açık sorunlar

- İlk `fresh()` kimlik üretiminde notifyclients yok. Kimliğin ilk normal Set kaydına güvenilir katılması doğrulanmalı.
- `setvalueof` yalnız version=1 denetler; Root, nota sırası/tekrarı, sayı türleri ve Host+Follower birleşimi doğrulanmıyor. Bozuk kayıt prototipte güvenilir kabul senaryosu değildir.
- Follower tick gam güncellemesinde notifyclients eksikliği ayrı probe JS içinde düzeltildi (yukarıdaki deney red kanıtıdır); gerçek Set kaydı henüz doğrulanmadı.
- UUID çakışması geliş sırasına bağlı. Orijinal, yükleme sırası tersliğinde yeni UID alabilir ve takipçiler eski UID kopyasına bağlanabilir. Aynı Set'te orijinal kapalıyken kopya yüklenmesi ayrıca bilinmiyor.
- Set kapsamı anlık `live_set` ID'ye dayanıyor. UID kaydı kaynak Set'i taşımıyor; yeni Set'e kopyada aynı UID başka bağlamda bulunursa yanlış eşleşmeyi önleyecek kalıcı bağlam sözleşmesi yok.
- Registry kaydı token/time taşıyor fakat follower token'u seçili kaynak oturum nesli olarak tutmuyor; monoton revision yok. Eski güncelleme reddi kanıtlanamaz.
- Her tick label için iki LiveAPI nesnesi yaratıp ad okuyor; düşük hızlı keşif yaklaşımı nota akışını bloke etmez diye kabul edilemez. Performans ölçümü gerekir.
- `canonical_parent` Rack içindeki cihazda kanal olmayabilir; kanal+cihaz etiketi için gerçek hiyerarşi yukarı yürünmeli. Aynı adlar için sıra ayrıştırması yok.
- API hazır değilse init yalnız Waiting gösteriyor, otomatik retry yok; elle init gerekir. Yükleme sırası testi bunu saklamamalı.
- root_menu/scale_menu follower sırasında görünür ve tıklanabilir; handler mutasyonu reddeder ama gerçek disabled UI yok. Probe kapsamı üretim UI kabulünü karşılamaz.

## Birincil dokümanlardan aday yaklaşım

[Global JS API](https://docs.cycling74.com/apiref/js/global/) ortak isim alanlı veri paylaşımını tanımlar; bu tek başına kalıcı Set izolasyonu garantisi değildir.

[jsthis notifyclients/getvalueof/setvalueof](https://docs.cycling74.com/apiref/js/jsthis/) pattr istemcilerine değer değişimini bildirme sözleşmesini verir; follower değişikliklerinde bildirim eksikliği giderilmeden kayıt deneyi yanıltıcı olabilir.

[live.object Persistence](https://docs.cycling74.com/reference/live.object) “Use Persistent Mapping” ile Live belge kaydet/geri yükle ve cihaz hareketlerinde ilişki korunmasını açıklar. Doküman Live API ID'lerinin persistence özelliğiyle birlikte oturumlar arasında kullanılabildiğini de söyler. Bu nedenle bütün Live ID'lerinin koşulsuz geçici olduğu genellemesi doğru değildir. **JS'te ID sayısını pattr içine yazmak persistent mapping mekanizmasıyla eşdeğer kanıt değildir.** Kalıcı live.object referansı, cihazın kendi referansı ve kaynak referansı için ayrı probe adayıdır; çoğaltma, Rack, Set kopyalama ve kaynak silme testleri yine gerekir.

[live.thisdevice](https://docs.cycling74.com/reference/live.thisdevice) yükleme yaşam döngüsü başlangıcı için referanstır; yükleme callback'i v4 state restore ile atomik hazır olma garantisi olarak varsayılmamalıdır.

Önerilen sonraki teknik deneme: persistent mapping referansının çözülmesini, kaydedilmiş cihaz kimliğiyle birlikte çapraz kontrol eden küçük probe; duplicate/reopen ayrımını sadece canlı UID çakışmasına bırakmayan yaşam döngüsü. Yöntem adayıdır, onaylı üretim mimarisi değildir.

## Kullanıcı için kısa deneme

Üretim Set yerine ayrı deneme Set'i kullanın. Prototip AMXD ve JS yan yana kalmalı. Sürüm: Live ___ / Max ___ / macOS ___. Her satıra Passed / Failed / Not run ve gözlemi yazın. Kimlik için gerekirse Max düzenleme görünümündeki ID/Scope satırı kaydedilebilir; normal panel günlük kullanım için yeterli.

| Test | Yapılacak işlem | Beklenen sonuç | Sonuç |
|---|---|---|---|
| P1 | İki MIDI kanalına probe yükle; ilkinde Host aç; ikincide o kanalı Follow seç; Host Root/Scale değiştir | Takipçi aynı Root/notaları gösterir; ses eşleme sonucu bu testte aranmaz | Not run |
| P2 | Host kapat; en az 3 s bekle; tekrar aç | Son gam kalır; unavailable görünür; aynı kaynak dönüşünde takip sürer | Not run |
| P3 | Kanal ve cihazı yeniden adlandır | Follow etiketi yenilenir; kaynak seçimi değişmez | Not run |
| P4 | Takipçi seçiliyken Host aç | Local'a geçer; son gam korunur; kendi Host'u açılır | Not run |
| P5 | Üçüncü Host ekle; seçilmeyen Host'un gamını değiştir | Takipçi başka kaynağa geçmez | Not run |
| P6 | Host değiştikten sonra takipçiyi Local yapmadan Set kaydet; kapat/aç | Host, hedef ve son alınan gam doğru geri gelir; follower önce hazır olursa son gam bekler | Not run |
| P7 | Host'u çoğalt; takipçiyi çoğalt | Orijinal kimlik/Host korunur; Host kopyası yeni UID ve Host OFF; follower kopyası doğru orijinali izler | Not run |
| P8 | Kopyayı orijinalden önce yerleştirerek kayıt/açılış tekrarını yap; mümkünse API hazırlığını farklı sırada tetikle | Orijinal UID korunur; yalnız kopya yeni UID alır; yanlış Host seçilmez | Not run |
| P9 | Host'u sil; aynı adla yepyeni cihaz oluştur | Eski takipçi unavailable kalır; aynı ad yeni kimliğe otomatik bağlanmaz | Not run |
| P10 | Kaynak bulunmayan başka Set'e follower kopyala; sonra eski Set'e dön | Son gam korunur; başka Set kaynağı sessizce seçilmez; eski registry sızıntısı olmaz | Not run |
| P11 | Ayrı Rack içindeki iki aynı adlı cihazı dene | Etiket kanal+cihaz sırasını ayırt eder; yanlış cihaz seçilmez | Not run |

P1–P5 başarıları yalnız temel haberleşmeye kanıttır; P6–P11 çözülmeden T4 Passed verilemez. P8/P10 başarısızlığı beklenebilir, mevcut algoritma bu koşulları yapısal olarak çözmüyor. Yerel bug'lar giderilip deneme tekrarlanmalıdır. Kesin kapı sonucu bugün **NOT RUN / unresolved**, yanlış success çıkarılmamalı.
