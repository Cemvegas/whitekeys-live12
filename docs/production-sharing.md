# Üretim Host/Follower paylaşımı — #20 / #21

Yetkili sözleşme: [Spec #23](https://github.com/Cemvegas/whitekeys-live12/issues/23) ve workspace ADR 0006. #19 kullanıcı tarafından kabul edildi; bu üretim sürümü için gerçek Live kabulü ayrıca bekliyor. #20–#21 kodu hazırlanmıştır; #22 kapanmış sayılmaz.

## Kullanım

Local veya Follow Live cihazında Host açın. Diğer cihazın üst Source menüsünde kanal/cihaz yoluyla gösterilen Host'u seçin. Follow WhiteKeys, Host'u kapatır; Local'a dönüş son alınan gamı korur. Kaynak yoksa referans ve son gam korunur; aynı kaynak geri geldiğinde otomatik bağlanır.

Identity conflict menüsü yalnız çakışmada çıkar. Mevcut kimliği korumasını istediğiniz cihazın tam kanal/Rack/chain/cihaz yolunu seçin. Seçilen cihaz kimliğini ve Host tercihini korur; diğerleri ayrı kimlikler ve Host kapalı alır. Çözüm tamamlandıktan sonra Set'i normal şekilde kaydedin. Çözülmemiş durum kayıtla gizlenmez. Tek kalan fakat önceden çakışmış cihaz da kullanıcı seçimini bekler.

## Kayıt ve adapter

V4'ün önceki 12 atomlu kayıtları okunur. Çözülmemiş kimlik çakışması aynı mantıksal kaydın 13. atomunda `1` olarak saklanır; temiz kayıt 12 atomdur. Kaynak seçilmemiş WhiteKeys durumu boş kaynak çiftiyle geçerlidir; yarım veya kendine işaret eden çift reddedilir. Geçersiz kayıt paylaşım kaynağı olarak yayımlanmaz.

Native adapter `live.object` persistent Master volume referansını yeniden bağlamadan önce okur. Kalıcı Set UUID ile oturumdaki Live nesne kapsamı ayrıdır. Başka Set anchor/kayıtları kaynak olarak alınmaz. Native cihaz census'u track/return/master ve iç Rack chain'leri tarar; `WhiteKeys sharing enrollment` Stored Only parametresi kayıt bekleyen cihazları sayar. Her mevcut cihazın kaydı görülmeden snapshot kabulüne başlanmaz. Süre aşımı, ilk gelme veya runtime sayısı sahiplik kanıtı değildir. Yabancı cihazlar census bakımından tamamlanır ama paylaşım grubuna alınmaz.

Global yalnız deferred adapter JSON kayıtlarını taşır. 100 ms polling, native keşif ve mesaj dağıtımı içindir. Kaynak yayınları Set, kalıcı UID, ayrı transport epoch, revision ve atomik Root/maske/ad taşır. Kaynak kaybında aynı epoch'un revision eşiği korunur. Kimlik çözümü bütün adayların assignment onayı ve unblock aşaması tamamlanana kadar ilgili yayınları engeller; değişen/silinen grup aşamalı assignment'ı geri alır. Kullanıcı seçimi, kimlik/oturum/adayı doğrular; tekrar seçim kimlik tahsis etmez. MIDI scripti ve basılı-nota defteri transporttan bağımsızdır.

## Otomatik kanıtın sınırı

`test-sharing.cjs`: gerçek model → gerçek MIDI; kaynak seçimleri, bozuk/eski/yanlış mesajlar, kaynak kaybı ve revision eşiği, basılı nota kanalı, çakışma kaydı, kaynak seçmeden kaydet/aç.

`test-sharing-adapter.cjs`: gerçek üretim adapter/model/MIDI, kontrollü Live API sınır ikamesi; startup kayıt barajı, üç kopyanın 6 sırası × 3 keeper seçimi, aynı anda/tekrar/eski seçim, runtime değişmiş kaydet/aç, gecikmiş anchor, yabancı cihaz yanında bağımsız Host, silinen adayda rollback. Bu native Max/Live davranışının ölçümü değildir.

## Gerçek üretim Live kabulü — tek toplu liste

AMXD ve beş JS dosyasını aynı klasörde tutun. Eski test Set'inin yeni bir kopyasını kullanın. Teşhis cihazı yerine bu **WhiteKeys Live 12.amxd** dosyasını yükleyin.

1. İki WhiteKeys ekleyin. İlki Local / D Major / Host açık; ikinciden ilk Host'u Source menüsünde seçin. İlkini G yapınca ikincinin Playing ve sesi G olmalı. İkinci Host açılamamalı.
2. İlk cihazı çoğaltın. İlgili cihazlarda Identity conflict çıkmalı; ikinci cihaz son gamını çalmalı. Menüden istediğiniz kopyayı seçin. Yalnız seçilen Host açık kalmalı; ikinci cihaz onu izlemeli. Aynı adlar ve Rack içinde aday yolları ayırt edilebilmeli.
3. Bir nota basılıyken kaynağın gamını değiştirin, sonra bırakın: eski nota kapanmalı. Host'u kapatıp tekrar açın: Follower son gamı korumalı ve aynı Host'a yeniden bağlanmalı. Black Keys, audition ve Panic yalnız kendi cihazında etkili olmalı.
4. Çözümü normal Set kaydıyla kaydedip kapat/açın. Seçim sorulmadan aynı Host/Follower bağı kurulmalı. Ayrıca çözülmemiş bir çoğaltmayı ayrı Set kopyasında kaydet/açın: çakışma seçimi yeniden görünmeli.
5. Host'u yeniden adlandırın, Rack/track kopyasını deneyin; başka Set'e cihaz kopyaladığınızda eski kaynak sessizce bu Set'in kaynağına dönüşmemeli. Aynı Set'teki bağımsız Host/Follower çalışmaya devam etmeli.

Live/Max sürümleri ve çoklu MIDI kanalındaki note-on/off ham mesaj ölçümü son kabul #22'ye yazılmalıdır. Bu beş işlemin üretim sürümünde sonucu henüz alınmadı.
