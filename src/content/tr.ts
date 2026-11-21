// Türkçe metinler. Her iddia docs/ICERIK_KAYNAKLARI.md'deki bir kaynağa dayanır.
// Ton: kendinden emin, kısa, mühendis gibi; abartı yok (bkz. PROMPT_TAYKUT_SITE.md <copywriting>).
import type { Content } from './schema';

export const tr = {
  meta: {
    title: 'TAYKUT — Lise Rover Takımı · Ankara',
    description:
      "TAYKUT, Ankara ASELSAN Mesleki ve Teknik Anadolu Lisesi'nden bir rover takımı. Rover'ımızı sıfırdan tasarlayıp ürettik; MRC 2026 finalinde genel 4. olduk.",
    ogAlt: 'Sarı tekerlekli TAYKUT rover’ı çakıllı bir test parkurunda',
  },
  a11y: {
    skipToContent: 'İçeriğe atla',
    openMenu: 'Menüyü aç',
    closeMenu: 'Menüyü kapat',
    language: 'Dil',
    switchTo: 'English',
    externalLink: '(yeni sekmede açılır)',
    scrollDown: 'Aşağı kaydır',
  },
  kinds: {
    result: 'yarışma sonucu',
    measured: 'ölçüldü',
    calculated: 'hesaplandı',
    estimate: 'tahmin',
    'design-target': 'tasarım hedefi',
    assumption: 'varsayım',
    simulated: 'simülasyon',
  },
  units: { min: 'dk' },
  statuses: {
    competed: 'Yarıştık',
    target: 'Hedef',
    dream: 'Bir gün',
  },
  nav: {
    rover: 'Rover',
    missions: 'Görevler',
    engineering: 'Mühendislik',
    station: 'Yer İstasyonu',
    team: 'Takım',
    sponsor: 'Sponsor Ol',
  },
  hero: {
    kicker: 'Ankara · Lise rover takımı',
    title: 'TAYKUT',
    tagline: ['Ankara’da tasarlandı.', 'Başka dünyalar için.'],
    lead: 'Lise öğrencileriyiz. Rover’ımızı sıfırdan tasarladık, ürettik ve Micro Rover Challenge 2026 finalinde genel dördüncü olduk.',
    primary: { label: 'Sponsor Ol' },
    secondary: { label: 'Görevleri Gör' },
    imageAlt:
      'SummerTech rover açık gri çakıllı parkurda: sarı TPU tekerlekler, ters V biçimli alüminyum rocker kolları, öne uzanan sondajlı kol ve üstte beyaz numune kutusu.',
    strip: 'MRC 2026 · Genel 4.',
  },
  inspect: {
    index: '01',
    kicker: 'Rover',
    title: ['Her parça', 'bir sebeple orada.'],
    lead: 'SummerTech Rover 45×45 cm’ye sığar. Yaysız süspansiyon, üç ayrı beyin ve tek bir kolla üç görev yapar.',
    imageAlt:
      'Gece görevi: rover’ın kolundaki sarı ahtapot tutucu siyah silindirik bataryaları kavrıyor; solda yeşil LED’li güç paneli.',
    parts: {
      wheel: { name: 'TPU tekerlek', spec: '95A TPU, zikzak profil, petek iç yapı, Ø10 cm; kendi baskımız' },
      rocker: { name: 'Rocker', spec: 'Yay ve amortisör yok; her tekerlek zemini kendisi izler' },
      differential: { name: 'Diferansiyel', spec: 'Bir taraf kalkınca diğeri iner; gövde ortalamada kalır' },
      arm: { name: '3 eksenli kol', spec: 'ASA baskı; taban, açılım ve uç; değiştirilebilir uç' },
      gripper: { name: 'Ahtapot tutucu', spec: 'Dilimli çene; düzensiz ve kaygan nesneleri kavrar' },
      drill: { name: 'Helezonik sondaj', spec: 'Arşimet vidası; numuneyi silindirik hazneye taşır' },
      camera: { name: 'Kol kamerası', spec: 'ArUco okuma ve operatöre canlı yayın' },
      pixhawk: { name: 'Pixhawk 2.4.8', spec: 'ArduRover; GPS + IMU + odometri füzyonu' },
      pi: { name: 'Raspberry Pi 4B', spec: 'OpenCV ile görüntü işleme, görev yönetimi' },
      mega: { name: 'Arduino Mega 2560', spec: 'Enkoderli motor PID, servolar, load cell' },
      battery: { name: '3S Li-ion batarya', spec: '5600 mAh; ortalama 8.05 A ile ~35 dk' },
      samples: { name: 'Numune kutusu', spec: '3 bağımsız hazne; çapraz bulaşma yok' },
    },
  },
  missions: {
    index: '02',
    kicker: 'Görevler',
    title: ['Altı yer.', 'Tek rover ailesi.'],
    lead: 'Yarıştığımız parkurdan hedeflediğimiz sahalara, gerçek yükseklik verisinden kurulmuş arazilerde görev sürüşü.',
    mapAlt:
      'Dünya haritasında altı görev bölgesi: Ankara, MRC 2026, Drumheller, İsviçre Alpleri, Utah ve Mars.',
    viewMission: 'Göreve git',
    coordinates: 'Koordinat',
    regions: {
      ankara: {
        name: 'Ev Üssü',
        place: 'Ankara, Türkiye',
        summary: 'Her şeyin başladığı yer. Atölyeden çıkış, kısa test sürüşü ve kalibrasyon.',
        steps: ['Atölyeden çıkış', 'Kısa test sürüşü', 'ArUco ile kalibrasyon', 'Sisteme hazır'],
      },
      mrc2026: {
        name: 'Micro Rover Challenge 2026',
        place: 'Final parkuru',
        summary: 'Gerçek sonucumuz: başvuru videosunda 1., finalde genel 4. Üç görevi sahada tamamladık.',
        steps: ['Tam otonom ArUco görevi', 'Sondaj görevi', 'Gece görevi ve enerji'],
      },
      drumheller: {
        name: 'CIRC 2027',
        place: 'Drumheller, Alberta, Kanada',
        summary:
          'Ana hedefimiz. Yeni rover’ı bu bölgenin gerçek lidar verisinden kurduğumuz dijital ikizde şimdiden sürüyoruz.',
        steps: ['Kil tepeleri arasında sürüş', 'Bilim: numune alma', 'Ekipman bakımı', 'Otonom navigasyon'],
      },
      alps: {
        name: 'Alp Arazisi',
        place: 'İsviçre Alpleri',
        summary: 'Kayalık yamaç, kar ve çakıl. Süspansiyonun en zor sınavı.',
        steps: ['Kayalık yamaç tırmanışı', 'Kar ve çakıl geçişi', 'Bakım görevi'],
      },
      utah: {
        name: 'Mars Çölü Araştırma İstasyonu',
        place: 'Hanksville, Utah, ABD',
        summary: 'Dünyanın en bilinen Mars benzeri rover sahası. Bir gün orada sürmek istiyoruz.',
        steps: ['Uzun mesafe otonom geçiş', 'Kaya fotoğraflama'],
      },
      mars: {
        name: 'Jezero Krateri',
        place: 'Mars',
        summary:
          'Hayalimizin son durağı. Gerçek yükseklik verisinden kurulmuş bir krater tabanında kısa bir sürüş.',
        steps: ['Krater tabanında sürüş', 'Gökyüzünde Dünya’yı aramak'],
      },
    },
  },
  stats: {
    index: '03',
    kicker: 'Rakamlarla',
    title: ['Küçük rover,', 'net sonuçlar.'],
    items: {
      videoRank: 'MRC 2026 başvuru videosu sıralaması',
      finalRank: 'MRC 2026 final, genel sıralama',
      envelope: 'Hacim sınırı',
      runtime: 'Çalışma süresi (enerji bütçesinden)',
      speed: 'Seyir hızı (11.1 V, yüksüz)',
      brains: 'Kart: Pixhawk, Raspberry Pi, Arduino Mega',
    },
  },
  engineering: {
    index: '04',
    kicker: 'Mühendislik',
    title: ['Hazır parça değil,', 'kendi çözümümüz.'],
    lead: 'Mekanikten yazılıma her alt sistemi biz tasarladık, ürettik ve test ettik. Zayıf noktalarımızı da yazdık; bir sonraki rover onlardan öğreniyor.',
    systems: {
      mechanical: {
        name: 'Mekanik',
        body: 'Rocker-bogie fikrinden uyarladığımız 4 tekerlekli diferansiyelli rocker süspansiyon. Yay yok, amortisör yok.',
        points: [
          'Skid-steer: yerinde dönüş',
          '4× Namiki 22CL, 80:1 planet dişli',
          'TPU tekerlekler kendi baskımız',
        ],
      },
      electronics: {
        name: 'Elektronik',
        body: 'Üç kartlı mimari: biri dursa bile sistem kilitlenmez. Motorlar, servolar ve hassas elektronik ayrı hatlardan beslenir.',
        points: ['3S 5600 mAh Li-ion', 'XT60 güç dağıtımı, ayrı UBEC’ler', 'Ortalama 8.05 A enerji bütçesi'],
      },
      software: {
        name: 'Yazılım ve Otonomi',
        body: 'Navigasyonu sıfırdan yazmak yerine gerçek zamanlı çalışan Pixhawk’ı seçtik; görüntü işleme ve görev mantığı bizim.',
        points: ['ArduRover + Mission Planner', 'OpenCV ile ArUco okuma', 'GPS + odometri füzyonu'],
      },
      arm: {
        name: 'Kol ve Tutucu',
        body: 'Tek kol, değiştirilebilir uçlar. Daha az ağırlık, daha az arıza noktası, daha hızlı görev geçişi.',
        points: ['3 eksen, ASA baskı', 'Ahtapot tutucu', 'PCA9685 ile servo sürme'],
      },
      science: {
        name: 'Bilim',
        body: 'Load cell zemin sıkılığını ölçer, helezonik sondaj yüzey altından numune alır, numuneler ayrı haznelerde kalır.',
        points: ['5 kg load cell + HX711', 'Helezonik sondaj', '3 izole numune haznesi'],
      },
    },
    twin: {
      title: 'Dijital ikiz',
      body: 'Yeni rover’ı sahaya çıkmadan önce ROS 2 ve Gazebo’da, Drumheller’ın gerçek lidar yükseklik verisinden kurduğumuz arazide sürüyoruz.',
      proof:
        'Gerçek arazi verisindeki simülasyon testinde sol rocker −18,01°, sağ rocker +18,08°: diferansiyel iki tarafı 0,065° farkla eşit ve ters tutuyor.',
    },
  },
  station: {
    index: '05',
    kicker: 'Yer İstasyonu',
    title: ['Kontrol merkezini', 'kendimiz yazdık.'],
    lead: 'Hazır bir arayüz yerine sıfırdan yazdığımız web yer istasyonu: rover’ı izler, sürer ve otonom görevleri yönetir.',
    features: [
      'Canlı kamera ve ArUco tespiti',
      '2B harita ve 3B sahne; üstten ve takip görünümü',
      'Acil durdurma her ekranda, kilitli',
      'Waypoint görevleri ve otonomi işlemleri',
      'PID ayarı ve telemetri grafikleri',
    ],
    honesty: 'Buradaki demo tarayıcıda simülasyonla çalışır; gerçek rover’a bağlı değildir.',
    openDemo: 'Canlı demoyu aç',
    videoAlt: 'Yer istasyonu ekran kaydı: kamera paneli, harita ve telemetri grafikleri.',
  },
  journey: {
    index: '06',
    kicker: 'Yolculuk',
    title: ['Sıfırdan', 'finale.'],
    now: 'Şimdi',
    items: [
      { date: 'Kas 2025', title: 'Takım kuruldu', body: 'Bir avuç lise öğrencisi ve bir rover fikri.' },
      {
        date: '2026',
        title: 'Başvuru videosunda 1.',
        body: 'Micro Rover Challenge başvurularında video değerlendirmesinde ilk sıra.',
      },
      { date: 'Tem–Ağu 2026', title: 'MRC 2026 finali: genel 4.', body: 'Üç görevi sahada tamamladık.' },
      {
        date: '2026–27',
        title: 'Yeni ekip, yeni rover',
        body: 'ASELSAN MTAL’de yeni üyelerle yeniden kurulduk. Yeni rover dijital ikizde.',
      },
      {
        date: 'Ağu 2027',
        title: 'Hedef: CIRC',
        body: 'Kanada Uluslararası Rover Yarışması için ilgi beyanımızı gönderdik.',
      },
    ],
  },
  team: {
    index: '07',
    kicker: 'Takım',
    title: ['Yedi kişi.', 'Tek rover.'],
    lead: 'Mekanik, elektronik ve yazılımı birlikte öğrenen ve birlikte üreten bir lise ekibi.',
    captain: 'Takım Kaptanı',
    advisor: 'Danışman Öğretmen',
    member: 'Takım Üyesi',
  },
  sponsor: {
    index: '08',
    kicker: 'Sponsor Ol',
    title: ['Logonuz', 'sahada olsun.'],
    lead: 'Malzeme, üretim, ulaşım ya da mentorluk: her destek bir sonraki yarışmaya bir adım daha yaklaştırır.',
    why: [
      { title: 'Görünürlük', body: 'Logonuz rover’da, takım kıyafetinde, sitede ve yarışma sunumlarımızda.' },
      {
        title: 'Uluslararası sahne',
        body: 'Hedefimiz Kanada’daki CIRC; desteğiniz bizimle birlikte yolculuk eder.',
      },
      {
        title: 'Yeni mühendisler',
        body: 'Desteğiniz, gerçek bir mühendislik projesinde öğrenen lise öğrencilerine gider.',
      },
    ],
    tiers: {
      drumheller: {
        name: 'Drumheller',
        body: 'Ana sponsor.',
        perks: [
          'Rover üzerinde en büyük logo alanı',
          'Tüm sunumlarda ve sitede öne çıkan yer',
          'Yarışma raporlarında teşekkür',
        ],
      },
      alpine: {
        name: 'Alp',
        body: 'Ana destekçi.',
        perks: ['Rover üzerinde logo', 'Sitede ve sunumlarda logo', 'Sosyal medyada teşekkür'],
      },
      regolith: {
        name: 'Regolit',
        body: 'Destekçi.',
        perks: ['Sitede logo', 'Sosyal medyada teşekkür'],
      },
      friend: {
        name: 'Dost',
        body: 'Parça, üretim, ulaşım ya da mentorluk desteği.',
        perks: ['Sitede teşekkür', 'Desteğin türüne göre görünürlük'],
      },
    },
    emptyWall: 'İlk sponsorumuz siz olun.',
    contactTitle: 'Konuşalım',
    emailCta: 'E-posta gönder',
    instagramCta: 'Instagram’da yaz',
  },
  footer: {
    school: 'ASELSAN Mesleki ve Teknik Anadolu Lisesi · Ankara',
    advisor: 'Danışman: Mustafa Seyhan',
    captain: 'Kaptan: Kerem Sümer',
    attributions: 'Veri ve atıflar',
    license: 'Kod MIT lisanslıdır. Fotoğraflar, logo ve metinler © TAYKUT.',
    shortcuts: 'Klavye kısayolları',
    rights: 'Tüm hakları saklıdır.',
    press: 'Basın kiti',
  },
  pages: {
    sponsor: {
      title: 'Sponsorluk',
      lead: 'TAYKUT’u desteklemek, gerçek bir rover’ı sahaya çıkaran lise öğrencilerini desteklemek demek. Desteğin her türü işimize yarar.',
      placementTitle: 'Logonuz nerede görünür?',
      placements: [
        'Rover gövdesi ve kolu üzerinde',
        'Takım kıyafetinde',
        'Bu sitede ve basın kitinde',
        'Yarışma tasarım raporlarında ve sunumlarda',
        'Sosyal medya paylaşımlarımızda',
      ],
      faqTitle: 'Sık sorulanlar',
      faq: [
        {
          q: 'Sadece para mı kabul ediyorsunuz?',
          a: 'Hayır. Motor, sensör, filament, alüminyum, CNC veya lazer kesim, ulaşım ve mentorluk desteği de çok değerli.',
        },
        {
          q: 'Kademeler kesin mi?',
          a: 'Kademeler bir başlangıç noktası. Destek türünüze göre görünürlüğü birlikte belirleriz.',
        },
        {
          q: 'Desteğimiz nereye harcanıyor?',
          a: 'Rover parçalarına, üretime ve yarışma kayıt ile ulaşım masraflarına. Her yarışma sonunda destekçilerimize kısa bir rapor göndeririz.',
        },
      ],
    },
    rover: {
      title: 'Rover’larımız',
      lead: 'Yarıştığımız rover ve şu anda tasarladığımız yeni rover. Her değerin yanında türü yazıyor: ölçülen, hesaplanan, tahmin ya da tasarım hedefi.',
      summertechTitle: 'SummerTech Rover · MRC 2026',
      summertechNote:
        'Micro Rover Challenge 2026 finalinde genel 4. olan rover. Değerler takımın teknik dokümanından.',
      rover2027Title: 'TAYKUT 2027 rover’ı · tasarım aşamasında',
      rover2027Note:
        'Bu rover henüz tasarım ve simülasyon aşamasında. Değerler dijital ikizin parametre dosyasından otomatik alınır ve tasarım ilerledikçe değişir.',
      specs: {
        envelope: 'Hacim',
        wheels: 'Tekerlek sayısı',
        wheelDiameter: 'Tekerlek çapı',
        motors: 'Motorlar',
        speed: 'Seyir hızı',
        runtime: 'Çalışma süresi',
        range: 'Menzil',
        battery: 'Batarya',
        averageCurrent: 'Ortalama akım',
        suspension: 'Süspansiyon',
        steering: 'Yönlendirme',
        mass: 'Toplam kütle',
        wheelbase: 'Dingil mesafesi',
        trackWidth: 'İz genişliği',
        bodySize: 'Gövde ölçüsü',
        groundClearance: 'Yerden yükseklik',
        motor: 'Motor',
        maxSpeed: 'Azami hız',
        voltage: 'Gerilim',
      },
      enums: {
        rocker_bogie_differential: 'Rocker-bogie + diferansiyel',
        skid_steer: 'Skid-steer (yerinde dönüş)',
        DJI_M3508_P19_24V: 'DJI M3508 P19 (24 V), tekere doğrudan',
      },
    },
    press: {
      title: 'Basın kiti',
      lead: 'TAYKUT hakkında yazacaksanız ihtiyacınız olan her şey burada. Metinleri olduğu gibi kullanabilirsiniz.',
      shortTitle: 'Kısa tanıtım',
      short:
        'TAYKUT, Ankara ASELSAN Mesleki ve Teknik Anadolu Lisesi’nden bir rover takımıdır. Lise öğrencilerinden oluşan takım, rover’ını sıfırdan tasarlayıp üretti ve Micro Rover Challenge 2026 finalinde genel dördüncü oldu. Takımın yeni hedefi Kanada’daki CIRC 2027.',
      longTitle: 'Uzun tanıtım',
      long: 'TAYKUT, Kasım 2025’te kurulan ve bugün Ankara ASELSAN Mesleki ve Teknik Anadolu Lisesi’nde çalışan bir lise rover takımıdır. Takımın ilk rover’ı SummerTech; 45×45 cm’ye sığan, yaysız diferansiyelli rocker süspansiyonlu, Pixhawk, Raspberry Pi ve Arduino Mega’dan oluşan üç kartlı bir mimariye sahip otonom bir gezegen aracıdır. Rover, Micro Rover Challenge 2026’nın başvuru videosu değerlendirmesinde birinci, finalinde genel dördüncü oldu. Takım şimdi altı tekerlekli yeni rover’ını, Drumheller’ın gerçek lidar verisinden kurduğu dijital ikizde geliştiriyor ve kendi yazdığı web yer istasyonuyla test ediyor. Hedef, Ağustos 2027’de Kanada’da düzenlenecek CIRC yarışması.',
      logoTitle: 'Logo',
      logoNote:
        'Logoyu oranını ve renklerini değiştirmeden kullanın. Koyu zeminde beyaz plaka üzerinde gösterin.',
      downloadLogo: 'Logoyu indir (PNG)',
      photosTitle: 'Fotoğraflar',
      photosNote: 'Fotoğraflar © TAYKUT. Haberlerde kaynak gösterilerek kullanılabilir.',
    },
  },
  notFound: {
    title: 'Rover rotadan çıktı.',
    body: 'Aradığınız sayfa bu arazide yok.',
    home: 'Üsse dön',
  },
  fallback: {
    noWebgl: 'Bu cihazda 3B sahne açılamadı; fotoğraflar gösteriliyor.',
  },
} satisfies Content;
