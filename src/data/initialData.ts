import { Fatwa, Category, ResearchStudy, TrackingItem, SiteSettings } from '../types';

export const initialCategories: Category[] = [
  { id: 'الكل', name: { ar: 'جميع الأقسام', en: 'All Categories', id: 'Semua Kategori' }, icon: 'fa-layer-group' },
  { id: 'الطهارة والصلاة', name: { ar: 'الطهارة والصلاة', en: 'Purification & Prayer', id: 'Thaharah & Shalat' }, icon: 'fa-mosque' },
  { id: 'الزكاة والصيام والحج', name: { ar: 'الزكاة والصيام والحج', en: 'Zakat, Fasting & Hajj', id: 'Zakat, Puasa & Haji' }, icon: 'fa-hand-holding-heart' },
  { id: 'المعاملات المالية والتجارة', name: { ar: 'المعاملات المالية', en: 'Financial Transactions', id: 'Muamalah & Bisnis' }, icon: 'fa-coins' },
  { id: 'فقه الأسرة والأحوال الشخصية', name: { ar: 'فقه الأسرة والمواريث', en: 'Family & Inheritance', id: 'Keluarga & Waris' }, icon: 'fa-people-roof' },
  { id: 'العقيدة والتوحيد', name: { ar: 'العقيدة والتوحيد', en: 'Creed & Tawheed', id: 'Akidah & Tauhid' }, icon: 'fa-star-and-crescent' },
  { id: 'الآداب والأخلاق والرقائق', name: { ar: 'الآداب والأخلاق', en: 'Islamic Ethics', id: 'Adab & Akhlak' }, icon: 'fa-seedling' },
  { id: 'قضايا معاصرة ونوازل', name: { ar: 'قضايا معاصرة ونوازل', en: 'Contemporary Issues', id: 'Isu Kontemporer' }, icon: 'fa-globe' }
];

export const initialFatwas: Fatwa[] = [
  {
    id: 1042,
    category: "المعاملات المالية والتجارة",
    views: 1420,
    ar: {
      title: "حكم بيع التقسيط بزيادة في الثمن عن البيع النقدي (الكاش)",
      date: "14 ربيع الثاني 1447 هـ",
      questioner: "تاجر مواد غذائية وأجهزة - الشحر",
      question: "السلام عليكم ورحمة الله وبركاته، أنا صاحب محل لبيع الأجهزة الكهربائية في مدينة الشحر، وأبيع الجهاز نقداً (كاش) بمبلغ مائة ألف ريال مثلاً، فإذا طلب المشتري شراءه بالتقسيط على ستة أشهر أبيعه بمائة وعشرين ألفاً، ونتفق على ذلك صراحة قبل إبرام العقد، فهل هذه الزيادة جائزة شرعاً أم تدخل في الربا؟ أفتونا مأجورين.",
      answer: `الحمد لله رب العالمين، والصلاة والسلام على سيدنا محمد وعلى آله وصحبه أجمعين، وبعد:
فإن البيع بالتقسيط مع زيادة الثمن مقابل الأجل (التأجيل) جائز شرعاً عند جماهير الفقهاء ومنهم أئمة المذهب الشافعي رحمهم الله تعالى، ولا يدخل ذلك في الربا المحرم؛ لأن للزمن حصة من الثمن في عقود المعاوضات والبيوع، ولكن يشترط لصحة هذا البيع شروط مهمة لا بد من مراعاتها:

أولاً: أن يجزم المتعاقدان (البائع والمشتري) عند إجراء العقد بأحد الثمنين؛ فيقول البائع مثلاً: بعتك هذه السلعة بمائة وعشرين ألفاً مقسطة إلى ستة أشهر، فيقول المشتري: قبلت. ولا يجوز أن يتفرقا والعقد متردد بين النقد والتقسيط دون جزم بأحدهما؛ لنهيه صلى الله عليه وسلم عن بيعتين في بيعة.

ثانياً: أن تكون الأقساط معلومة المقدار ومعلومة الآجال (المواعيد) علماً ينفي الجهالة والنزاع.

ثالثاً: ألا يترتب على تأخر المشتري في سداد قسط من الأقساط أي زيادة مالية أو غرامة تأخير؛ لأن الزيادة على الدين بعد ثبوته في الذمة مقابل التأخير هي عين ربا الجاهلية المحرم (إما أن تقضي وإما أن تربي).

وعليه؛ فما تقوم به في محلك التجاري صحيح وجائز شرعاً ما دمتما تتفقان وتجزمان بكون البيع بالتقسيط وبالثمن المحدد قبل التفرق من مجلس العقد. والله تعالى أعلم.`,
      references: [
        "منهاج الطالبين وعمدة المفتين للإمام النووي (كتاب البيع - باب الربا وبيعتين في بيعة).",
        "تحفة المحتاج في شرح المنهاج للعلامة ابن حجر الهيتمي (4/ 294).",
        "فتح المعين بشرح قرة العين بمهمات الدين للعلامة زين الدين المليباري."
      ]
    },
    en: {
      title: "Ruling on Installment Sales with a Higher Price than Cash Sales",
      date: "14 Rabi' al-Thani 1447 AH",
      questioner: "Appliance & Grocery Merchant - Ash-Shihr",
      question: "Peace be upon you. I own an electrical appliances shop in Ash-Shihr. I sell an item for cash at 100,000 riyals, and if the buyer requests to pay in installments over six months, I sell it for 120,000 riyals. We explicitly agree on this before concluding the contract. Is this price increase permissible in Sharia or is it considered Riba (usury)?",
      answer: `Praise be to Allah, the Lord of the Worlds, and peace and blessings be upon our Master Muhammad, his family, and all his companions. To proceed:
Selling by installments at a higher price in exchange for deferred payment is permissible in Sharia according to the majority of jurists, including the Imams of the Shafi'i school (may Allah have mercy on them). It does not fall under prohibited Riba because time has a recognized share in the price within sales contracts, provided the essential conditions are met:

First: Both contracting parties must definitively settle on one price before parting.
Second: Installment amounts and due dates must be known and clear.
Third: No late fees or penalty interest may be added.

Accordingly, your practice is valid and permissible in Sharia. And Allah knows best.`,
      references: [
        "Minhaj al-Talibin by Imam Al-Nawawi (Book of Sales).",
        "Tuhfat al-Muhtaj by Ibn Hajar al-Haytami (4/294).",
        "Fath al-Mu'in by Shaykh Zayn al-Din al-Malibari."
      ]
    },
    idLang: {
      title: "Hukum Jual Beli Kredit (Cicilan) dengan Harga Lebih Tinggi dari Tunai",
      date: "14 Rabiul Akhir 1447 H",
      questioner: "Pedagang Elektronik & Sembako - Asy-Syihr",
      question: "Assalamu'alaikum. Saya pemilik toko alat elektronik di Asy-Syihr. Jika menjual tunai harganya 100.000 riyal, sedangkan cicilan 6 bulan 120.000 riyal dan disepakati sebelum akad. Apakah tambahan ini boleh atau termasuk riba?",
      answer: `Segala puji bagi Allah Tuhan semesta alam. Jual beli kredit dengan tambahan harga karena penangguhan waktu diperbolehkan menurut mayoritas ulama fikih termasuk Mazhab Syafi'i, asalkan akad menentukan harga secara pasti saat transaksi dan tidak ada denda keterlambatan. Wallahu A'lam.`,
      references: [
        "Minhaj ath-Thalibin karya Imam An-Nawawi.",
        "Tuhfatul Muhtaj karya Ibnu Hajar al-Haitami.",
        "Fathul Mu'in karya Syaikh Zainuddin al-Malibari."
      ]
    }
  },
  {
    id: 1039,
    category: "الزكاة والصيام والحج",
    views: 1890,
    ar: {
      title: "كيفية حساب زكاة المحلات التجارية في ظل تغير سعر صرف العملة",
      date: "02 ربيع الثاني 1447 هـ",
      questioner: "أبو عبد الله - حضرموت",
      question: "كيف يحسب التاجر زكاة بضاعته (عروض التجارة) عند تمام الحول مع التذبذب المستمر في سعر العملة المحلية؟ وهل تُقوّم البضاعة بسعر الشراء الذي اشتراها به سابقاً أم بسعر السوق يوم وجوب الزكاة؟ وهل الديون التي للتاجر على الزبائن تدخل في حساب الزكاة؟",
      answer: `الحمد لله، والصلاة والسلام على سيدنا رسول الله وعلى آله وصحبه ومن والاه، أما بعد:
فإن زكاة عروض التجارة واجبة متى بلغت قيمتها نصاباً في آخر الحول، والنصاب الشرعي يُقدّر بقيمة (85 جراماً من الذهب الخالص عيار 24)، وطريقة جرد وحساب الزكاة عند تمام الحول تكون وفق الضوابط الفقهية الآتية:

1. تقويم البضاعة: تقوم السلع الموجودة في المحل والمخازن عند تمام الحول بـ (سعر البيع الحالي في السوق وقت وجوب الزكاة) لا بسعر شرائها القديم.
2. النقود والسيولة: يضم التاجر إلى قيمة البضاعة ما لديه من نقود سائلة في الصندوق أو الحسابات البنكية.
3. الديون التي للتاجر: الديون المرجوة الأداء على أناس قادرين باذلين تُضم وتُزكى، أما الديون الميئوس منها أو على مماطلين معسرين فلا تُزكى حتى تُقبض.
4. المقدار الواجب إخراجه: يخرج ربع العشر (2.5%) من إجمالي القيمة. والله تعالى أعلم.`,
      references: [
        "المجموع شرح المهذب للإمام النووي (6/ 48 - باب زكاة التجارة).",
        "نهاية المحتاج إلى شرح المنهاج للشمس الرملي (3/ 103).",
        "الفتاوى الكبرى الفقهية لابن حجر الهيتمي."
      ]
    },
    en: {
      title: "How to Calculate Zakat on Commercial Goods Amid Currency Fluctuations",
      date: "02 Rabi' al-Thani 1447 AH",
      questioner: "Abu Abdullah - Hadhramaut",
      question: "How should a merchant calculate Zakat on commercial inventory at the end of the lunar year given the continuous fluctuation of currency? Should goods be valued at purchase price or market value?",
      answer: `Praise be to Allah. Commercial goods are valued at their current market selling price on the due date of Zakat. Cash on hand is added, solvent collectible debts are included, and 2.5% is paid if the total reaches the Nisab (85g pure gold). And Allah knows best.`,
      references: [
        "Al-Majmu' Sharh al-Muhadhdhab by Imam Al-Nawawi (6/48).",
        "Nihayat al-Muhtaj by Al-Ramli (3/103)."
      ]
    },
    idLang: {
      title: "Cara Menghitung Zakat Barang Dagangan di Tengah Fluktuasi Nilai Tukar Mata Uang",
      date: "02 Rabiul Akhir 1447 H",
      questioner: "Abu Abdullah - Hadhramaut",
      question: "Bagaimana cara menghitung zakat barang dagangan saat genap haul di tengah fluktuasi mata uang? Apakah dinilai dengan harga beli atau harga pasar saat haul?",
      answer: `Barang dagangan dinilai berdasarkan harga pasar saat jatuh tempo zakat, ditambah uang tunai dan piutang lancar, lalu dikeluarkan 2,5% jika mencapai nishab 85 gram emas. Wallahu A'lam.`,
      references: [
        "Al-Majmu' Syarh al-Muhadzzab (6/48).",
        "Nihayatul Muhtaj (3/103)."
      ]
    }
  },
  {
    id: 1035,
    category: "الطهارة والصلاة",
    views: 980,
    ar: {
      title: "حكم الجمع بين الصلاتين للمريض ومن يغلب عليه المشقة الشديدة",
      date: "25 ربيع الأول 1447 هـ",
      questioner: "مستفتٍ من مدينة الشحر",
      question: "والدي كبير في السن ويعاني من مرض في المفاصل وسلس أحياناً، ويشق عليه جداً الوضوء والاستعداد لكل صلاة في وقتها، فهل يجوز له الجمع بين صلاتي الظهر والعصر، وبين المغرب والعشاء وهو مقيم غير مسافر؟",
      answer: `الحمد لله وحده، والصلاة والسلام على من لا نبي بعده، وعلى آله وصحبه، وبعد:
ذهب جماعة من محققي فقهاء الشافعية - كالإمام النووي والخطابي والقاضي حسين والمتولي والروياني - إلى جواز الجمع بين الظهر والعصر، وبين المغرب والعشاء (جمع تقديم أو جمع تأخير من غير قصر) للمريض الذي يلحقه بترك الجمع مشقة ظاهرة وضعف شديد، واستدلوا بحديث ابن عباس رضي الله عنهما في الصحيحين أن النبي صلى الله عليه وسلم جمع بالمدينة من غير خوف ولا مطر، قال: «أراد أن لا يُحرج أمته».
وعليه؛ فيجوز لوالدكم تقليد هذا القول المعتمد عند جمع من أئمة المذهب فيجمع بين الصلاتين رفعاً للحرج. والله تعالى أعلم.`,
      references: [
        "روضة الطالبين وعمدة المفتين للإمام النووي (1/ 401).",
        "أسنى المطالب لشيخ الإسلام زكريا الأنصاري (1/ 245).",
        "بغية المسترشدين للعلامة باعلوي الحضرمي."
      ]
    },
    en: {
      title: "Ruling on Combining Prayers for a Sick Person Facing Severe Hardship",
      date: "25 Rabi' al-Awwal 1447 AH",
      questioner: "Questioner from Ash-Shihr",
      question: "My father is elderly and suffers severe hardship preparing for each prayer on time. May he combine Dhuhr with Asr, and Maghrib with Isha while resident?",
      answer: `Permissible according to verifying Shafi'i scholars (including Imam Al-Nawawi) to combine prayers without shortening due to illness and severe hardship. And Allah knows best.`,
      references: [
        "Rawdat al-Talibin by Imam Al-Nawawi (1/401)."
      ]
    },
    idLang: {
      title: "Hukum Menjamak Shalat bagi Orang Sakit yang Mengalami Kesulitan Berat",
      date: "25 Rabiul Awal 1447 H",
      questioner: "Penanya dari Asy-Syihr",
      question: "Bolehkah ayah saya yang sakit dan lanjut usia menjamak shalat Zhuhur dengan Ashar serta Maghrib dengan Isya saat mukim?",
      answer: `Boleh menurut sekelompok ulama muhaqqiq Mazhab Syafi'i (seperti Imam An-Nawawi) untuk menjamak tanpa qashar karena uzur sakit dan masyaqqah berat. Wallahu A'lam.`,
      references: [
        "Raudhatuth Thalibin (1/401)."
      ]
    }
  },
  {
    id: 1031,
    category: "فقه الأسرة والأحوال الشخصية",
    views: 2310,
    ar: {
      title: "حكم طلاق الغضبان وضابط الغضب الذي يمنع وقوع الطلاق",
      date: "18 ربيع الأول 1447 هـ",
      questioner: "فاعل خير (استفتاء خاص)",
      question: "حصل شجار شديد بيني وبين زوجتي، وفي لحظة غضب شديد وانفعال تلفظت بلفظ الطلاق مرة واحدة، وبعد أن هدأت ندمت أشد الندم، فهل يقع هذا الطلاق؟ وما هو الغضب الذي لا يقع معه الطلاق؟",
      answer: `الحمد لله، والصلاة والسلام على سيدنا رسول الله وعلى آله وصحبه، وبعد:
فإن الغضب الذي يعتري الإنسان عند الخصومة ينقسم عند الفقهاء إلى مراتب:
المرتبة الأولى: أن يكون الزوج واعياً لما يقول، مدركاً لمعنى كلامه؛ فهذا يقع طلاقه بلا خلاف.
المرتبة الثانية: أن يشتد به الغضب إلى حالة الإغلاق والدهش الشديد بحيث يغيب عقله وإدراكه ولا يدري ما يقول كالمجنون أو المغمى عليه؛ فهذا لا يقع طلاقه لحديث: «لا طلاق ولا عتاق في إغلاق».
وننصح الزوجين بالحضور الشخصي لمقر دائرة الفتاوى للتحقق من الألفاظ بدقة. والله تعالى أعلم.`,
      references: [
        "تحفة المحتاج لابن حجر الهيتمي (8/ 22).",
        "مغني المحتاج للخطيب الشربيني (4/ 456).",
        "إعانة الطالبين للعلامة البكري الدمياطي."
      ]
    },
    en: {
      title: "Ruling on Divorce Uttered in Anger and the Criterion That Prevents Its Validity",
      date: "18 Rabi' al-Awwal 1447 AH",
      questioner: "Anonymous",
      question: "I had a fierce argument with my wife and uttered divorce in intense anger. Does it count?",
      answer: `If conscious of speech, divorce takes effect. If anger reached total mental closure (Ighlaq) where awareness was completely lost, divorce does not count. Personal consultation is advised. And Allah knows best.`,
      references: ["Tuhfat al-Muhtaj (8/22).", "Mughni al-Muhtaj (4/456)."]
    },
    idLang: {
      title: "Hukum Talak Saat Marah dan Batasan Kemarahan yang Menghalangi Jatuhnya Talak",
      date: "18 Rabiul Awal 1447 H",
      questioner: "Hamba Allah",
      question: "Apakah jatuh talak yang diucapkan saat sangat marah?",
      answer: `Jika masih sadar atas apa yang diucapkan, talak jatuh. Jika amarah mencapai kondisi ighlaq (tertutup akal total tanpa kesadaran), talak tidak jatuh. Wallahu A'lam.`,
      references: ["Tuhfatul Muhtaj (8/22)."]
    }
  },
  {
    id: 1027,
    category: "العقيدة والتوحيد",
    views: 1640,
    ar: {
      title: "حكم التوسل إلى الله تعالى بجاه النبي صلى الله عليه وسلم والصالحين",
      date: "10 ربيع الأول 1447 هـ",
      questioner: "طالب علم - الشحر",
      question: "ما حكم التوسل إلى الله عز وجل بسيدنا رسول الله صلى الله عليه وسلم بعد وفاته، كأن يقول الداعي: (اللهم إني أسألك بنبيك محمد صلى الله عليه وسلم)؟ وهل هذا جائز عند علماء أهل السنة؟",
      answer: `الحمد لله رب العالمين، والصلاة والسلام على سيدنا ومولانا محمد وعلى آله وصحبه أجمعين، وبعد:
فإن التوسل إلى الله سبحانه وتعالى بذات النبي صلى الله عليه وسلم أو بجاهه العظيم عند ربه أمر مشروع وجائز ومستحب عند جمهور علماء المذاهب الأربعة في حياته صلى الله عليه وسلم وبعد انتقاله إلى الرفيق الأعلى؛ لأن المتوسل لا يدعو غير الله، وإنما يسأل الله وحده متقرباً إليه بأحب خلقه إليه.
وقد ثبت ذلك في حديث عثمان بن حنيف (حديث الضرير) في السنن وصححه الحفاظ. والله تعالى أعلم.`,
      references: [
        "المجموع شرح المهذب للإمام النووي (8/ 274).",
        "وفاء الوفا بأخبار دار المصطفى للعلامة السمهودي (4/ 1371).",
        "شفاء السقام في زيارة خير الأنام لتقي الدين السبكي."
      ]
    },
    en: {
      title: "Ruling on Tawassul to Allah Through the Status of the Prophet (PBUH)",
      date: "10 Rabi' al-Awwal 1447 AH",
      questioner: "Student of Knowledge - Ash-Shihr",
      question: "Is it permissible to make Tawassul to Allah through the Prophet Muhammad after his passing?",
      answer: `Permissible and recommended according to the majority of Sunni scholars across the four schools, as the supplicant prays only to Allah Almighty. And Allah knows best.`,
      references: ["Al-Majmu' (8/274).", "Shifa' al-Siqam."]
    },
    idLang: {
      title: "Hukum Bertawassul kepada Allah Melalui Kedudukan Nabi SAW",
      date: "10 Rabiul Awal 1447 H",
      questioner: "Penuntut Ilmu",
      question: "Bagaimana hukum bertawassul dengan Nabi Muhammad SAW setelah wafat beliau?",
      answer: `Disyariatkan dan dianjurkan menurut mayoritas ulama empat mazhab, karena orang yang bertawassul hanya memohon kepada Allah SWT semata. Wallahu A'lam.`,
      references: ["Al-Majmu' (8/274)."]
    }
  },
  {
    id: 1020,
    category: "قضايا معاصرة ونوازل",
    views: 1510,
    ar: {
      title: "حكم التسويق بالعمولة والوساطة التجارية عبر الإنترنت (الدروب شيبينغ)",
      date: "29 صفر 1447 هـ",
      questioner: "شاب يعمل في التجارة الإلكترونية",
      question: "أعمل عبر الإنترنت في مجال التسويق للسلع، حيث أعرض صور منتجات لا أملكها في متجري، فإذا طلبها الزبون أشتريها من المورد الأصلي وأشحنها للزبون، أو آخذ نسبة عمولة متفقاً عليها، فما الضابط الشرعي؟",
      answer: `الحمد لله، والصلاة والسلام على رسول الله وعلى آله وصحبه، وبعد:
إذا كان المسوّق وسيطاً أو سمساراً واضحاً يربط المشتري بالبائع الأصلي ويتقاضى عمولة معلومة، فهذا جائز شرعاً من باب الجعالة أو السمسرة المباحة. أما إذا كان يبيع السلعة كأنها ملكه دون أن يقبضها أو يحوزها، فهذا منهي عنه لقوله صلى الله عليه وسلم: «لا تبع ما ليس عندك»، ومخرجه إما عقد السلم بشروطه أو الوعد بالشراء حتى يتملك السلعة ويحوزها. والله تعالى أعلم.`,
      references: [
        "روضة الطالبين للإمام النووي (4/ 3).",
        "قرارات وتوصيات المجامع الفقهية المعاصرة بشأن التجارة الإلكترونية.",
        "حاشية البجيرمي على الخطيب (3/ 18)."
      ]
    },
    en: {
      title: "Ruling on Affiliate Marketing and Online Dropshipping",
      date: "29 Safar 1447 AH",
      questioner: "E-Commerce Marketer",
      question: "What are the Sharia guidelines for dropshipping and commission marketing online?",
      answer: `Acting as a transparent broker (Simsarah) for a defined commission is lawful. Selling unpossessed goods as one's own property requires meeting Salam contract conditions or a promise-to-purchase model. And Allah knows best.`,
      references: ["Rawdat al-Talibin (4/3)."]
    },
    idLang: {
      title: "Hukum Pemasaran Komisi (Affiliate) dan Dropshipping عبر Internet",
      date: "29 Shafar 1447 H",
      questioner: "Pelaku Bisnis Online",
      question: "Bagaimana hukum bisnis affiliate dan dropshipping dalam pandangan syariat?",
      answer: `Sebagai makelar atau agen dengan komisi yang jelas adalah halal. Jika menjual barang seolah miliknya sendiri sebelum dimiliki, harus memenuhi syarat akad salam atau janji beli terlebih dahulu. Wallahu A'lam.`,
      references: ["Raudhatuth Thalibin (4/3)."]
    }
  },
  {
    id: 1014,
    category: "الآداب والأخلاق والرقائق",
    views: 1120,
    ar: {
      title: "بر الوالدين وكيفية التعامل مع الأب الذي يأمر بقطيعة بعض الأقارب",
      date: "15 صفر 1447 هـ",
      questioner: "مستفتٍ - حضرموت",
      question: "حصل خلاف دنيوي بين والدي وعمي، فطلب مني والدي ألا أزور عمي وألا أسلّم عليه، وقال لي: إن ذهبت إليه فلست راضياً عنك، وأنا في حيرة بين بر والدي وبين صلة رحمي، فماذا أفعل؟",
      answer: `الحمد لله، والصلاة والسلام على سيدنا رسول الله وعلى آله وصحبه، وبعد:
لا يجوز لك طاعة والدك في قطيعة عمك؛ لأن صلة الرحم واجبة، والقاعدة: «لا طاعة لمخلوق في معصية الخالق»، ولكن يجب التلطف التام مع الوالد ومداراته وصلة العم سراً دون إثارة غضب الوالد، مع السعي بالحكمة للإصلاح بينهما. والله تعالى أعلم.`,
      references: [
        "الزواجر عن اقتراف الكبائر لابن حجر الهيتمي.",
        "إحياء علوم الدين للإمام الغزالي.",
        "النصائح الدينية للإمام عبد الله بن علوي الحداد."
      ]
    },
    en: {
      title: "Honoring Parents vs. Obeying a Father Who Orders Severing Family Ties",
      date: "15 Safar 1447 AH",
      questioner: "Questioner - Hadhramaut",
      question: "My father ordered me to cut ties with my uncle. Should I obey him or maintain family ties?",
      answer: `Do not sever kinship ties since there is no obedience to creation in disobeying the Creator, but treat your father with gentleness and visit your uncle discreetly. And Allah knows best.`,
      references: ["Al-Zawajir by Ibn Hajar.", "Ihya' 'Ulum al-Din."]
    },
    idLang: {
      title: "Berbakti kepada Orang Tua dan Menyikapi Ayah yang Menyuruh Memutus Silaturahmi",
      date: "15 Shafar 1447 H",
      questioner: "Penanya - Hadhramaut",
      question: "Ayah menyuruh saya memutus silaturahmi dengan paman. Apakah saya harus mematuhinya?",
      answer: `Tidak boleh memutus silaturahmi karena tidak ada ketaatan kepada makhluk dalam maksiat kepada Khalik. Tetaplah berbakti dan sambung silaturahmi secara bijak tanpa menyinggung ayah. Wallahu A'lam.`,
      references: ["Az-Zawajir karya Ibnu Hajar al-Haitami."]
    }
  }
];

export const initialResearch: ResearchStudy[] = [
  {
    id: "res-1",
    ar: {
      badge: "فقه النوازل المالية",
      pages: "42 صفحة",
      title: "أحكام التعامل بالعملات الرقمية والتجارة الإلكترونية في الفقه الشافعي",
      desc: "بحث فقهي مؤصل يناقش ضوابط العقود المستحدثة عبر الإنترنت، الدروب شيبينغ، وحكم استبدال العملات مع اختلاف سعر الصرف.",
      author: "إعداد: لجنة البحوث بالرباط",
      summary: `يتناول هذا البحث المحكّم أبرز النوازل المالية التي شاعت بين الشباب والتجار في العصر الحاضر، ويقسمها إلى ثلاثة فصول رئيسية:

الفصل الأول: ضوابط صحة العقود المبرمة عبر وسائل التواصل الاجتماعي والمتاجر الإلكترونية، وكيفية تحقق مجلس العقد وخيار المجلس فيها.
الفصل الثاني: حكم البيع بالعمولة والتسويق الشبكي والدروب شيبينغ، وتفصيل الفرق بين السمسرة المشروعة وبين بيع الإنسان ما لا يملك.
الفصل الثالث: ضوابط الصرف والتحويلات المالية عبر التطبيقات البنكية والمحافظ الإلكترونية وشروط التقابض الحكمي.`
    },
    en: {
      badge: "Contemporary Financial Fiqh",
      pages: "42 Pages",
      title: "Rulings on Digital Currencies and E-Commerce in Shafi'i Jurisprudence",
      desc: "An authenticated juristic study examining modern online contracts, dropshipping, and currency exchange regulations.",
      author: "By: Ribat Research Committee",
      summary: `This peer-reviewed study addresses key contemporary financial issues among youth and merchants across three chapters:
Chapter 1: Validity of online contracts and Majlis al-'Aqd.
Chapter 2: Affiliate marketing and dropshipping regulations.
Chapter 3: Currency transfers and digital wallets.`
    },
    idLang: {
      badge: "Fikih Keuangan Kontemporer",
      pages: "42 Halaman",
      title: "Hukum Transaksi Mata Uang Digital & E-Commerce dalam Fikih Syafi'i",
      desc: "Kajian fikih mendalam yang membahas ketentuan akad modern via internet, dropshipping, dan pertukaran mata uang.",
      author: "Oleh: Komisi Riset Ribat",
      summary: `Penelitian ilmiah ini mengupas berbagai persoalan keuangan modern di kalangan pedagang dan generasi muda dalam tiga bab pembahasan.`
    }
  },
  {
    id: "res-2",
    ar: {
      badge: "فقه العبادات",
      pages: "64 صفحة",
      title: "الخلاصة الوفية في زكاة عروض التجارة والأسهم والذهب",
      desc: "دليل عملي للتجار وأصحاب المحلات التجارية في كيفية جرد البضائع وتقويمها وحساب نصاب الزكاة في ظل تقلب العملات.",
      author: "إعداد: دائرة الفتاوى والبحوث",
      summary: `رسالة عملية ميسرة أعدتها دائرة الفتاوى لمساعدة التجار والمحاسبين في محافظة حضرموت على إخراج زكاة أموالهم على الوجه الشرعي الصحيح:

• بيان شروط وجوب زكاة التجارة وكيفية تحديد الحول الزكوي بالهجري.
• الجداول التطبيقية لجرد البضائع الراكدة والرائجة والديون التجارية.
• أحكام زكاة الحلي للنساء وما أُعدّ للزينة أو للادخار والكنز.`
    },
    en: {
      badge: "Fiqh of Worship",
      pages: "64 Pages",
      title: "Comprehensive Guide to Zakat on Commercial Goods, Shares, and Gold",
      desc: "A practical manual for merchants and shop owners on inventory valuation and calculating Zakat Nisab amid currency fluctuations.",
      author: "By: Dept. of Fatwas & Research",
      summary: `An accessible practical guide prepared by the Fatwa Department to assist merchants and accountants in calculating Zakat accurately.`
    },
    idLang: {
      badge: "Fikih Ibadah",
      pages: "64 Halaman",
      title: "Panduan Lengkap Zakat Barang Dagangan, Saham, dan Emas",
      desc: "Panduan praktis bagi para pedagang dan pemilik toko dalam menghitung inventaris barang dan nishab zakat.",
      author: "Oleh: Departemen Fatwa & Riset",
      summary: `Risalah praktis yang disusun oleh Departemen Fatwa untuk memudahkan para pedagang dalam menunaikan zakat harta mereka sesuai syariat.`
    }
  },
  {
    id: "res-3",
    ar: {
      badge: "التراث الحضرمي والفقه",
      pages: "85 صفحة",
      title: "جهود علماء الشحر في خدمة المذهب الشافعي والفتوى القضائية",
      desc: "دراسة تاريخية وفقهية تستعرض أبرز أعلام الإفتاء والقضاء في مدينة الشحر الساحلية ومخطوطاتهم الفقهية النادرة.",
      author: "إعداد: قسم الدراسات التاريخية",
      summary: `دراسة توثيقية تبرز الدور التاريخي والعلمي لمدينة الشحر الساحلية باعتبارها إحدى حواضر العلم في حضرموت:

• تراجم أبرز المفتين والقضاة في الشحر خلال القرون الماضية.
• منهجية الفتوى ومراعاة الأعراف الحضرمية في المعاملات البحرية والزراعية والتجارية.
• فهرس لأهم المخطوطات والفتاوى المحفوظة لعلماء الشحر.`
    },
    en: {
      badge: "Hadhrami Heritage & Fiqh",
      pages: "85 Pages",
      title: "Contributions of Ash-Shihr Scholars to the Shafi'i School and Judicial Fatwa",
      desc: "A historical and juristic study highlighting prominent Muftis and judges of the coastal city of Ash-Shihr and their rare manuscripts.",
      author: "By: Historical Studies Division",
      summary: `A documentary study highlighting the scholarly legacy of the coastal city of Ash-Shihr as a major center of Islamic learning in Hadhramaut.`
    },
    idLang: {
      badge: "Warisan Hadhramaut & Fikih",
      pages: "85 Halaman",
      title: "Peran Ulama Asy-Syihr dalam Khidmah Mazhab Syafi'i dan Fatwa Peradilan",
      desc: "Kajian sejarah dan fikih yang mengulas tokoh-tokoh mufti dan qadhi di kota pesisir Asy-Syihr beserta manuskrip langka mereka.",
      author: "Oleh: Divisi Studi Sejarah",
      summary: `Studi dokumentasi yang menampilkan peran ilmiah dan sejarah kota pesisir Asy-Syihr sebagai salah satu pusat keilmuan di Hadhramaut.`
    }
  }
];

export const initialTrackingItems: TrackingItem[] = [
  {
    code: "RM-105",
    category: "فقه الأسرة والأحوال الشخصية",
    statusStep: 2,
    date: "منذ يومين",
    title: "حكم تقسيم تركة فيها عقار مشترك بين الورثة القُصّر والبالغين",
    statusText: "قيد الدراسة والعرض على لجنة المواريث بالرباط",
    answer: null,
    en: {
      title: "Ruling on Dividing an Estate Containing Shared Property Among Minor and Adult Heirs",
      date: "2 days ago",
      statusText: "Under study and review by the Inheritance Committee at the Ribat",
      answer: null
    },
    idLang: {
      title: "Hukum Pembagian Warisan Properti Bersama Antara Ahli Waris Anak-Anak dan Dewasa",
      date: "2 hari yang lalu",
      statusText: "Sedang dikaji oleh Komisi Fikih Waris di Ribat Al-Mustafa",
      answer: null
    }
  },
  {
    code: "RM-108",
    category: "الطهارة والصلاة",
    statusStep: 3,
    date: "منذ 4 أيام",
    title: "حكم المسح على الجوارب الخفيفة في الوضوء",
    statusText: "تمت الإجابة واعتماد الفتوى",
    answer: "الحمد لله، والصلاة والسلام على رسول الله، وبعد: فيشترط في الجورب الذي يجوز المسح عليه في المذهب الشافعي أن يكون صفيقاً (سميكاً) يمكن متابعة المشي عليه لتردد مسافر لحاجاته، وأن يكون مانعاً من نفوذ الماء إلى القدم لو صُب عليه، أما الجوارب الرقيقة الشفافة أو التي ينفذ منها الماء فلا يصح المسح عليها بل يجب غسل الرجلين. والله أعلم.",
    en: {
      title: "Ruling on Wiping Over Thin Socks During Ablution (Wudu)",
      date: "4 days ago",
      statusText: "Answered and Approved by the Fatwa Committee",
      answer: "In the Shafi'i school, for wiping over socks to be valid, they must be thick and durable enough to walk in continuously and impermeable to water. Thin socks that allow water to penetrate are not valid to wipe over; rather, the feet must be washed. And Allah knows best."
    },
    idLang: {
      title: "Hukum Mengusap Kaus Kaki Tipis Saat Berwudhu",
      date: "4 hari yang lalu",
      statusText: "Telah Dijawab dan Disahkan oleh Komisi Fatwa",
      answer: "Dalam Mazhab Syafi'i, kaus kaki yang boleh diusap disyaratkan tebal, tahan untuk berjalan, dan tidak tembus air. Kaus kaki tipis tidak sah diusap dan wajib mencuci kaki. Wallahu A'lam."
    }
  }
];

export const defaultSiteSettings: SiteSettings = {
  brandTitle: "دائرة الفتاوى والبحوث",
  brandSubtitle: "رباط المصطفى بالشحر للدراسات الإسلامية",
  topBarTitle: "رباط المصطفى بالشحر للدراسات الإسلامية - حضرموت",
  heroAyah: "قال تعالى: ﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾",
  heroMainTitle: "منصة الإفتاء والبحوث الشرعية",
  heroSubTitle: "برباط المصطفى بالشحر للدراسات الإسلامية",
  heroDesc: "مرجعك الموثوق للفتاوى الشرعية المؤصلة على منهج أهل السنة والجماعة والمذهب الشافعي، بإشراف نخبة من العلماء والباحثين المتخصصين بمدينة الشحر.",
  stat1Val: "+3,450",
  stat1Label: "فتوى شرعية مؤصلة",
  stat2Val: "7",
  stat2Label: "أبواب وأقسام فقهية",
  stat3Val: "+48",
  stat3Label: "بحثاً وإصداراً علمياً",
  stat4Val: "24 - 48 ساعة",
  stat4Label: "متوسط الرد على الاستفتاءات",
  whatsappNumber: "967770000000",
  istiftaaEmail: "fatwa@almustafa-shihr.org",
  primaryColor: "#0B4619",
  goldColor: "#D4AF37",
  logoIcon: "fa-mosque",
  aboutTitle: "عن دائرة الفتاوى والبحوث برباط المصطفى بالشحر",
  aboutDesc: "تُعد دائرة الفتاوى والبحوث إحدى الركائز العلمية في رباط المصطفى بالشحر للدراسات الإسلامية بمحافظة حضرموت، وقد تأسست لخدمة المجتمع المسلم والإجابة عن تساؤلات المستفتين في شتى أبواب الفقه والعبادات والمعاملات والأحوال الشخصية، مع العناية بدراسة النوازل المعاصرة.",
  aboutBox1Title: "المنهج العلمي في الإفتاء",
  aboutBox1Desc: "تعتمد الدائرة في فتاواها على المعتمد في المذهب الشافعي من خلال كتب الشيخين (النووي والرافعي) وشروح المنهاج كـ «تحفة المحتاج» و«نهاية المحتاج»، مع مراعاة فقه الواقع والتيسير المعتبر شرعاً.",
  aboutBox2Title: "آلية عمل اللجنة",
  aboutBox2Desc: "تُفرز الأسئلة الواردة عبر الموقع أو الحضور المباشر، وتُحرر إجاباتها مرفقة بالمصادر الشرعية، أما القضايا الكبرى كالطلاق والمواريث فتُعرض على اللجنة العلمية المجتمعة.",
  aboutHoursTitle: "مواعيد استقبال المستفتين",
  aboutHours1Label: "استقبال الأسئلة عبر الموقع:",
  aboutHours1Val: "طوال أيام الأسبوع (24/7)",
  aboutHours2Label: "الحضور المباشر لمقر الدائرة:",
  aboutHours2Val: "السبت - الخميس (صباحاً ومساءً)",
  aboutHours3Label: "لجنة قضايا الأسرة والمواريث:",
  aboutHours3Val: "الإثنين والخميس (بعد العصر)",
  aboutLocation: "اليمن - حضرموت - مدينة الشحر - رباط المصطفى للدراسات الإسلامية",
  footerDesc: "منبر علمي شرعي يُعنى بنشر العلم المؤصل والإجابة على استفتاءات الناس وتوثيق المسائل الفقهية بأدلتها ومراجعها المعتمدة.",
  footerContactTitle: "للتواصل والاستفسار",
  footerContactDesc: "يمكنكم إرسال أسئلتكم مباشرة عبر الموقع أو زيارة مقر الدائرة بمدينة الشحر.",
  footerCopyright: "© جميع الحقوق محفوظة لـ دائرة الفتاوى والبحوث - رباط المصطفى بالشحر للدراسات الإسلامية."
};

export const uiTranslations: Record<string, Record<string, string>> = {
  ar: {
    dir: 'rtl',
    topBarTitle: 'رباط المصطفى بالشحر للدراسات الإسلامية - حضرموت',
    savedBtn: 'المحفوظات',
    adminLoginBtn: 'دخول الإدارة',
    adminDashboardBtn: 'لوحة التحكم والإدارة',
    addFatwaOrResearchBtn: 'إضافة فتوى أو بحث',
    logoutBtn: 'تسجيل الخروج',
    brandTitle: 'دائرة الفتاوى والبحوث',
    brandSubtitle: 'رباط المصطفى بالشحر للدراسات الإسلامية',
    navHome: 'الرئيسية',
    navBrowse: 'تصفح الفتاوى',
    navBrowseMobile: 'تصفح جميع الفتاوى',
    navCategories: 'الأقسام الفقهية',
    navAsk: 'أرسل سؤالك',
    navAskMobile: 'إرسال سؤال جديد',
    navTrack: 'متابعة استفتاء',
    navTrackMobile: 'متابعة حالة سؤال',
    navResearch: 'البحوث والإصدارات',
    navResearchMobile: 'البحوث والدراسات',
    navAbout: 'عن الدائرة',
    navAboutMobile: 'عن الدائرة والرباط',
    headerAskBtn: 'ضع سؤالك هنا',
    heroAyah: 'قال تعالى: ﴿فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ﴾',
    heroMainTitle: 'منصة الإفتاء والبحوث الشرعية',
    heroSubTitle: 'برباط المصطفى بالشحر للدراسات الإسلامية',
    heroDesc: 'مرجعك الموثوق للفتاوى الشرعية المؤصلة على منهج أهل السنة والجماعة والمذهب الشافعي، بإشراف نخبة من العلماء والباحثين المتخصصين بمدينة الشحر.',
    heroSearchPlaceholder: 'ابحث في الفتاوى بالكلمات المفتاحية، الموضوع، أو رقم الفتوى (مثلاً: زكاة، 1042)...',
    searchBtn: 'بحث',
    popularSearches: 'الأكثر بحثاً:',
    tagZakat: 'زكاة المال',
    tagDivorce: 'أحكام الطلاق',
    tagEcommerce: 'التجارة الإلكترونية',
    tagPrayer: 'جمع الصلوات',
    ctaCardTitle: 'هل لديك سؤال شرعي؟',
    ctaCardSub: 'نستقبل أسئلتكم وتجيب عليها لجنة الإفتاء بالرباط',
    ctaOnline: 'متاح الآن',
    ctaPoint1: 'إجابات محررة وموثقة بالمراجع الفقهية المعتمدة.',
    ctaPoint2: 'سرية تامة لبيانات المستفتي في القضايا الأسرية والخاصة.',
    ctaPoint3: 'إمكانية متابعة السؤال برقم مرجعي خاص أو عبر الواتساب.',
    ctaSubmitBtn: 'أرسل سؤالك الآن لدائرة الفتاوى',
    ctaTrackLabel: 'لديك رقم استفتاء سابق؟ تابع حالته مباشرة:',
    ctaTrackPlaceholder: 'أدخل رقم المتابعة (مثال: RM-105)',
    ctaTrackBtn: 'متابعة',
    stat1Label: 'فتوى شرعية مؤصلة',
    stat2Label: 'أبواب وأقسام فقهية',
    stat3Label: 'بحثاً وإصداراً علمياً',
    stat4Val: '24 - 48 ساعة',
    stat4Label: 'متوسط الرد على الاستفتاءات',
    catBadge: 'تصنيف موضوعي',
    catTitle: 'أقسام الفتاوى الشرعية',
    catSubtitle: 'اختر الباب الفقهي لتصفح جميع الأسئلة والفتاوى المتعلقة به مع مراجعها المعتمدة',
    fatwaUnit: 'فتوى',
    allPublishedFatwas: 'جميع الفتاوى المنشورة',
    categoryPrefix: 'فتاوى قسم: ',
    totalResultsPrefix: 'إجمالي النتائج المعروضة: ',
    filterSearchPlaceholder: 'فلترة سريعة للفتاوى...',
    sortNewest: 'الأحدث نشراً',
    sortPopular: 'الأكثر قراءة',
    sortNumber: 'حسب رقم الفتوى',
    noResultsTitle: 'لم يتم العثور على فتوى مطابقة لبحثك',
    noResultsDesc: 'يمكنك تغيير كلمات البحث، أو إرسال سؤالك مباشرة إلى دائرة الفتاوى والبحوث ليتم الرد عليك.',
    showAllFatwasBtn: 'عرض كل الفتاوى',
    fatwaNumPrefix: 'فتوى رقم #',
    viewsUnit: 'قراءة',
    questionLabel: 'السؤال:',
    questionerPrefix: 'المستفتي: ',
    answerLabel: 'الجواب من دائرة الفتاوى والبحوث:',
    referencesLabel: 'المراجع والمصادر الفقهية المعتمدة',
    issuedByFooter: 'صادر عن دائرة الفتاوى والبحوث - رباط المصطفى بالشحر',
    copyBtn: 'نسخ الفتوى',
    whatsappBtn: 'واتساب',
    printBtn: 'طباعة',
    saveBtn: 'حفظ',
    savedStateBtn: 'محفوظة',
    editBtn: 'تعديل',
    deleteBtn: 'حذف',
    askBadge: 'خدمة الاستفتاء الإلكتروني',
    askTitle: 'أرسل سؤالك إلى دائرة الفتاوى والبحوث',
    askDesc: 'يُعرض سؤالك على لجنة الإفتاء برباط المصطفى بالشحر، ويتم الرد عليك وإعطاؤك رقم متابعة خاص.',
    successTitle: 'تم استلام سؤالك بنجاح ولله الحمد!',
    successDesc: 'تم إحالة سؤالك إلى لجنة الفتوى والبحوث برباط المصطفى بالشحر. يرجى الاحتفاظ برقم المتابعة التالي للاستعلام عن حالة الإجابة:',
    trackingCodeLabel: 'رقم متابعة الاستفتاء:',
    viewStatusNowBtn: 'عرض حالة السؤال الآن',
    askAnotherBtn: 'إرسال سؤال آخر',
    sendViaWhatsappBtn: 'إرسال التفاصيل مباشرة عبر واتساب الدائرة',
    sendViaEmailBtn: 'إرسال نسخة عبر البريد الإلكتروني',
    formNameLabel: 'اسم المستفتي',
    formNameHint: '(اختياري - يمكنك كتابة "مستفتي" للخصوصية)',
    formNamePlaceholder: 'الاسم الكريم أو كنية المستفتي',
    formCatLabel: 'الباب الفقهي للسؤال',
    formContactLabel: 'رقم الواتساب أو البريد الإلكتروني',
    formContactHint: '(لإشعارك عند صدور الفتوى)',
    formContactPlaceholder: 'مثال: 770000000 أو البريد الإلكتروني',
    formPriorityLabel: 'درجة أهمية السؤال وطبيعته',
    formPriorityNormal: 'استفتاء عادي',
    formPriorityUrgent: 'مستعجل (طلاق/دم/وفاة)',
    formTitleLabel: 'عنوان مختصر للسؤال',
    formTitlePlaceholder: 'مثال: حكم البيع بالتقسيط مع زيادة السعر عن الكاش',
    formDetailsLabel: 'نص الاستفتاء بالتفصيل',
    formDetailsPlaceholder: 'اكتب تفاصيل سؤالك بوضوح تام؛ فإن الحكم على الشيء فرع عن تصوره...',
    formDetailsNote: 'يرجى ذكر جميع الملابسات المؤثرة في الحكم الشرعي خاصة في مسائل الطلاق والمعاملات المالية.',
    formPrivacyCheck: 'سؤال خاص (أرغب في استلام الفتوى بشكل خاص دون نشر الاسم)',
    formSubmitBtn: 'إرسال السؤال للدائرة',
    trackTitle: 'متابعة حالة استفتاء',
    trackSubtitle: 'أدخل رقم المتابعة الذي حصلت عليه عند إرسال سؤالك لمعرفة مرحلة دراسته أو قراءة الفتوى فور صدورها',
    trackInputPlaceholder: 'أدخل رقم المتابعة (مثال: RM-105 أو RM-108)',
    trackCheckBtn: 'استعلام',
    trackDemoHint: 'أرقام تجريبية للمعاينة الفورية:',
    trackBrowserHistory: 'أسئلة قمت بإرسالها من هذا المتصفح:',
    trackNotFoundTitle: 'لم يتم العثور على استفتاء برقم',
    trackNotFoundDesc: 'تأكد من كتابة الرقم بشكل صحيح (مثال: RM-105 أو RM-108)',
    trackStep1: '1. استلام السؤال',
    trackStep2: '2. قيد الدراسة باللجنة',
    trackStep3: '3. صدور الفتوى',
    trackCurrentStatus: 'الحالة الحالية: ',
    trackIssuedAnswer: 'نص الجواب الصادر عن الدائرة:',
    trackUnderReviewBadge: 'قيد المراجعة',
    resBadge: 'الإنتاج العلمي والبحثي',
    resTitle: 'إصدارات وبحوث رباط المصطفى بالشحر',
    resSubtitle: 'دراسات فقهية محكمة ونشرات موسمية تصدرها دائرة البحوث والدراسات بالرباط',
    readSummaryBtn: 'قراءة الملخص',
    closeBtn: 'إغلاق',
    aboutBadge: 'نبذة تعريفية',
    footerQuickLinks: 'روابط سريعة',
    footerContactTitle: 'للتواصل والاستفسار',
    footerAskBtn: 'اطرح سؤالك الآن',
    bookmarksModalTitle: 'الفتاوى المحفوظة في المفضلة',
    noBookmarksText: 'لا توجد فتاوى محفوظة في المفضلة حالياً.',
    viewBtn: 'عرض',
    langChangedMsg: 'تم تغيير اللغة إلى العربية'
  },
  en: {
    dir: 'ltr',
    topBarTitle: 'Ribat Al-Mustafa in Ash-Shihr for Islamic Studies - Hadhramaut',
    savedBtn: 'Saved',
    adminLoginBtn: 'Admin Login',
    adminDashboardBtn: 'Admin Dashboard',
    addFatwaOrResearchBtn: 'Add Fatwa / Research',
    logoutBtn: 'Logout',
    brandTitle: 'Department of Fatwas & Research',
    brandSubtitle: 'Ribat Al-Mustafa in Ash-Shihr for Islamic Studies',
    navHome: 'Home',
    navBrowse: 'Browse Fatwas',
    navBrowseMobile: 'Browse All Fatwas',
    navCategories: 'Fiqh Categories',
    navAsk: 'Ask a Question',
    navAskMobile: 'Submit New Question',
    navTrack: 'Track Inquiry',
    navTrackMobile: 'Track Question Status',
    navResearch: 'Research & Publications',
    navResearchMobile: 'Research & Studies',
    navAbout: 'About Us',
    navAboutMobile: 'About the Department',
    headerAskBtn: 'Ask Question',
    heroAyah: 'Allah says: "So ask the people of knowledge if you do not know"',
    heroMainTitle: 'Islamic Fatwa & Research Platform',
    heroSubTitle: 'Ribat Al-Mustafa in Ash-Shihr for Islamic Studies',
    heroDesc: 'Your trusted source for authentic Islamic fatwas rooted in Ahlus Sunnah wal Jama\'ah and the Shafi\'i school, supervised by specialist scholars and researchers in Ash-Shihr.',
    heroSearchPlaceholder: 'Search fatwas by keyword, topic, or fatwa number (e.g., Zakat, 1042)...',
    searchBtn: 'Search',
    popularSearches: 'Popular:',
    tagZakat: 'Zakat on Wealth',
    tagDivorce: 'Divorce Rulings',
    tagEcommerce: 'E-Commerce',
    tagPrayer: 'Combining Prayers',
    ctaCardTitle: 'Have a Religious Question?',
    ctaCardSub: 'We receive your questions and answer them via the Ribat Fatwa Committee',
    ctaOnline: 'Online Now',
    ctaPoint1: 'Edited answers documented with approved juristic references.',
    ctaPoint2: 'Complete confidentiality for personal and family inquiries.',
    ctaPoint3: 'Track your question status with a special reference code or WhatsApp.',
    ctaSubmitBtn: 'Submit Your Question to the Fatwa Dept.',
    ctaTrackLabel: 'Have a previous tracking code? Track it directly:',
    ctaTrackPlaceholder: 'Enter tracking code (e.g., RM-105)',
    ctaTrackBtn: 'Track',
    stat1Label: 'Authentic Fatwas',
    stat2Label: 'Fiqh Categories',
    stat3Label: 'Scholarly Studies',
    stat4Val: '24 - 48 Hours',
    stat4Label: 'Average Response Time',
    catBadge: 'Thematic Classification',
    catTitle: 'Sharia Fatwa Categories',
    catSubtitle: 'Select a category to browse relevant questions with approved references',
    fatwaUnit: 'Fatwa',
    allPublishedFatwas: 'All Published Fatwas',
    categoryPrefix: 'Category: ',
    totalResultsPrefix: 'Total Results: ',
    filterSearchPlaceholder: 'Quick filter fatwas...',
    sortNewest: 'Newest First',
    sortPopular: 'Most Read',
    sortNumber: 'By Fatwa Number',
    noResultsTitle: 'No fatwa matched your search',
    noResultsDesc: 'Try different keywords or submit your question directly to the committee.',
    showAllFatwasBtn: 'Show All Fatwas',
    fatwaNumPrefix: 'Fatwa #',
    viewsUnit: 'views',
    questionLabel: 'Question:',
    questionerPrefix: 'Questioner: ',
    answerLabel: 'Answer from the Fatwa & Research Department:',
    referencesLabel: 'Approved Juristic References',
    issuedByFooter: 'Issued by Department of Fatwas & Research - Ribat Al-Mustafa Ash-Shihr',
    copyBtn: 'Copy Fatwa',
    whatsappBtn: 'WhatsApp',
    printBtn: 'Print',
    saveBtn: 'Save',
    savedStateBtn: 'Saved',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    askBadge: 'Electronic Fatwa Service',
    askTitle: 'Submit Your Question to the Fatwa Dept.',
    askDesc: 'Your question will be reviewed by the Ribat Fatwa Committee with a reference code.',
    successTitle: 'Question Received Successfully!',
    successDesc: 'Your question has been referred to the Fatwa Committee. Keep your reference code:',
    trackingCodeLabel: 'Reference Tracking Code:',
    viewStatusNowBtn: 'View Status Now',
    askAnotherBtn: 'Submit Another Question',
    sendViaWhatsappBtn: 'Send Directly to Department WhatsApp',
    sendViaEmailBtn: 'Send Copy via Email',
    formNameLabel: 'Questioner Name',
    formNameHint: '(Optional - you can write "Anonymous")',
    formNamePlaceholder: 'Your name or alias',
    formCatLabel: 'Fiqh Category',
    formContactLabel: 'WhatsApp Number or Email',
    formContactHint: '(To notify you when answered)',
    formContactPlaceholder: 'e.g. 770000000 or email',
    formPriorityLabel: 'Question Urgency & Nature',
    formPriorityNormal: 'Standard Question',
    formPriorityUrgent: 'Urgent (Divorce/Estate/Death)',
    formTitleLabel: 'Brief Question Title',
    formTitlePlaceholder: 'e.g. Ruling on installment sales with price increase',
    formDetailsLabel: 'Detailed Question Text',
    formDetailsPlaceholder: 'Describe details clearly...',
    formDetailsNote: 'Please mention all relevant circumstances.',
    formPrivacyCheck: 'Private inquiry (Do not publish my name)',
    formSubmitBtn: 'Submit Question',
    trackTitle: 'Track Fatwa Status',
    trackSubtitle: 'Enter your reference code to check evaluation stage or read the answer',
    trackInputPlaceholder: 'Enter reference code (e.g., RM-105 or RM-108)',
    trackCheckBtn: 'Search Status',
    trackDemoHint: 'Demo codes for quick preview:',
    trackBrowserHistory: 'Questions submitted from this browser:',
    trackNotFoundTitle: 'No inquiry found with code',
    trackNotFoundDesc: 'Ensure code is entered accurately (e.g., RM-105)',
    trackStep1: '1. Received',
    trackStep2: '2. Under Committee Review',
    trackStep3: '3. Fatwa Issued',
    trackCurrentStatus: 'Current Status: ',
    trackIssuedAnswer: 'Issued Official Answer:',
    trackUnderReviewBadge: 'Under Review',
    resBadge: 'Scholarly Research',
    resTitle: 'Publications & Studies of Ribat Al-Mustafa',
    resSubtitle: 'Peer-reviewed studies issued by the Research Department',
    readSummaryBtn: 'Read Summary',
    closeBtn: 'Close',
    aboutBadge: 'About the Department',
    footerQuickLinks: 'Quick Links',
    footerContactTitle: 'Contact & Inquiries',
    footerAskBtn: 'Ask a Question Now',
    bookmarksModalTitle: 'Bookmarked Fatwas',
    noBookmarksText: 'No fatwas bookmarked yet.',
    viewBtn: 'View',
    langChangedMsg: 'Language changed to English'
  },
  id: {
    dir: 'ltr',
    topBarTitle: 'Ribat Al-Mustafa Asy-Syihr untuk Studi Islam - Hadhramaut',
    savedBtn: 'Favorit',
    adminLoginBtn: 'Login Admin',
    adminDashboardBtn: 'Panel Kontrol Admin',
    addFatwaOrResearchBtn: 'Tambah Fatwa / Riset',
    logoutBtn: 'Keluar',
    brandTitle: 'Departemen Fatwa & Riset',
    brandSubtitle: 'Ribat Al-Mustafa di Asy-Syihr untuk Studi Islam',
    navHome: 'Beranda',
    navBrowse: 'Jelajahi Fatwa',
    navBrowseMobile: 'Jelajahi Semua Fatwa',
    navCategories: 'Kategori Fikih',
    navAsk: 'Kirim Pertanyaan',
    navAskMobile: 'Kirim Pertanyaan Baru',
    navTrack: 'Cek Status Fatwa',
    navTrackMobile: 'Pantau Status Pertanyaan',
    navResearch: 'Riset & Publikasi',
    navResearchMobile: 'Riset & Studi Ilmiah',
    navAbout: 'Tentang Kami',
    navAboutMobile: 'Tentang Departemen & Ribat',
    headerAskBtn: 'Tulis Pertanyaan',
    heroAyah: 'Allah berfirman: "Maka bertanyalah kepada orang yang mempunyai pengetahuan jika kamu tidak mengetahui"',
    heroMainTitle: 'Platform Fatwa & Riset Syariah',
    heroSubTitle: 'Ribat Al-Mustafa Asy-Syihr untuk Studi Islam',
    heroDesc: 'Rujukan terpercaya untuk fatwa syariah berlandaskan Ahlussunnah wal Jama\'ah dan Mazhab Syafi\'i di kota Asy-Syihr.',
    heroSearchPlaceholder: 'Cari fatwa berdasarkan kata kunci, topik, atau nomor fatwa...',
    searchBtn: 'Cari',
    popularSearches: 'Paling Dicari:',
    tagZakat: 'Zakat Harta',
    tagDivorce: 'Hukum Talak',
    tagEcommerce: 'Bisnis Online',
    tagPrayer: 'Jamak Shalat',
    ctaCardTitle: 'Punya Pertanyaan Syariah?',
    ctaCardSub: 'Kami menerima pertanyaan Anda untuk dijawab oleh Komisi Fatwa',
    ctaOnline: 'Tersedia Sekarang',
    ctaPoint1: 'Jawaban terverifikasi dengan rujukan kitab mu\'tamad.',
    ctaPoint2: 'Kerahasiaan penuh untuk urusan pribadi dan keluarga.',
    ctaPoint3: 'Kemudahan pelacakan dengan kode referensi khusus atau WhatsApp.',
    ctaSubmitBtn: 'Kirim Pertanyaan Anda ke Departemen Fatwa',
    ctaTrackLabel: 'Punya nomor pelacakan sebelumnya? Pantau langsung:',
    ctaTrackPlaceholder: 'Masukkan nomor pelacakan (contoh: RM-105)',
    ctaTrackBtn: 'Pantau',
    stat1Label: 'Fatwa Mu\'tamad',
    stat2Label: 'Kategori Fikih',
    stat3Label: 'Riset Ilmiah',
    stat4Val: '24 - 48 Jam',
    stat4Label: 'Rata-rata Waktu Respons',
    catBadge: 'Klasifikasi Tematik',
    catTitle: 'Kategori Fatwa Syariah',
    catSubtitle: 'Pilih bab fikih untuk membaca fatwa terkait',
    fatwaUnit: 'Fatwa',
    allPublishedFatwas: 'Semua Fatwa Terbit',
    categoryPrefix: 'Kategori: ',
    totalResultsPrefix: 'Total Hasil: ',
    filterSearchPlaceholder: 'Filter cepat fatwa...',
    sortNewest: 'Terbaru',
    sortPopular: 'Paling Banyak Dibaca',
    sortNumber: 'Nomor Fatwa',
    noResultsTitle: 'Tidak ditemukan fatwa yang sesuai',
    noResultsDesc: 'Coba ubah kata kunci atau ajukan pertanyaan Anda langsung.',
    showAllFatwasBtn: 'Tampilkan Semua Fatwa',
    fatwaNumPrefix: 'Fatwa No #',
    viewsUnit: 'dilihat',
    questionLabel: 'Pertanyaan:',
    questionerPrefix: 'Penanya: ',
    answerLabel: 'Jawaban dari Departemen Fatwa & Riset:',
    referencesLabel: 'Rujukan & Referensi Fikih Mu\'tamad',
    issuedByFooter: 'Diterbitkan oleh Departemen Fatwa & Riset - Ribat Al-Mustafa Asy-Syihr',
    copyBtn: 'Salin Fatwa',
    whatsappBtn: 'WhatsApp',
    printBtn: 'Cetak',
    saveBtn: 'Simpan',
    savedStateBtn: 'Tersimpan',
    editBtn: 'Edit',
    deleteBtn: 'Hapus',
    askBadge: 'Layanan Fatwa Elektronik',
    askTitle: 'Kirim Pertanyaan Anda ke Departemen Fatwa',
    askDesc: 'Pertanyaan Anda akan diteliti oleh Komisi Fatwa Ribat Al-Mustafa Asy-Syihr.',
    successTitle: 'Pertanyaan Anda Berhasil Diterima!',
    successDesc: 'Pertanyaan telah diteruskan ke Komisi Fatwa. Simpan kode pelacakan berikut:',
    trackingCodeLabel: 'Kode Pelacakan Referensi:',
    viewStatusNowBtn: 'Lihat Status Sekarang',
    askAnotherBtn: 'Kirim Pertanyaan Lain',
    sendViaWhatsappBtn: 'Kirim Langsung via WhatsApp Departemen',
    sendViaEmailBtn: 'Kirim Salinan via Email',
    formNameLabel: 'Nama Penanya',
    formNameHint: '(Opsional - Anda bisa menulis "Hamba Allah")',
    formNamePlaceholder: 'Nama atau inisial Anda',
    formCatLabel: 'Kategori Fikih',
    formContactLabel: 'Nomor WhatsApp atau Email',
    formContactHint: '(Untuk pemberitahuan saat fatwa terbit)',
    formContactPlaceholder: 'contoh: 770000000 atau email',
    formPriorityLabel: 'Tingkat Urgensi Pertanyaan',
    formPriorityNormal: 'Pertanyaan Biasa',
    formPriorityUrgent: 'Mendesak (Talak/Waris/Kematian)',
    formTitleLabel: 'Judul Singkat Pertanyaan',
    formTitlePlaceholder: 'contoh: Hukum jual beli kredit dengan selisih harga tunai',
    formDetailsLabel: 'Teks Pertanyaan Terperinci',
    formDetailsPlaceholder: 'Tuliskan detail pertanyaan dengan jelas...',
    formDetailsNote: 'Harap sebutkan kondisi yang berpengaruh terhadap hukum syariat.',
    formPrivacyCheck: 'Pertanyaan privat (Jangan tampilkan nama saya)',
    formSubmitBtn: 'Kirim Pertanyaan',
    trackTitle: 'Pantau Status Fatwa',
    trackSubtitle: 'Masukkan kode pelacakan untuk mengetahui proses atau membaca fatwa',
    trackInputPlaceholder: 'Masukkan kode pelacakan (contoh: RM-105 atau RM-108)',
    trackCheckBtn: 'Cek Status',
    trackDemoHint: 'Kode contoh untuk pratinjau:',
    trackBrowserHistory: 'Pertanyaan yang dikirim dari browser ini:',
    trackNotFoundTitle: 'Tidak ditemukan fatwa dengan kode',
    trackNotFoundDesc: 'Pastikan kode dimasukkan dengan benar (contoh: RM-105)',
    trackStep1: '1. Pertanyaan Diterima',
    trackStep2: '2. Sedang Dikaji Komisi',
    trackStep3: '3. Fatwa Diterbitkan',
    trackCurrentStatus: 'Status Saat Ini: ',
    trackIssuedAnswer: 'Teks Jawaban Resmi:',
    trackUnderReviewBadge: 'Dalam Proses',
    resBadge: 'Karya Ilmiah & Riset',
    resTitle: 'Publikasi & Riset Ribat Al-Mustafa Asy-Syihr',
    resSubtitle: 'Studi fikih terverifikasi yang diterbitkan oleh Divisi Riset',
    readSummaryBtn: 'Baca Ringkasan',
    closeBtn: 'Tutup',
    aboutBadge: 'Profil Singkat',
    footerQuickLinks: 'Tautan Cepat',
    footerContactTitle: 'Kontak & Informasi',
    footerAskBtn: 'Ajukan Pertanyaan Sekarang',
    bookmarksModalTitle: 'Fatwa Tersimpan di Favorit',
    noBookmarksText: 'Belum ada fatwa yang disimpan di daftar favorit.',
    viewBtn: 'Lihat',
    langChangedMsg: 'Bahasa diubah ke Bahasa Indonesia'
  }
};
