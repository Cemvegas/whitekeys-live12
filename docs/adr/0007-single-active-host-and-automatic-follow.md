---
status: accepted
---
# Tek aktif Host ve otomatik Follow WhiteKeys

2026-10-11: Kullanıcı Host çarpısının kaldırılmasını, aktif düğmenin sarı olmasını, Set başına tek aktif Host ve otomatik Follower bağlantısı istedi. Bu belge davranış kararını kaydeder; uygulama veya Live kabulünün tamamlandığını göstermez.

## Karar

- Host düğmesinin tamamı açık/kapalı kontrolüdür. Yanındaki çarpı kaldırılır. Yalnız gerçekten aktif Host sarı gösterilir; çakışma nedeniyle bekleyen tercih aktif sayılmaz.
- Set başına en fazla bir aktif Host vardır. Kullanıcı başka cihazı Host yaptığında önceki rol kapanır ve mevcut Follower’lar yeni geçerli Host’a otomatik bağlanır. Önceki Host kendi kaynak türü ve gamını korur; kendiliğinden Follower olmaz.
- Follow WhiteKeys manuel Host seçimi istemez. Host yokken son Sounding Scale korunur ve Waiting for Host gösterilir. Geçerli Host hazır olduğunda takip otomatik başlar.
- Açık Host talepleri tutarlı bir sırada işlenir; son kabul edilen açık kullanıcı eylemi kazanır. Keşif/yükleme sırası açık kullanıcı talebi sayılmaz. Devir sonrası eski Host güncellemeleri reddedilir.
- Normal kayıt/açılış tek Host ve otomatik takibi korur. Farklı kimlikli birden fazla kayıtlı Host talebi varsa rastgele kazanan seçilmez; Host conflict durumunda kullanıcı istediği cihazda Host’a basarak rolü belirler.
- ADR 0006 aynen önceliklidir. Aynı kimlik çakışmasında ilgili paylaşım durur; etkilenen Follower başka Host’a otomatik kaçarak çözümü atlayamaz. Bir kez seçilen cihaz eski kimliği ve kayıtlı Host tercihini korur; diğer adaylar yeni kimlik ve Host kapalı alır. Kimlik seçimi kendi başına Host devri yaratmaz; farklı kimlikler arasında rol çelişkisi varsa tek Host koşulu ayrıca çözülür.
- Set izolasyonu, görünür isimden bağımsız kalıcı kimlik, atomik gam güncellemesi, son gamı koruma ve basılı nota güvenliği sürer. Yeni transport veya teşhis mimarisi bu kararın parçası değildir.

## Önceki kararın değişmesi

ADR 0005’in çoklu Host, manuel Host seçimi ve eski etkin Host gösterimi hükümleri değiştirilir. ADR 0006’nın kimlik seçimi, referansların korunması ve normal Set kaydıyla kalıcılık hükümleri değiştirilmez. ADR 0006’daki eski uygulama/ticket durum notları bu yeni revizyonun kabul sonucu değildir.

## Kabul

Spec #23 otomatik testlerde tek rol, devir, otomatik bağlantı, gecikmiş güncellemelerin reddi, kayıt/açılış ve çakışma önceliğini tanımlar. Gerçek Live’da beş kısa ana senaryo ve mevcut güvenlik regresyonları ayrıca doğrulanır. Otomatik testler native düğme tıklaması, renk veya Live keşfinin kabulü sayılmaz.
