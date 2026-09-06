import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // LEVEL 1: BEGINNER
  {
    id: 1,
    title: 'Introduction to Urdu Keys',
    titleUrdu: 'بنیادی حروفِ تہجی کی مشق',
    description: 'Master the core starting letters: Alif, Bay, Pay, and Tay using A, B, P, T.',
    difficulty: 'Beginner',
    category: 'Vowels & Consonants',
    targetWpm: 15,
    targetAccuracy: 90,
    keysTrained: ['ا', 'ب', 'پ', 'ت'],
    tips: 'Use Left Pinky for A (ا), Left Index for B (ب), and Right Pinky for P (پ).',
    content: [
      'ا ب پ ت',
      'ب پ ت ا',
      'اب با پا تا',
      'باب باپ پات تاب',
      'ابا پاپا تایا باسی'
    ]
  },
  {
    id: 2,
    title: 'Basic Urdu Vowels',
    titleUrdu: 'بنیادی مصوتے (حروفِ علت)',
    description: 'Learn primary vowel sounds: Alif (A), Alif Madda (Shift+A), Wao (W), Choti Yay (I), Bari Yay (Y).',
    difficulty: 'Beginner',
    category: 'Vowels',
    targetWpm: 18,
    targetAccuracy: 90,
    keysTrained: ['ا', 'آ', 'و', 'ی', 'ے'],
    tips: 'Press Shift+A for Alif Madda (آ), W for Wao (و), and Y for Bari Yay (ے).',
    content: [
      'آ ا و ی ے',
      'آیا او با پی بے',
      'آپا آیا بویا پویا تایا',
      'بابا آیا پاپا آئے',
      'آؤ آؤ پانی لاؤ'
    ]
  },
  {
    id: 3,
    title: 'Home Row Consonants',
    titleUrdu: 'ہوم رو کے حروف',
    description: 'Practice the central home row letters: Seen (S), Daal (D), Fay (F), Gaaf (G), Jeem (J), Kaaf (K), Laam (L).',
    difficulty: 'Beginner',
    category: 'Home Row',
    targetWpm: 20,
    targetAccuracy: 92,
    keysTrained: ['س', 'د', 'ف', 'گ', 'ج', 'ک', 'ل'],
    tips: 'Keep fingers gently resting on ASDF and JKL; keys.',
    content: [
      'س د ف گ ج ک ل',
      'دل گل کل جل پل',
      'دادا کا دلاور لاڈلا',
      'سارا گاجر لائی کالا کتا',
      'گاؤں کا کسان دل سے کام کرے'
    ]
  },
  {
    id: 4,
    title: 'Two-Letter Urdu Combinations',
    titleUrdu: 'دو حرفی مرکبات',
    description: 'Develop muscle memory by joining foundational letters into common 2-letter roots.',
    difficulty: 'Beginner',
    category: 'Combinations',
    targetWpm: 22,
    targetAccuracy: 92,
    keysTrained: ['د', 'ر', 'س', 'ت', 'ج', 'م'],
    tips: 'Notice how Urdu letters fluidly connect from right to left as you type.',
    content: [
      'در سر پر تر جا دا',
      'دم کم جم نم ہم تم',
      'رب سچ حق جان مان',
      'دروازہ کھلا رکھو',
      'سچ بولو اور نیکی کرو'
    ]
  },
  {
    id: 5,
    title: 'Simple Urdu Words',
    titleUrdu: 'آسان اور عام فہم الفاظ',
    description: 'Type everyday beginner words with proper letter joining.',
    difficulty: 'Beginner',
    category: 'Basic Words',
    targetWpm: 24,
    targetAccuracy: 93,
    keysTrained: ['ب', 'پ', 'ت', 'ٹ', 'ج', 'چ'],
    tips: 'Press Shift+T for Tay (ٹ) and C for Chay (چ).',
    content: [
      'تارا راجا چاند پانی روٹی',
      'چائے پی لو بات سنو',
      'ٹماٹر لال ہے ٹوپی پیلی ہے',
      'بچے کھیل کود رہے ہیں',
      'میرا گھر بہت پیارا ہے'
    ]
  },

  // LEVEL 2: FOUNDATION
  {
    id: 6,
    title: 'Mastering Multi-Key Sequences',
    titleUrdu: 'مرکب حروف (خ، غ، ش، چ)',
    description: 'Practice multi-character phonetic combinations: sh (ش), kh (خ), gh (غ), ch (چ).',
    difficulty: 'Foundation',
    category: 'Multi-Key Combinations',
    targetWpm: 25,
    targetAccuracy: 93,
    keysTrained: ['ش', 'خ', 'غ', 'چ'],
    tips: 'Type S then H for Sheen (ش), K then H for Khay (خ), G then H for Ghain (غ).',
    content: [
      'شام خوش غار چاند',
      'شیر جنگل کا بادشاہ ہے',
      'خوشی سے کام کرو غریب کی مدد کرو',
      'شاندار چاندنی رات میں باغ خوشبودار تھا',
      'شہری زندگی اور دیہاتی فضا میں فرق ہے'
    ]
  },
  {
    id: 7,
    title: 'Do-Chashmi Hay & Aspirated Letters',
    titleUrdu: 'دو چشمی ھ اور ہکاری آوازیں',
    description: 'Learn aspirated consonants: Bh (بھ), Ph (پھ), Th (تھ), Jh (جھ), Chh (چھ).',
    difficulty: 'Foundation',
    category: 'Aspirated Letters',
    targetWpm: 26,
    targetAccuracy: 93,
    keysTrained: ['بھ', 'پھ', 'تھ', 'جھ', 'چھ', 'کھ', 'گھ'],
    tips: 'Press Shift+O for Do-Chashmi Hay (ھ) or type compound like bh, ph, th.',
    content: [
      'بھائی پھول تھالی جھولا چھتری',
      'گھوڑا گھاس کھا رہا ہے',
      'پھولوں پر بھنورے منڈلا رہے ہیں',
      'جھوٹ بولنا سخت گناہ ہے',
      'بھوک لگی تو گرم کھانا کھایا'
    ]
  },
  {
    id: 8,
    title: 'Retroflex Consonants (ٹ، ڈ، ڑ)',
    titleUrdu: 'معکوسی حروف (ٹ، ڈ، ڑ)',
    description: 'Master Urdu retroflex sounds using Shift keys: Shift+T (ٹ), Shift+D (ڈ), Shift+R (ڑ).',
    difficulty: 'Foundation',
    category: 'Retroflex Letters',
    targetWpm: 28,
    targetAccuracy: 94,
    keysTrained: ['ٹ', 'ڈ', 'ڑ'],
    tips: 'Use left pinky on Shift while right fingers strike T, D, or R.',
    content: [
      'ٹماٹر ڈال کر سالن پکاؤ',
      'ڈاکٹر نے دوا دی اور آرام کا کہا',
      'بڑا درخت سڑک کے کنارے کھڑا ہے',
      'ٹوکری میں میٹھے آم اور انار ہیں',
      'گاڑی تیزی سے موڑ مڑ گئی'
    ]
  },
  {
    id: 9,
    title: 'Everyday Sentences',
    titleUrdu: 'روزمرہ بول چال کے جملے',
    description: 'Practice typing smooth communicative sentences.',
    difficulty: 'Foundation',
    category: 'Sentences',
    targetWpm: 30,
    targetAccuracy: 94,
    keysTrained: ['س', 'ل', 'ا', 'م', 'ع', 'ل', 'ی', 'ک', 'م'],
    tips: 'Use spacebar with your thumb to keep a rhythmic cadence.',
    content: [
      'السلام علیکم! آپ کا کیا حال ہے؟',
      'صبح سویرے سیر کرنا صحت کے لیے اچھا ہے۔',
      'وقت کی قدر کرو کیونکہ گزرا وقت واپس نہیں آتا۔',
      'محنت کامیابی کی کنجی ہے اور ہمیشہ رنگ لاتی ہے۔',
      'ہم سب کو مل جل کر رہنا چاہیے۔'
    ]
  },
  {
    id: 10,
    title: 'Noon Ghunna & Diacritics',
    titleUrdu: 'نون غنہ اور اعراب کی مشق',
    description: 'Type Noon Ghunna (Shift+N) and Tashdeed (Shift+W).',
    difficulty: 'Foundation',
    category: 'Special Characters',
    targetWpm: 30,
    targetAccuracy: 94,
    keysTrained: ['ں', 'ّ', 'ء', 'ئ'],
    tips: 'Shift+N types Noon Ghunna (ں). Shift+W adds Tashdeed (ّ).',
    content: [
      'ماں کی دعا جنت کی ہوا ہے۔',
      'وہ کہاں جا رہے ہیں اور کیوں؟',
      'پرندے آسمان میں پرواز کر رہے ہیں۔',
      'بچوں نے شور مچایا اور ہنسنے لگے۔',
      'ہمیں اپنے ملک کی ترقی میں حصہ لینا چاہیے۔'
    ]
  },

  // LEVEL 3: INTERMEDIATE
  {
    id: 11,
    title: 'Urdu Punctuation & Symbols',
    titleUrdu: 'رموزِ اوقاف اور علامات',
    description: 'Learn the exact Urdu Khatma (۔), Urdu Comma (،), Urdu Question Mark (؟), and brackets.',
    difficulty: 'Intermediate',
    category: 'Punctuation',
    targetWpm: 32,
    targetAccuracy: 95,
    keysTrained: ['۔', '،', '؟', '؛', '!'],
    tips: 'Period key (.) types Urdu Khatma (۔). Comma key (,) types Urdu Comma (،). Shift+/ gives (؟).',
    content: [
      'کیا آپ کل تشریف لائیں گے؟ جی ہاں، ضرور۔',
      'کتاب، کاپی، قلم اور دوات میز پر رکھ دیں۔',
      'واہ! کتنا دلکش اور خوبصورت منظر ہے!',
      'استاد نے فرمایا: ہمیشہ سچ بولو اور ایمانداری اپناؤ۔',
      'علم حاصل کرو؛ چاہے تمہیں چین جانا پڑے۔'
    ]
  },
  {
    id: 12,
    title: 'Urdu Numerals (گنتی)',
    titleUrdu: 'اردو ہندسے اور اعداد',
    description: 'Type Urdu digits: ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ along the number row.',
    difficulty: 'Intermediate',
    category: 'Numbers',
    targetWpm: 28,
    targetAccuracy: 94,
    keysTrained: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'],
    tips: 'Urdu digits correspond directly to the standard top number row 0 through 9.',
    content: [
      'نمبر شمار: ۱، ۲، ۳، ۴، ۵، ۶، ۷، ۸، ۹، ۰',
      'پاکستان ۱۴ اگست ۱۹۴۷ کو وجود میں آیا۔',
      'اس کتاب کی قیمت ۲۵۰ روپے ہے۔',
      'کلاس میں ۴۵ طالب علم موجود تھے۔',
      'سال ۲۰۲۶ میں جدید ٹیکنالوجی تیزی سے پھیل رہی ہے۔'
    ]
  },
  {
    id: 13,
    title: 'Our Beautiful Homeland',
    titleUrdu: 'ہمارا پیارا وطن پاکستان',
    description: 'A patriotic typing drill highlighting geography, culture, and unity.',
    difficulty: 'Intermediate',
    category: 'Culture & Geography',
    targetWpm: 35,
    targetAccuracy: 95,
    keysTrained: ['پ', 'ا', 'ک', 'س', 'ت', 'ن', 'و', 'ط'],
    tips: 'Keep steady breathing and let your fingers glide smoothly between rows.',
    content: [
      'پاکستان ایک خوبصورت اور قدرتی وسائل سے مالامال ملک ہے۔',
      'اس کے چاروں صوبے اپنی منفرد ثقافت اور روایات کے حامل ہیں۔',
      'شمالی علاقہ جات کے بلند و بالا پہاڑ اور وادیاں دنیا بھر میں مشہور ہیں۔',
      'قائداعظم محمد علی جناح نے اتحاد، ایمان اور نظم و ضبط کا درس دیا۔',
      'ہمیں اپنے پیارے وطن کی خوشحالی اور حفاظت کے لیے کام کرنا ہے۔'
    ]
  },
  {
    id: 14,
    title: 'Science and Technology',
    titleUrdu: 'سائنس اور جدید ٹیکنالوجی',
    description: 'Technical and modern scientific vocabulary in Urdu.',
    difficulty: 'Intermediate',
    category: 'Technology',
    targetWpm: 36,
    targetAccuracy: 95,
    keysTrained: ['ک', 'م', 'پ', 'ی', 'و', 'ٹ', 'ر', 'س', 'ا'],
    tips: 'Longer compound words like کمپیوٹر or ٹیکنالوجی benefit from practicing letter triplets.',
    content: [
      'کمپیوٹر سائنس اور انفارمیشن ٹیکنالوجی نے دنیا کو بدل کر رکھ دیا ہے۔',
      'انٹرنیٹ نے مواصلات کے فاصلے سمیٹ کر ایک عالمی گاؤں بنا دیا ہے۔',
      'مصنوعی ذہانت اور روبوٹکس مختلف شعبوں میں انقلاب برپا کر رہے ہیں۔',
      'سافٹ ویئر پروگرامنگ سیکھنا دورِ حاضر کی سب سے اہم مہارت ہے۔',
      'ڈیجیٹل پاکستان کا خواب نوجوانوں کی محنت سے ہی شرمندہ تعبیر ہوگا۔'
    ]
  },
  {
    id: 15,
    title: 'Wisdom and Proverbs',
    titleUrdu: 'اردو ضرب الامثال اور اقوالِ زریں',
    description: 'Classic Urdu idioms and inspirational proverbs.',
    difficulty: 'Intermediate',
    category: 'Literature',
    targetWpm: 38,
    targetAccuracy: 95,
    keysTrained: ['ص', 'ح', 'ب', 'ت', 'ع', 'ق', 'ل'],
    tips: 'Press S for Seen (س), Shift+S for Suad (ص), Shift+H for Bari Hay (ح).',
    content: [
      'قطرہ قطرہ دریا بنتا ہے اور صبر کا پھل ہمیشہ میٹھا ہوتا ہے۔',
      'جیسا کرو گے ویسا بھرو گے، اس لیے سب کے ساتھ بھلائی کرو۔',
      'محنت اتنی خاموشی سے کرو کہ تمہاری کامیابی خود شور مچا دے۔',
      'نیک انسان کی صحبت گلاب کے پھول جیسی ہے جو ہمیشہ مہکتی ہے۔',
      'علم وہ دولت ہے جسے کوئی چرا نہیں سکتا بلکہ بانٹنے سے بڑھتی ہے۔'
    ]
  },

  // LEVEL 4: ADVANCED
  {
    id: 16,
    title: 'Formal Correspondence',
    titleUrdu: 'دفتری مراسلت اور باضابطہ تحریر',
    description: 'Official office letter writing conventions and formal phrases.',
    difficulty: 'Advanced',
    category: 'Professional',
    targetWpm: 40,
    targetAccuracy: 96,
    keysTrained: ['ج', 'ن', 'ا', 'ب', 'ع', 'ا', 'ل', 'ی'],
    tips: 'Pay close attention to polite Urdu honorifics like عالی، تسلیمات، گزارش.',
    content: [
      'جناب عالی! مودبانہ گزارش ہے کہ کمپنی کے سالانہ اجلاس کی کارروائی ملاحظہ فرمائیں۔',
      'امید ہے کہ آپ بخیریت ہوں گے۔ آپ کے مکتوبِ گرامی کا بہت شکریہ۔',
      'مذکورہ فائل کی منظوری کے بعد متعلقہ شعبے کو حتمی احکامات جاری کر دیے گئے ہیں۔',
      'تمام معزز اراکین سے درخواست ہے کہ وقت کی پابندی کو یقینی بنائیں۔',
      'والسلام، نیازمند: انتظامیہ اردو ماسٹر سسٹمز لمیٹڈ۔'
    ]
  },
  {
    id: 17,
    title: 'Urdu Literature & Prose',
    titleUrdu: 'اردو ادب کی چاشنی اور نثری شہکار',
    description: 'Selected refined passages from master Urdu writers.',
    difficulty: 'Advanced',
    category: 'Literature',
    targetWpm: 42,
    targetAccuracy: 96,
    keysTrained: ['ن', 'ث', 'ر', 'ا', 'د', 'ب', 'ش'],
    tips: 'Notice the rhythmic cadence of literary sentence structures.',
    content: [
      'اردو زبان برصغیر پاک و ہند کے باسیوں کا ایک انمول اور مشترکہ تہذیبی ورثہ ہے۔',
      'مرزا اسد اللہ خان غالب کے خطوط نے اردو نثر نگاری میں ایک نئی روح پھونک دی۔',
      'سرسید احمد خان نے سادگی اور سلاست کو اپنا کر اردو کو علمی زبان کا درجہ دیا۔',
      'بانو قدسیہ اور اشفاق احمد کے قلم نے دلوں میں روحانیت اور محبت کی شمع روشن کی۔',
      'لفظوں کی خوبصورتی اور خیالات کی گہرائی ہی اصل ادب کی پہچان ہوا کرتی ہے۔'
    ]
  },
  {
    id: 18,
    title: 'Allama Iqbal’s Message',
    titleUrdu: 'حکیم الامت علامہ اقبال کا پیغام',
    description: 'Poetic verses and philosophical thoughts of Allama Muhammad Iqbal.',
    difficulty: 'Advanced',
    category: 'Philosophy & Poetry',
    targetWpm: 44,
    targetAccuracy: 96,
    keysTrained: ['خ', 'و', 'د', 'ی', 'ش', 'ا', 'ہ', 'ی', 'ن'],
    tips: 'Maintain steady pace on rhyming endings.',
    content: [
      'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے، خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے۔',
      'ستاروں سے آگے جہاں اور بھی ہیں، ابھی عشق کے امتحاں اور بھی ہیں۔',
      'نہیں ہے ناامید اقبال اپنی کشتِ ویراں سے، ذرا نم ہو تو یہ مٹی بڑی زرخیز ہے ساقی۔',
      'عقابی روح جب بیدار ہوتی ہے جوانوں میں، نظر آتی ہے ان کو اپنی منزل آسمانوں میں۔',
      'افراد کے ہاتھوں میں ہے اقوام کی تقدیر، ہر فرد ہے ملت کے مقدر کا ستارہ۔'
    ]
  },
  {
    id: 19,
    title: 'News & Current Affairs',
    titleUrdu: 'قومی اور بین الاقوامی خبریں',
    description: 'Journalistic speed drill covering economy, diplomacy, and global events.',
    difficulty: 'Advanced',
    category: 'Journalism',
    targetWpm: 45,
    targetAccuracy: 97,
    keysTrained: ['خ', 'ب', 'ر', 'ی', 'ں', 'س', 'ف', 'ا', 'ر', 'ت'],
    tips: 'Journalistic style features dense sentence construction—stay relaxed.',
    content: [
      'وفاقی دارالحکومت میں بین الاقوامی تجارتی نمائش کا باقاعدہ آغاز ہو گیا ہے۔',
      'مرکزی بینک کے مطابق ملکی برآمدات میں گزشتہ ماہ کے مقابلے میں خاطر خواہ اضافہ ریکارڈ کیا گیا۔',
      'ماحولیاتی تحفظ کے عالمی ادارے نے موسمیاتی تبدیلیوں سے نمٹنے کے لیے ہنگامی منصوبے پر زور دیا۔',
      'شہر کے مختلف مقامات پر پودے لگانے کی ملک گیر مہم زور و شور سے جاری ہے۔',
      'وزیراعظم نے نوجوانوں کے لیے مفت ڈیجیٹل اسکلز پروگرام کی توسیع کا اعلان کیا۔'
    ]
  },
  {
    id: 20,
    title: 'Advanced Speed Challenge',
    titleUrdu: 'تیز رفتار ٹائپنگ چیلنج (سپیڈ ٹیسٹ)',
    description: 'High-tempo endurance exercise for ambitious typists seeking 50+ WPM.',
    difficulty: 'Advanced',
    category: 'Speed Challenge',
    targetWpm: 50,
    targetAccuracy: 97,
    keysTrained: ['ت', 'ی', 'ز', 'ر', 'ف', 'ت', 'ا', 'ر'],
    tips: 'Do not look down at the keyboard. Trust your finger memory and look ahead at the next word.',
    content: [
      'تیز رفتار اور درست ٹائپنگ انسان کی ذہنی توجہ اور انگلیوں کے تال میل کا شاندار ثبوت ہے۔',
      'ہر روز صرف پندرہ منٹ کی باقاعدہ مشق آپ کو ایک پیشہ ور ٹائپسٹ بنا سکتی ہے۔',
      'کی بورڈ پر نظریں جمانے کے بجائے اسکرین پر نظر رکھنا رفتار میں غیر معمولی اضافہ کرتا ہے۔',
      'اپنی غلطیوں سے مت گھبرائیں بلکہ پرسکون انداز میں اپنی روانی کو برقرار رکھیں۔',
      'اردو ماسٹر کے ذریعے آپ نہ صرف اردو سیکھتے ہیں بلکہ اپنی تخلیقی صلاحیت کو نکھارتے ہیں۔'
    ]
  },

  // LEVEL 5: PROFESSIONAL
  {
    id: 21,
    title: 'Legal & Administrative Drafting',
    titleUrdu: 'قانونی اور انتظامی مسودہ سازی',
    description: 'Professional court petitions, administrative notices, and contractual terms.',
    difficulty: 'Professional',
    category: 'Legal',
    targetWpm: 48,
    targetAccuracy: 97,
    keysTrained: ['ق', 'ا', 'ن', 'و', 'ن', 'ع', 'د', 'ا', 'ل', 'ت'],
    tips: 'Precision with Arabic-origin Urdu loan words is key to professional accuracy.',
    content: [
      'بخدمت جناب سول جج صاحب، عدالتِ عالیہ، گزارش احوال یہ ہے کہ فریقین کے مابین معاہدہ طے پایا۔',
      'فریقِ دوم پابند ہو گا کہ وہ طے شدہ تاریخ تک مکمل دستاویزات اور بقایا جات جمع کرائے۔',
      'کسی بھی نوعیت کے تنازعے کی صورت میں قانونی چارہ جوئی کا حق دونوں فریقین کے پاس محفوظ رہے گا۔',
      'اس اقرار نامے کے تمام مندرجات کو بغور پڑھنے اور سمجھنے کے بعد مکمل ہوش و حواس میں دستخط کیے گئے۔',
      'دستخط فریقِ اول، دستخط فریقِ دوم، مع دو گواہان شد۔'
    ]
  },
  {
    id: 22,
    title: 'Technical Documentation & Coding in Urdu',
    titleUrdu: 'تکنیکی اصطلاحات اور کمپیوٹر کوڈنگ',
    description: 'Software development, databases, and algorithmic concepts rendered in Urdu.',
    difficulty: 'Professional',
    category: 'Engineering',
    targetWpm: 50,
    targetAccuracy: 98,
    keysTrained: ['ڈ', 'ی', 'ٹ', 'ا', 'ب', 'ی', 'س', 'ک', 'و', 'ڈ'],
    tips: 'Seamlessly transition between Urdu text, English technical terms, and punctuation.',
    content: [
      'ریلیشنل ڈیٹا بیس میں معلومات کو منظم جدولوں یعنی ٹیبلز کی صورت میں محفوظ کیا جاتا ہے۔',
      'جاوا اسکرپٹ اور ٹائپ اسکرپٹ کے ذریعے ویب ایپلیکیشنز کے فرنٹ اینڈ اور بیک اینڈ دونوں بنائے جاتے ہیں۔',
      'الگورتھم کا بنیادی مقصد کسی بھی پیچیدہ مسئلے کا سب سے موثر اور آسان ترین حل فراہم کرنا ہے۔',
      'ورژن کنٹرول سسٹم یعنی گٹ کے ذریعے کوڈ میں ہونے والی تمام تر تبدیلیاں تاریخ وار محفوظ رہتی ہیں۔',
      'مستحکم سافٹ ویئر آرکیٹیکچر ہمیشہ قابلِ توسیع، محفوظ اور تیز رفتار ہونا چاہیے۔'
    ]
  },
  {
    id: 23,
    title: 'Urdu Lexicography & Rare Vocabulary',
    titleUrdu: 'جامع لغت اور نادر علمی اصطلاحات',
    description: 'Challenging rare phonemes, classical compounds, and sophisticated phrasing.',
    difficulty: 'Professional',
    category: 'Lexicography',
    targetWpm: 52,
    targetAccuracy: 98,
    keysTrained: ['ث', 'ذ', 'ض', 'ظ', 'غ', 'خ', 'ژ'],
    tips: 'Features rare letters like Zh (ژ), Zwad (ض), Zoay (ظ), Say (ث). Check keyboard hints!',
    content: [
      'ژالہ باری اور تند و تیز آندھی نے وادی کے اطراف میں سردی کی شدت میں یکدم اضافہ کر دیا۔',
      'ضیافتِ باوقار میں مشاہیرِ علم و ادب نے شرکت فرما کر محفل کو چار چاند لگا دیے۔',
      'ظاہری شان و شوکت کے مقابلے میں باطنی پاکیزگی اور حسنِ اخلاق زیادہ اہمیت رکھتے ہیں۔',
      'ثروت و اقتدار کے نشے میں انسان کو کبھی بھی عاجزی اور انکساری کا دامن نہیں چھوڑنا چاہیے۔',
      'غفلت کی نیند سے بیدار ہو کر وقت کے تقاضوں کو سمجھنا ہی دانشمندی ہے۔'
    ]
  },
  {
    id: 24,
    title: 'Professional Transcription Speed Test',
    titleUrdu: 'پیشہ ورانہ ٹرانسکرپشن اور ڈکٹیشن ٹیسٹ',
    description: 'Sustained typing at executive transcription levels.',
    difficulty: 'Professional',
    category: 'Transcription',
    targetWpm: 55,
    targetAccuracy: 98,
    keysTrained: ['پ', 'ی', 'ش', 'ہ', 'و', 'ر', 'ا', 'ن', 'ہ'],
    tips: 'Stay in the flow zone. Move your fingers lightly like playing a musical instrument.',
    content: [
      'معزز سامعین! آج کی کانفرنس کا بنیادی مقصد اردو زبان کو ڈیجیٹل دنیا میں اس کا جائز مقام دلانا ہے۔',
      'ہماری نئی نسل انٹرنیٹ پر زیادہ وقت گزارتی ہے، لہٰذا معیاری اردو مواد کی فراہمی ناگزیر ہو چکی ہے۔',
      'فونک کی بورڈ کی بدولت ہر شخص بغیر کسی خصوصی تربیت کے چند ہی دنوں میں اردو ٹائپنگ سیکھ سکتا ہے۔',
      'تحقیق سے ثابت ہوا ہے کہ مادری زبان میں تعلیم حاصل کرنے والے طلبہ زیادہ تخلیقی صلاحیتوں کے مالک ہوتے ہیں۔',
      'آئیے ہم سب مل کر عہد کریں کہ اردو زبان کی ترقی اور ترویج میں اپنا بھرپور کردار ادا کریں گے۔'
    ]
  },
  {
    id: 25,
    title: 'Urdu Master Grand Certification',
    titleUrdu: 'اردو ماسٹر فائنل گریجویشن امتحان',
    description: 'The ultimate professional assessment. Achieve 50+ WPM with 98% accuracy to earn the Master Badge!',
    difficulty: 'Professional',
    category: 'Certification',
    targetWpm: 60,
    targetAccuracy: 98,
    keysTrained: ['ا', 'ر', 'د', 'و', 'م', 'ا', 'س', 'ٹ', 'ر'],
    tips: 'Concentrate on pure flow and rhythm. You have mastered the keyboard!',
    content: [
      'مبارک ہو! آپ اردو ماسٹر کے فائنل لیول تک پہنچ چکے ہیں جو آپ کی لگن اور مستقل مزاجی کا منہ بولتا ثبوت ہے۔',
      'ٹائپنگ صرف ایک ہنر نہیں بلکہ خیالات کو برق رفتاری سے الفاظ کا روپ دینے کا ایک پروقار فن ہے۔',
      'اب آپ کسی بھی دفتر، میڈیا ہاؤس، یونیورسٹی یا اشاعتی ادارے میں بااعتماد پروفیشنل کے طور پر خدمات انجام دے سکتے ہیں۔',
      'علم، ادب اور ٹیکنالوجی کا یہ حسین امتزاج آپ کے مستقبل کو روشن اور تابناک بنائے گا۔',
      'اردو ماسٹر کی جانب سے آپ کو کامیاب تکمیل پر دلی مبارکباد اور نیک تمنائیں!'
    ]
  }
];

export const PASSAGES_FOR_TESTS = [
  {
    id: 'test-1',
    title: 'The Great Leader (قائداعظم کا فرمودہ)',
    content: 'قائداعظم محمد علی جناح نے قوم کے نام اپنے ایک تاریخ ساز پیغام میں فرمایا کہ ہمیں کام، کام اور بس کام کرنا ہے۔ ہماری منزل اتحاد، ایمان اور نظم و ضبط کی پاسداری میں مضمر ہے۔ ایک مضبوط قوم بننے کے لیے ہمیں آپس کے تمام اختلافات کو بھلا کر صرف اور صرف پاکستان کی فلاح و بہبود کے لیے شب و روز محنت کرنی ہو گی۔'
  },
  {
    id: 'test-2',
    title: 'The Sweetness of Urdu (اردو کی مٹھاس)',
    content: 'اردو دنیا کی حسین ترین اور شیریں زبانوں میں شمار ہوتی ہے۔ اس کی وسعت اور لچک کا اندازہ اس بات سے لگایا جا سکتا ہے کہ اس نے دنیا کی مختلف زبانوں بشمول عربی، فارسی، ترکی اور سنسکرت کے ذخیرہ الفاظ کو اپنے اندر اس طرح سمو لیا کہ وہ اس کا جزوِ لاینفک بن گئے۔ اردو کا نثری اور شعری سرمایہ لاجواب ہے۔'
  },
  {
    id: 'test-3',
    title: 'Future of Digital Pakistan (ڈیجیٹل پاکستان کا مستقبل)',
    content: 'دورِ جدید میں انفارمیشن ٹیکنالوجی کسی بھی ملک کی معاشی ریڑھ کی ہڈی بن چکی ہے۔ پاکستان کے باصلاحیت نوجوان فری لانسنگ، سافٹ ویئر ڈویلپمنٹ اور مصنوعی ذہانت کے شعبوں میں دنیا بھر میں اپنا لوہا منوا رہے ہیں۔ اگر ہم اپنی قومی زبان کو ڈیجیٹل ٹولز سے آراستہ کر دیں تو علم کا دائرہ کار ہر شہری تک پہنچ جائے گا۔'
  },
  {
    id: 'test-4',
    title: 'The Spring Season (بہار کا موسم)',
    content: 'جب سرما کی یخ بستہ ہوائیں رخصت ہوتی ہیں اور وادیوں میں گلاب و چنبیلی کے پھول کھل اٹھتے ہیں تو سارا چمن خوشبو سے مہک اٹھتا ہے۔ پرندوں کے چہچہانے کی دلکش آوازیں کانوں میں رس گھولتی ہیں۔ سبزہ زاروں میں شبنم کے قطرے موتیوں کی مانند چمکتے ہیں۔ یہ قدرت کا وہ حسین تحفہ ہے جو دل کو تازگی بخشتا ہے۔'
  }
];
