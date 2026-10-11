# #20–#21 uygulama incelemesi

Başlangıç: `3bf8ad3` (#19 kapanış kaydı). Yalnız yeni üretim değişiklikleri incelendi; önceki commit edilmemiş teşhis/spec dosyaları kapsam dışında ve korunmuştur.

Code-review skill ile bağımsız Standards ve Spec incelemeleri yapıldı. Somut bulgular: kaynak seçilmemiş Follow WhiteKeys kaydının kendi restore doğrulamasıyla çelişmesi; kaynak kaybında revision eşiğinin kaybolması; iptal edilen assignment geri alımında tekrar block gerekliliği; numeric Master anchor kapsamının yanlış yazılması; yabancı cihazın census'u durdurması veya ilk yüklenince Set UUID'sini belirlemesi; eski çakışma seçim imzasının tekrar kullanılması; tek kalan Follower'ın seçicisinin kaybolması; geçici API hatasından sonra seçicinin geri gelmemesi.

Bunlar düzeltilmiş ve ilgili kullanıcı mesajı/model/MIDI regresyonları eklenmiştir. Standards yorumundaki büyük `tick()` fonksiyonu bir bakım heuristiğidir; doğruluk kuralı veya test başarısızlığı değildir. Üretim adapterinin native Max/Live çalışması, Rack parametre keşfi ve gerçek kayıt döngüsü hâlâ ayrı Live kabulünü gerektirir. Otomatik test veya kaynak incelemesi gerçek Live sonucu olarak sunulmaz.
