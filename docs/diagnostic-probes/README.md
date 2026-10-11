# Kimlik deneyinin otomatik parçası

Üretim kodu değildir. `node docs/diagnostic-probes/test-collision-order.cjs` kopyanın önce kaydolmasını zorlar. Live runtime ID sürekliliğini varsayar; bunu kanıtlamaz. Gerçek Live kabul koşulları için ../persistence-diagnosis.md okuyun. Bu adayın üretim paylaşım modülüne aktarılması #19 geçmeden yasaktır.

## Reddedilen adayları tekrar üretme

`node docs/diagnostic-probes/check-rejected-candidates.cjs` eski copy-first hatasını, v2'nin sınırlı geçişini, farklı Set'te runtime ID tekrar kullanımını ve özgün cihazın ID değişimindeki kaybını ayrı kontrol eder. Bu komutun geçmesi **#19'un geçtiği anlamına gelmez**: bilinen RED sonuçlarının doğru sebeple tekrar üretildiğini gösterir. Bireysel RED komutları hata kodu 1 döndürür.

`test-runtime-reuse.cjs` Live'da görülen UID korunması sorununu küçültür; Host ON girdiyle koşulu da sınar. Live'da görülen kopyanın Host'u OFF'tu; bu iki kanıt eşitlenmemelidir. `test-runtime-change.cjs` şartnameye karşı zorlanmış yeniden numaralandırmadır; Live'da gözlenmiş bir soğuk başlangıç hatası değildir.

Son ayrıntılı kanıt: [kimlik teşhisi](../identity-diagnosis.md). Computer Use 2026-10-11'de kullanıcının son talebiyle bırakıldı; bu noktadan sonraki otomatik sonuçlar yeni Live kabulü sayılmaz.

`node docs/diagnostic-probes/test-ownership-ledger.cjs` cihaz dışında kalan bir native sahiplik referansı **sağlanırsa** kayıt sırası, ID değişimi ve Set ayrımının karar çekirdeğinde nasıl çözüleceğini sınar. TDD RED→GREEN yapıldı. Referans çözümleyici test double'ıdır; gerçek Live adapteri, kalıcı tahsis ve yardımcı koordinatör uygulanmış değildir. Üretim çözümü olarak kullanmayın.
