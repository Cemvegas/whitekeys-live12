# Anlık gam düzenleme — gerçek Live kabul sonuç formu

Kullanıcı doldurur. Kısmi DEVELOPMENT sürümüdür; Host paylaşımı ve kalıcı kimlik doğrulaması ayrı bekleyen iştir. Otomatik testler veya eski sürümün kabulü bu formun Passed kanıtı değildir.

| Koşum bilgisi | Gerçek değer |
|---|---|
| Tarih / test eden | |
| macOS / Live / Max sürümü | |
| Manifest source_commit / package_version | |
| ZIP SHA256 / açılan klasör | |
| MIDI giriş / Post FX ham kayıt | |
| Test Set / yeniden açma saati | |

| Kriter | Beklenen | Gerçek | Kanıt | Passed / Failed / Not run |
|---|---|---|---|---|
| UI01 | A renkleri, kırpılmayan 360×169 panel, 332×62 klavye; Host gated | | | |
| UI02 | Local anlık nota/Root değişimi; Root korunur | | | |
| UI03 | Root sabit gam tanıma; alternatif aynı notaları korur | | | |
| UI04 | Follow Live güncellemesi; read-only editör; kayıpta son gam | | | |
| UI05 | Eski hedefte note-off, velocity/kanal, audition/Panic | | | |
| UI06 | 1–12 derece, siyah tuşlar ve MIDI sınırları | | | |
| UI07 | v2/v3 Sounding geçişi ve v4 yeniden açılışı | | | |

Host keşfi/paylaşımı, kalıcı kaynak eşleşmesi, çoğaltma ve Set izolasyonu henüz bu kısmi sürümde mevcut değildir; sonuçları ayrı teknik prototip formuna yazın. UI kriterlerinin geçmesi paylaşım ticket'ını kapatmaz.
