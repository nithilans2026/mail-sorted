import type { Strings } from "./i18n";

// Additional languages. Each entry lists the site text in this exact field order (38 strings),
// followed by the 8 category names. Kept positional so 34 languages stay readable; verified by length at load.
const FIELDS = [
  "navTransport", "navTimetable", "navEvents",
  "heroTitle", "heroSub1", "heroSub2", "heroCopy",
  "signIn", "privacy", "inbox", "refresh", "signOut", "refreshing", "updated",
  "deadlines", "nothing", "notImportant", "moveTo", "hiddenSenders", "unhide",
  "deadline", "daysLeft", "today", "readFull", "close", "openGmail", "showOriginal", "showTranslation",
  "translating", "needsKey", "translateFailed", "createdBy", "language", "loading", "mailsCount",
  "toggleTheme", "tabsSide", "tabsTop",
] as const;
const TABS = ["transport", "timetable", "exams", "assignments", "opportunities", "campus", "review", "other"] as const;

function build(code: string, text: string[], tabs: string[]): Strings | null {
  if (text.length !== FIELDS.length || tabs.length !== TABS.length) {
    console.error(`i18n: "${code}" has ${text.length}/${FIELDS.length} strings and ${tabs.length}/${TABS.length} tabs`);
    return null;
  }
  const out: any = { tabs: {} };
  FIELDS.forEach((f, i) => (out[f] = text[i]));
  TABS.forEach((c, i) => (out.tabs[c] = tabs[i]));
  return out as Strings;
}

export const EXTRA_LANGS = [
  { code: "bn", name: "বাংলা", english: "Bengali", locale: "bn-IN" },
  { code: "mr", name: "मराठी", english: "Marathi", locale: "mr-IN" },
  { code: "pa", name: "ਪੰਜਾਬੀ", english: "Punjabi (Gurmukhi)", locale: "pa-IN" },
  { code: "gu", name: "ગુજરાતી", english: "Gujarati", locale: "gu-IN" },
  { code: "kn", name: "ಕನ್ನಡ", english: "Kannada", locale: "kn-IN" },
  { code: "si", name: "සිංහල", english: "Sinhala", locale: "si-LK" },
  { code: "ms", name: "Bahasa Melayu", english: "Malay", locale: "ms-MY" },
  { code: "id", name: "Bahasa Indonesia", english: "Indonesian", locale: "id-ID" },
  { code: "vi", name: "Tiếng Việt", english: "Vietnamese", locale: "vi-VN" },
  { code: "th", name: "ไทย", english: "Thai", locale: "th-TH" },
  { code: "ru", name: "Русский", english: "Russian", locale: "ru-RU" },
  { code: "ar", name: "العربية", english: "Arabic", locale: "ar", dir: "rtl" },
  { code: "ur", name: "اردو", english: "Urdu", locale: "ur-PK", dir: "rtl" },
  { code: "sw", name: "Kiswahili", english: "Swahili", locale: "sw-KE" },
  { code: "af", name: "Afrikaans", english: "Afrikaans", locale: "af-ZA" },
  { code: "hy", name: "Հայերեն", english: "Armenian", locale: "hy-AM" },
  { code: "nl", name: "Nederlands", english: "Dutch", locale: "nl-NL" },
  { code: "pt", name: "Português", english: "Portuguese", locale: "pt-BR" },
  { code: "sv", name: "Svenska", english: "Swedish", locale: "sv-SE" },
  { code: "nb", name: "Norsk", english: "Norwegian (Bokmål)", locale: "nb-NO" },
  { code: "fi", name: "Suomi", english: "Finnish", locale: "fi-FI" },
  { code: "uk", name: "Українська", english: "Ukrainian", locale: "uk-UA" },
  { code: "be", name: "Беларуская", english: "Belarusian", locale: "be-BY" },
  { code: "pl", name: "Polski", english: "Polish", locale: "pl-PL" },
  { code: "sl", name: "Slovenščina", english: "Slovenian", locale: "sl-SI" },
  { code: "sk", name: "Slovenčina", english: "Slovak", locale: "sk-SK" },
  { code: "el", name: "Ελληνικά", english: "Greek", locale: "el-GR" },
  { code: "tr", name: "Türkçe", english: "Turkish", locale: "tr-TR" },
  { code: "he", name: "עברית", english: "Hebrew", locale: "he-IL", dir: "rtl" },
  { code: "sr", name: "Српски", english: "Serbian (Cyrillic)", locale: "sr-RS" },
  { code: "sq", name: "Shqip", english: "Albanian", locale: "sq-AL" },
  { code: "cs", name: "Čeština", english: "Czech", locale: "cs-CZ" },
  { code: "hu", name: "Magyar", english: "Hungarian", locale: "hu-HU" },
  { code: "bs", name: "Bosanski", english: "Bosnian", locale: "bs-BA" },
] as const;

const RAW: Record<string, [string[], string[]]> = {
  bn: [[
    "পরিবহন", "সময়সূচি", "ইভেন্ট",
    "সাজানো।", "আপনার কলেজ", "ইনবক্স",
    "বাসের খবর, সময়সূচির পরিবর্তন, পরীক্ষা, হ্যাকাথন আর ক্যাম্পাসের ইভেন্ট — আপনার কলেজ মেইল থেকে নিজে থেকেই আলাদা করা হয়।",
    "Google দিয়ে সাইন ইন করুন", "শুধু পড়ার অনুমতি। আমরা কখনো আপনার পাসওয়ার্ড দেখি না, আর কোনো মেইল পাঠাই বা মুছি না।",
    "ইনবক্স", "রিফ্রেশ", "সাইন আউট", "রিফ্রেশ হচ্ছে…", "আপডেট: {time}",
    "আসন্ন শেষ তারিখ", "এখানে এখন কিছু নেই।", "গুরুত্বপূর্ণ নয়", "গুরুত্বপূর্ণ → সরান…", "লুকানো প্রেরক ({n})", "আবার দেখান",
    "শেষ তারিখ {date}", "{n} দিন বাকি", "আজ", "পুরো মেইল পড়ুন", "বন্ধ করুন", "Gmail-এ খুলুন", "মূল দেখান", "অনুবাদ দেখান",
    "অনুবাদ হচ্ছে…", "অনুবাদের জন্য Claude API key দরকার (.env.local-এ ANTHROPIC_API_KEY)।", "এখন অনুবাদ করা যাচ্ছে না।",
    "তৈরি করেছেন", "ভাষা", "লোড হচ্ছে…", "{n}টি মেইল", "লাইট/ডার্ক থিম বদলান", "পাশের ট্যাব", "উপরের ট্যাব",
  ], ["পরিবহন", "সময়সূচি", "পরীক্ষার সূচি", "ক্লাস অ্যাসাইনমেন্ট", "ওয়েবিনার ও হ্যাকাথন", "ক্যাম্পাস ইভেন্ট", "পর্যালোচনা", "অন্যান্য"]],

  mr: [[
    "वाहतूक", "वेळापत्रक", "कार्यक्रम",
    "तयार.", "तुमचा कॉलेज", "इनबॉक्स",
    "बस अपडेट्स, वेळापत्रकातील बदल, परीक्षा, हॅकेथॉन आणि कॅम्पस कार्यक्रम — तुमच्या कॉलेज मेलमधून आपोआप वेगळे केले जातात.",
    "Google ने साइन इन करा", "फक्त वाचण्याची परवानगी. आम्ही तुमचा पासवर्ड कधीच पाहत नाही आणि कोणताही मेल पाठवत किंवा हटवत नाही.",
    "इनबॉक्स", "रिफ्रेश करा", "साइन आउट", "रिफ्रेश होत आहे…", "अपडेट: {time}",
    "येणाऱ्या अंतिम तारखा", "सध्या इथे काहीही नाही.", "महत्त्वाचे नाही", "महत्त्वाचे → इथे हलवा…", "लपवलेले प्रेषक ({n})", "पुन्हा दाखवा",
    "अंतिम तारीख {date}", "{n} दिवस बाकी", "आज", "संपूर्ण मेल वाचा", "बंद करा", "Gmail मध्ये उघडा", "मूळ दाखवा", "भाषांतर दाखवा",
    "भाषांतर होत आहे…", "भाषांतरासाठी Claude API key आवश्यक आहे (.env.local मध्ये ANTHROPIC_API_KEY).", "आत्ता भाषांतर करता आले नाही.",
    "निर्माते", "भाषा", "लोड होत आहे…", "{n} मेल", "लाइट/डार्क थीम बदला", "बाजूचे टॅब", "वरचे टॅब",
  ], ["वाहतूक", "वेळापत्रक", "परीक्षा वेळापत्रक", "वर्ग असाइनमेंट", "वेबिनार आणि हॅकेथॉन", "कॅम्पस कार्यक्रम", "पुनरावलोकन", "इतर"]],

  pa: [[
    "ਆਵਾਜਾਈ", "ਸਮਾਂ-ਸਾਰਣੀ", "ਸਮਾਗਮ",
    "ਤਿਆਰ।", "ਤੁਹਾਡਾ ਕਾਲਜ", "ਇਨਬਾਕਸ",
    "ਬੱਸ ਅੱਪਡੇਟ, ਸਮਾਂ-ਸਾਰਣੀ ਵਿੱਚ ਬਦਲਾਅ, ਇਮਤਿਹਾਨ, ਹੈਕਾਥੌਨ ਅਤੇ ਕੈਂਪਸ ਸਮਾਗਮ — ਤੁਹਾਡੀ ਕਾਲਜ ਮੇਲ ਵਿੱਚੋਂ ਆਪਣੇ-ਆਪ ਵੱਖ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।",
    "Google ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ", "ਸਿਰਫ਼ ਪੜ੍ਹਨ ਦੀ ਇਜਾਜ਼ਤ। ਅਸੀਂ ਕਦੇ ਤੁਹਾਡਾ ਪਾਸਵਰਡ ਨਹੀਂ ਦੇਖਦੇ, ਅਤੇ ਨਾ ਹੀ ਕੋਈ ਮੇਲ ਭੇਜਦੇ ਜਾਂ ਮਿਟਾਉਂਦੇ ਹਾਂ।",
    "ਇਨਬਾਕਸ", "ਰਿਫ੍ਰੈਸ਼ ਕਰੋ", "ਸਾਈਨ ਆਊਟ", "ਰਿਫ੍ਰੈਸ਼ ਹੋ ਰਿਹਾ ਹੈ…", "ਅੱਪਡੇਟ: {time}",
    "ਆਉਣ ਵਾਲੀਆਂ ਆਖਰੀ ਤਾਰੀਖਾਂ", "ਇਸ ਵੇਲੇ ਇੱਥੇ ਕੁਝ ਨਹੀਂ ਹੈ।", "ਜ਼ਰੂਰੀ ਨਹੀਂ", "ਜ਼ਰੂਰੀ → ਇੱਥੇ ਭੇਜੋ…", "ਲੁਕਾਏ ਭੇਜਣ ਵਾਲੇ ({n})", "ਮੁੜ ਦਿਖਾਓ",
    "ਆਖਰੀ ਤਾਰੀਖ {date}", "{n} ਦਿਨ ਬਾਕੀ", "ਅੱਜ", "ਪੂਰੀ ਮੇਲ ਪੜ੍ਹੋ", "ਬੰਦ ਕਰੋ", "Gmail ਵਿੱਚ ਖੋਲ੍ਹੋ", "ਮੂਲ ਦਿਖਾਓ", "ਅਨੁਵਾਦ ਦਿਖਾਓ",
    "ਅਨੁਵਾਦ ਹੋ ਰਿਹਾ ਹੈ…", "ਅਨੁਵਾਦ ਲਈ Claude API key ਚਾਹੀਦੀ ਹੈ (.env.local ਵਿੱਚ ANTHROPIC_API_KEY)।", "ਇਸ ਵੇਲੇ ਅਨੁਵਾਦ ਨਹੀਂ ਹੋ ਸਕਿਆ।",
    "ਨਿਰਮਾਤਾ", "ਭਾਸ਼ਾ", "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…", "{n} ਮੇਲ", "ਲਾਈਟ/ਡਾਰਕ ਥੀਮ ਬਦਲੋ", "ਪਾਸੇ ਵਾਲੇ ਟੈਬ", "ਉੱਪਰ ਵਾਲੇ ਟੈਬ",
  ], ["ਆਵਾਜਾਈ", "ਸਮਾਂ-ਸਾਰਣੀ", "ਇਮਤਿਹਾਨ ਸਮਾਂ-ਸਾਰਣੀ", "ਕਲਾਸ ਅਸਾਈਨਮੈਂਟ", "ਵੈਬੀਨਾਰ ਅਤੇ ਹੈਕਾਥੌਨ", "ਕੈਂਪਸ ਸਮਾਗਮ", "ਸਮੀਖਿਆ", "ਹੋਰ"]],

  gu: [[
    "પરિવહન", "સમયપત્રક", "કાર્યક્રમો",
    "તૈયાર.", "તમારું કૉલેજ", "ઇનબોક્સ",
    "બસ અપડેટ્સ, સમયપત્રકમાં ફેરફાર, પરીક્ષાઓ, હેકાથોન અને કેમ્પસ કાર્યક્રમો — તમારા કૉલેજ મેલમાંથી આપમેળે અલગ કરવામાં આવે છે.",
    "Google વડે સાઇન ઇન કરો", "ફક્ત વાંચવાની પરવાનગી. અમે ક્યારેય તમારો પાસવર્ડ જોતા નથી, અને કોઈ મેલ મોકલતા કે કાઢી નાખતા નથી.",
    "ઇનબોક્સ", "રિફ્રેશ કરો", "સાઇન આઉટ", "રિફ્રેશ થઈ રહ્યું છે…", "અપડેટ: {time}",
    "આવનારી છેલ્લી તારીખો", "હમણાં અહીં કંઈ નથી.", "મહત્વનું નથી", "મહત્વનું → અહીં ખસેડો…", "છુપાવેલા મોકલનાર ({n})", "ફરી બતાવો",
    "છેલ્લી તારીખ {date}", "{n} દિવસ બાકી", "આજે", "આખો મેલ વાંચો", "બંધ કરો", "Gmail માં ખોલો", "મૂળ બતાવો", "અનુવાદ બતાવો",
    "અનુવાદ થઈ રહ્યો છે…", "અનુવાદ માટે Claude API key જરૂરી છે (.env.local માં ANTHROPIC_API_KEY).", "હમણાં અનુવાદ થઈ શક્યો નથી.",
    "બનાવનાર", "ભાષા", "લોડ થઈ રહ્યું છે…", "{n} મેલ", "લાઇટ/ડાર્ક થીમ બદલો", "બાજુના ટૅબ", "ઉપરના ટૅબ",
  ], ["પરિવહન", "સમયપત્રક", "પરીક્ષા સમયપત્રક", "વર્ગ અસાઇનમેન્ટ", "વેબિનાર અને હેકાથોન", "કેમ્પસ કાર્યક્રમો", "સમીક્ષા", "અન્ય"]],

  kn: [[
    "ಸಾರಿಗೆ", "ವೇಳಾಪಟ್ಟಿ", "ಕಾರ್ಯಕ್ರಮಗಳು",
    "ಸಿದ್ಧ.", "ನಿಮ್ಮ ಕಾಲೇಜು", "ಇನ್‌ಬಾಕ್ಸ್",
    "ಬಸ್ ಮಾಹಿತಿ, ವೇಳಾಪಟ್ಟಿ ಬದಲಾವಣೆಗಳು, ಪರೀಕ್ಷೆಗಳು, ಹ್ಯಾಕಥಾನ್‌ಗಳು ಮತ್ತು ಕ್ಯಾಂಪಸ್ ಕಾರ್ಯಕ್ರಮಗಳು — ನಿಮ್ಮ ಕಾಲೇಜು ಮೇಲ್‌ನಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಬೇರ್ಪಡಿಸಲಾಗುತ್ತದೆ.",
    "Google ಮೂಲಕ ಸೈನ್ ಇನ್ ಮಾಡಿ", "ಓದಲು ಮಾತ್ರ ಅನುಮತಿ. ನಾವು ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಎಂದಿಗೂ ನೋಡುವುದಿಲ್ಲ, ಮೇಲ್ ಕಳುಹಿಸುವುದಿಲ್ಲ ಅಥವಾ ಅಳಿಸುವುದಿಲ್ಲ.",
    "ಇನ್‌ಬಾಕ್ಸ್", "ರಿಫ್ರೆಶ್", "ಸೈನ್ ಔಟ್", "ರಿಫ್ರೆಶ್ ಆಗುತ್ತಿದೆ…", "ನವೀಕರಿಸಲಾಗಿದೆ: {time}",
    "ಮುಂಬರುವ ಕೊನೆಯ ದಿನಾಂಕಗಳು", "ಈಗ ಇಲ್ಲಿ ಏನೂ ಇಲ್ಲ.", "ಮುಖ್ಯವಲ್ಲ", "ಮುಖ್ಯ → ಇಲ್ಲಿಗೆ ಸರಿಸಿ…", "ಮರೆಮಾಡಿದ ಕಳುಹಿಸುವವರು ({n})", "ಮತ್ತೆ ತೋರಿಸಿ",
    "ಕೊನೆಯ ದಿನಾಂಕ {date}", "{n} ದಿನಗಳು ಬಾಕಿ", "ಇಂದು", "ಪೂರ್ಣ ಮೇಲ್ ಓದಿ", "ಮುಚ್ಚಿ", "Gmail ನಲ್ಲಿ ತೆರೆಯಿರಿ", "ಮೂಲ ತೋರಿಸಿ", "ಅನುವಾದ ತೋರಿಸಿ",
    "ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ…", "ಅನುವಾದಕ್ಕೆ Claude API key ಬೇಕು (.env.local ನಲ್ಲಿ ANTHROPIC_API_KEY).", "ಈಗ ಅನುವಾದಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    "ರಚಿಸಿದವರು", "ಭಾಷೆ", "ಲೋಡ್ ಆಗುತ್ತಿದೆ…", "{n} ಮೇಲ್‌ಗಳು", "ಲೈಟ್/ಡಾರ್ಕ್ ಥೀಮ್ ಬದಲಿಸಿ", "ಪಕ್ಕದ ಟ್ಯಾಬ್‌ಗಳು", "ಮೇಲಿನ ಟ್ಯಾಬ್‌ಗಳು",
  ], ["ಸಾರಿಗೆ", "ವೇಳಾಪಟ್ಟಿ", "ಪರೀಕ್ಷಾ ವೇಳಾಪಟ್ಟಿ", "ತರಗತಿ ಅಸೈನ್‌ಮೆಂಟ್‌ಗಳು", "ವೆಬಿನಾರ್ ಮತ್ತು ಹ್ಯಾಕಥಾನ್", "ಕ್ಯಾಂಪಸ್ ಕಾರ್ಯಕ್ರಮಗಳು", "ಪರಿಶೀಲನೆ", "ಇತರೆ"]],

  si: [[
    "ප්‍රවාහනය", "කාලසටහන", "උත්සව",
    "සූදානම්.", "ඔබේ විශ්වවිද්‍යාල", "එන ලිපි",
    "බස් තොරතුරු, කාලසටහන් වෙනස්කම්, විභාග, හැකතන් සහ කැම්පස් උත්සව — ඔබේ විද්‍යාල ඊමේල් වලින් ස්වයංක්‍රීයව වෙන් කරනු ලැබේ.",
    "Google සමඟ පුරනය වන්න", "කියවීමට පමණක් අවසරය. අපි කිසිදා ඔබේ මුරපදය නොබලන අතර, ඊමේල් යවන්නේ හෝ මකන්නේ නැත.",
    "එන ලිපි", "නැවුම් කරන්න", "වරන්න", "නැවුම් වෙමින්…", "යාවත්කාලීන කළේ: {time}",
    "ඉදිරි අවසන් දින", "දැනට මෙහි කිසිවක් නැත.", "වැදගත් නැත", "වැදගත් → මෙතැනට ගෙන යන්න…", "සැඟවූ යවන්නන් ({n})", "නැවත පෙන්වන්න",
    "අවසන් දිනය {date}", "දින {n}ක් ඉතිරියි", "අද", "සම්පූර්ණ ඊමේල් කියවන්න", "වසන්න", "Gmail හි විවෘත කරන්න", "මුල් පිටපත පෙන්වන්න", "පරිවර්තනය පෙන්වන්න",
    "පරිවර්තනය වෙමින්…", "පරිවර්තනයට Claude API key අවශ්‍යයි (.env.local හි ANTHROPIC_API_KEY).", "දැන් පරිවර්තනය කළ නොහැක.",
    "නිර්මාණය කළේ", "භාෂාව", "පූරණය වෙමින්…", "ඊමේල් {n}", "ආලෝක/අඳුරු තේමාව මාරු කරන්න", "පැති ටැබ්", "ඉහළ ටැබ්",
  ], ["ප්‍රවාහනය", "කාලසටහන", "විභාග කාලසටහන", "පන්ති පැවරුම්", "වෙබිනාර් සහ හැකතන්", "කැම්පස් උත්සව", "සමාලෝචනය", "වෙනත්"]],

  ms: [[
    "PENGANGKUTAN", "JADUAL", "ACARA",
    "Tersusun.", "Peti masuk", "pelajar anda",
    "Makluman bas, perubahan jadual, peperiksaan, hackathon dan acara kampus, diasingkan secara automatik daripada e-mel kolej anda.",
    "Log masuk dengan Google", "Akses baca sahaja. Kami tidak pernah melihat kata laluan anda dan tidak menghantar atau memadam e-mel.",
    "Peti masuk", "Muat semula", "Log keluar", "Memuat semula…", "Dikemas kini {time}",
    "Tarikh akhir akan datang", "Tiada apa-apa di sini buat masa ini.", "Tidak penting", "Penting → pindah ke…", "Penghantar tersembunyi ({n})", "Tunjukkan semula",
    "Tarikh akhir {date}", "{n} hari lagi", "hari ini", "Baca e-mel penuh", "Tutup", "Buka dalam Gmail", "Tunjuk asal", "Tunjuk terjemahan",
    "Menterjemah…", "Terjemahan memerlukan kunci API Claude (ANTHROPIC_API_KEY dalam .env.local).", "Tidak dapat menterjemah sekarang.",
    "Dicipta oleh", "Bahasa", "Memuatkan…", "{n} e-mel", "Tukar tema cerah/gelap", "Tab sisi", "Tab atas",
  ], ["Pengangkutan", "Jadual waktu", "Jadual peperiksaan", "Tugasan kelas", "Webinar & hackathon", "Acara kampus", "Semakan", "Lain-lain"]],

  id: [[
    "TRANSPORTASI", "JADWAL", "ACARA",
    "Tersusun.", "Kotak masuk", "kampusmu",
    "Info bus, perubahan jadwal, ujian, hackathon, dan acara kampus, dipilah otomatis dari email kampusmu.",
    "Masuk dengan Google", "Akses hanya-baca. Kami tidak pernah melihat kata sandimu dan tidak pernah mengirim atau menghapus email.",
    "Kotak masuk", "Muat ulang", "Keluar", "Memuat ulang…", "Diperbarui {time}",
    "Tenggat mendatang", "Belum ada apa-apa di sini.", "Tidak penting", "Penting → pindahkan ke…", "Pengirim disembunyikan ({n})", "Tampilkan lagi",
    "Tenggat {date}", "{n} hari lagi", "hari ini", "Baca email lengkap", "Tutup", "Buka di Gmail", "Lihat asli", "Lihat terjemahan",
    "Menerjemahkan…", "Terjemahan memerlukan kunci API Claude (ANTHROPIC_API_KEY di .env.local).", "Tidak bisa menerjemahkan sekarang.",
    "Dibuat oleh", "Bahasa", "Memuat…", "{n} email", "Ganti tema terang/gelap", "Tab samping", "Tab atas",
  ], ["Transportasi", "Jadwal kuliah", "Jadwal ujian", "Tugas kuliah", "Webinar & hackathon", "Acara kampus", "Tinjau", "Lainnya"]],

  vi: [[
    "GIAO THÔNG", "THỜI KHÓA BIỂU", "SỰ KIỆN",
    "Gọn gàng.", "Hộp thư", "sinh viên của bạn",
    "Thông báo xe buýt, thay đổi thời khóa biểu, lịch thi, hackathon và sự kiện trong trường, được tự động lọc từ email trường của bạn.",
    "Đăng nhập bằng Google", "Chỉ có quyền đọc. Chúng tôi không bao giờ thấy mật khẩu của bạn, cũng không gửi hay xóa email.",
    "Hộp thư đến", "Làm mới", "Đăng xuất", "Đang làm mới…", "Cập nhật lúc {time}",
    "Hạn chót sắp tới", "Hiện chưa có gì ở đây.", "Không quan trọng", "Quan trọng → chuyển sang…", "Người gửi đã ẩn ({n})", "Hiện lại",
    "Hạn chót {date}", "còn {n} ngày", "hôm nay", "Đọc toàn bộ email", "Đóng", "Mở trong Gmail", "Xem bản gốc", "Xem bản dịch",
    "Đang dịch…", "Cần khóa API Claude để dịch (ANTHROPIC_API_KEY trong .env.local).", "Hiện không thể dịch.",
    "Tạo bởi", "Ngôn ngữ", "Đang tải…", "{n} email", "Chuyển giao diện sáng/tối", "Thẻ bên cạnh", "Thẻ phía trên",
  ], ["Giao thông", "Thời khóa biểu", "Lịch thi", "Bài tập trên lớp", "Webinar & hackathon", "Sự kiện trong trường", "Cần xem lại", "Khác"]],

  th: [[
    "การเดินทาง", "ตารางเรียน", "กิจกรรม",
    "เรียบร้อย", "กล่องจดหมาย", "นักศึกษาของคุณ",
    "ข่าวรถบัส การเปลี่ยนตารางเรียน การสอบ แฮกกาธอน และกิจกรรมในมหาวิทยาลัย คัดแยกจากอีเมลมหาวิทยาลัยของคุณโดยอัตโนมัติ",
    "ลงชื่อเข้าใช้ด้วย Google", "สิทธิ์อ่านอย่างเดียว เราไม่เคยเห็นรหัสผ่านของคุณ และไม่ส่งหรือลบอีเมลใด ๆ",
    "กล่องจดหมาย", "รีเฟรช", "ออกจากระบบ", "กำลังรีเฟรช…", "อัปเดตเมื่อ {time}",
    "กำหนดส่งที่ใกล้เข้ามา", "ยังไม่มีอะไรที่นี่", "ไม่สำคัญ", "สำคัญ → ย้ายไปที่…", "ผู้ส่งที่ซ่อนไว้ ({n})", "แสดงอีกครั้ง",
    "กำหนด {date}", "เหลือ {n} วัน", "วันนี้", "อ่านอีเมลฉบับเต็ม", "ปิด", "เปิดใน Gmail", "ดูต้นฉบับ", "ดูคำแปล",
    "กำลังแปล…", "การแปลต้องใช้คีย์ Claude API (ANTHROPIC_API_KEY ใน .env.local)", "ไม่สามารถแปลได้ในขณะนี้",
    "สร้างโดย", "ภาษา", "กำลังโหลด…", "{n} อีเมล", "สลับธีมสว่าง/มืด", "แท็บด้านข้าง", "แท็บด้านบน",
  ], ["การเดินทาง", "ตารางเรียน", "ตารางสอบ", "งานที่ได้รับมอบหมาย", "เว็บินาร์และแฮกกาธอน", "กิจกรรมในมหาวิทยาลัย", "ตรวจทาน", "อื่น ๆ"]],

  ru: [[
    "ТРАНСПОРТ", "РАСПИСАНИЕ", "СОБЫТИЯ",
    "Готово.", "Твоя студенческая", "почта",
    "Новости об автобусах, изменения в расписании, экзамены, хакатоны и события кампуса — автоматически отбираются из твоей университетской почты.",
    "Войти через Google", "Доступ только для чтения. Мы никогда не видим твой пароль и не отправляем и не удаляем письма.",
    "Входящие", "Обновить", "Выйти", "Обновление…", "Обновлено в {time}",
    "Ближайшие дедлайны", "Здесь пока ничего нет.", "Неважно", "Важно → переместить в…", "Скрытые отправители ({n})", "Показать",
    "Срок {date}", "осталось {n} дн.", "сегодня", "Читать письмо полностью", "Закрыть", "Открыть в Gmail", "Показать оригинал", "Показать перевод",
    "Перевод…", "Для перевода нужен API-ключ Claude (ANTHROPIC_API_KEY в .env.local).", "Сейчас не удалось перевести.",
    "Автор", "Язык", "Загрузка…", "Писем: {n}", "Переключить светлую/тёмную тему", "Вкладки сбоку", "Вкладки сверху",
  ], ["Транспорт", "Расписание", "Расписание экзаменов", "Учебные задания", "Вебинары и хакатоны", "События кампуса", "Проверить", "Прочее"]],

  ar: [[
    "النقل", "الجدول", "الفعاليات",
    "مُرتّب.", "بريدك", "الجامعي",
    "أخبار الحافلات وتغييرات الجدول والامتحانات والهاكاثونات وفعاليات الحرم الجامعي، تُفرز تلقائيًا من بريدك الجامعي.",
    "تسجيل الدخول باستخدام Google", "صلاحية قراءة فقط. لا نرى كلمة مرورك أبدًا، ولا نرسل أي بريد أو نحذفه.",
    "البريد الوارد", "تحديث", "تسجيل الخروج", "جارٍ التحديث…", "آخر تحديث {time}",
    "المواعيد النهائية القادمة", "لا شيء هنا الآن.", "غير مهم", "مهم ← انقل إلى…", "المرسلون المخفيون ({n})", "إظهار",
    "الموعد النهائي {date}", "متبقٍ {n} يوم", "اليوم", "قراءة الرسالة كاملة", "إغلاق", "فتح في Gmail", "عرض الأصل", "عرض الترجمة",
    "جارٍ الترجمة…", "تحتاج الترجمة إلى مفتاح Claude API (‏ANTHROPIC_API_KEY في ‎.env.local).", "تعذّرت الترجمة الآن.",
    "من إنشاء", "اللغة", "جارٍ التحميل…", "{n} رسالة", "التبديل بين الوضع الفاتح والداكن", "علامات تبويب جانبية", "علامات تبويب علوية",
  ], ["النقل", "الجدول الدراسي", "جدول الامتحانات", "الواجبات الدراسية", "الندوات والهاكاثونات", "فعاليات الحرم الجامعي", "للمراجعة", "أخرى"]],

  ur: [[
    "ٹرانسپورٹ", "ٹائم ٹیبل", "تقریبات",
    "تیار۔", "آپ کا کالج", "ان باکس",
    "بس کی اطلاعات، ٹائم ٹیبل میں تبدیلیاں، امتحانات، ہیکاتھون اور کیمپس کی تقریبات — آپ کی کالج میل سے خود بخود الگ کی جاتی ہیں۔",
    "Google کے ساتھ سائن ان کریں", "صرف پڑھنے کی اجازت۔ ہم کبھی آپ کا پاس ورڈ نہیں دیکھتے، اور نہ کوئی میل بھیجتے یا حذف کرتے ہیں۔",
    "ان باکس", "ریفریش کریں", "سائن آؤٹ", "ریفریش ہو رہا ہے…", "اپ ڈیٹ: {time}",
    "آنے والی آخری تاریخیں", "ابھی یہاں کچھ نہیں ہے۔", "اہم نہیں", "اہم ← یہاں منتقل کریں…", "چھپائے گئے بھیجنے والے ({n})", "دوبارہ دکھائیں",
    "آخری تاریخ {date}", "{n} دن باقی", "آج", "پوری میل پڑھیں", "بند کریں", "Gmail میں کھولیں", "اصل دکھائیں", "ترجمہ دکھائیں",
    "ترجمہ ہو رہا ہے…", "ترجمے کے لیے Claude API key درکار ہے (‏.env.local میں ANTHROPIC_API_KEY)۔", "ابھی ترجمہ نہیں ہو سکا۔",
    "تخلیق کار", "زبان", "لوڈ ہو رہا ہے…", "{n} میلز", "لائٹ/ڈارک تھیم بدلیں", "سائیڈ ٹیبز", "اوپر ٹیبز",
  ], ["ٹرانسپورٹ", "ٹائم ٹیبل", "امتحانی شیڈول", "کلاس اسائنمنٹس", "ویبینار اور ہیکاتھون", "کیمپس تقریبات", "جائزہ", "دیگر"]],

  sw: [[
    "USAFIRI", "RATIBA", "MATUKIO",
    "Tayari.", "Kikasha chako", "cha chuo",
    "Taarifa za basi, mabadiliko ya ratiba, mitihani, hackathon na matukio ya chuo, hutenganishwa kiotomatiki kutoka barua pepe zako za chuo.",
    "Ingia kwa Google", "Ruhusa ya kusoma tu. Hatuoni nenosiri lako kamwe, wala hatutumi au kufuta barua pepe.",
    "Kikasha", "Onyesha upya", "Toka", "Inaonyesha upya…", "Imesasishwa {time}",
    "Tarehe za mwisho zijazo", "Hakuna kitu hapa kwa sasa.", "Si muhimu", "Muhimu → hamishia…", "Watumaji waliofichwa ({n})", "Onyesha tena",
    "Mwisho {date}", "zimebaki siku {n}", "leo", "Soma barua pepe nzima", "Funga", "Fungua katika Gmail", "Onyesha asili", "Onyesha tafsiri",
    "Inatafsiri…", "Tafsiri inahitaji ufunguo wa API wa Claude (ANTHROPIC_API_KEY katika .env.local).", "Imeshindwa kutafsiri sasa hivi.",
    "Imetengenezwa na", "Lugha", "Inapakia…", "Barua pepe {n}", "Badilisha mandhari mwanga/giza", "Vichupo vya pembeni", "Vichupo vya juu",
  ], ["Usafiri", "Ratiba", "Ratiba ya mitihani", "Kazi za darasani", "Wavuti na hackathon", "Matukio ya chuo", "Kagua", "Mengineyo"]],

  af: [[
    "VERVOER", "ROOSTER", "GELEENTHEDE",
    "Gesorteer.", "Jou student-", "inkassie",
    "Busnuus, roosterveranderinge, eksamens, hackathons en kampusgeleenthede, outomaties uit jou kollege-e-pos gesorteer.",
    "Meld aan met Google", "Slegs leestoegang. Ons sien nooit jou wagwoord nie en stuur of skrap nooit e-pos nie.",
    "Inkassie", "Herlaai", "Meld af", "Herlaai tans…", "Bygewerk om {time}",
    "Komende sperdatums", "Niks hier nie.", "Nie belangrik nie", "Belangrik → skuif na…", "Versteekte afsenders ({n})", "Wys weer",
    "Sperdatum {date}", "nog {n} dae", "vandag", "Lees volledige e-pos", "Maak toe", "Maak oop in Gmail", "Wys oorspronklike", "Wys vertaling",
    "Vertaal tans…", "Vertaling benodig 'n Claude API-sleutel (ANTHROPIC_API_KEY in .env.local).", "Kon nie nou vertaal nie.",
    "Geskep deur", "Taal", "Laai tans…", "{n} e-posse", "Wissel ligte/donker tema", "Kant-oortjies", "Bo-oortjies",
  ], ["Vervoer", "Rooster", "Eksamenrooster", "Klasopdragte", "Webinare en hackathons", "Kampusgeleenthede", "Hersien", "Ander"]],

  hy: [[
    "ՏՐԱՆՍՊՈՐՏ", "ԴԱՍԱՑՈՒՑԱԿ", "ՄԻՋՈՑԱՌՈՒՄՆԵՐ",
    "Պատրաստ է։", "Քո ուսանողական", "փոստը",
    "Ավտոբուսի տեղեկություններ, դասացուցակի փոփոխություններ, քննություններ, հաքաթոններ և համալսարանական միջոցառումներ՝ ավտոմատ կերպով առանձնացված քո համալսարանական փոստից։",
    "Մուտք գործել Google-ով", "Միայն կարդալու թույլտվություն։ Մենք երբեք չենք տեսնում քո գաղտնաբառը և չենք ուղարկում կամ ջնջում նամակներ։",
    "Մուտքային", "Թարմացնել", "Դուրս գալ", "Թարմացվում է…", "Թարմացվել է {time}",
    "Մոտալուտ վերջնաժամկետներ", "Այստեղ դեռ ոչինչ չկա։", "Կարևոր չէ", "Կարևոր → տեղափոխել…", "Թաքցված ուղարկողներ ({n})", "Ցույց տալ",
    "Վերջնաժամկետ՝ {date}", "մնաց {n} օր", "այսօր", "Կարդալ ամբողջ նամակը", "Փակել", "Բացել Gmail-ում", "Ցույց տալ բնօրինակը", "Ցույց տալ թարգմանությունը",
    "Թարգմանվում է…", "Թարգմանության համար անհրաժեշտ է Claude API բանալի (ANTHROPIC_API_KEY՝ .env.local-ում)։", "Այս պահին հնարավոր չէ թարգմանել։",
    "Ստեղծող", "Լեզու", "Բեռնվում է…", "{n} նամակ", "Փոխել լուսավոր/մութ թեման", "Կողային ներդիրներ", "Վերին ներդիրներ",
  ], ["Տրանսպորտ", "Դասացուցակ", "Քննությունների ժամանակացույց", "Դասային առաջադրանքներ", "Վեբինարներ և հաքաթոններ", "Համալսարանական միջոցառումներ", "Ստուգել", "Այլ"]],

  nl: [[
    "VERVOER", "ROOSTER", "EVENEMENTEN",
    "Gesorteerd.", "Jouw studie-", "inbox",
    "Busberichten, roosterwijzigingen, tentamens, hackathons en campusevenementen, automatisch uit je studiemail gefilterd.",
    "Inloggen met Google", "Alleen leestoegang. We zien nooit je wachtwoord en versturen of verwijderen nooit e-mail.",
    "Inbox", "Vernieuwen", "Uitloggen", "Vernieuwen…", "Bijgewerkt om {time}",
    "Aankomende deadlines", "Hier is nu niets.", "Niet belangrijk", "Belangrijk → verplaatsen naar…", "Verborgen afzenders ({n})", "Weer tonen",
    "Deadline {date}", "nog {n} dagen", "vandaag", "Volledige e-mail lezen", "Sluiten", "Openen in Gmail", "Origineel tonen", "Vertaling tonen",
    "Vertalen…", "Vertalen vereist een Claude API-sleutel (ANTHROPIC_API_KEY in .env.local).", "Vertalen lukt nu niet.",
    "Gemaakt door", "Taal", "Laden…", "{n} e-mails", "Licht/donker thema wisselen", "Tabs aan de zijkant", "Tabs bovenaan",
  ], ["Vervoer", "Rooster", "Tentamenrooster", "Opdrachten", "Webinars & hackathons", "Campusevenementen", "Nakijken", "Overig"]],

  pt: [[
    "TRANSPORTE", "HORÁRIO", "EVENTOS",
    "Organizado.", "Sua caixa", "estudantil",
    "Avisos de ônibus, mudanças de horário, provas, hackathons e eventos do campus, separados automaticamente do seu e-mail da faculdade.",
    "Entrar com o Google", "Acesso somente leitura. Nunca vemos sua senha e nunca enviamos nem excluímos e-mails.",
    "Caixa de entrada", "Atualizar", "Sair", "Atualizando…", "Atualizado às {time}",
    "Próximos prazos", "Nada por aqui no momento.", "Não é importante", "Importante → mover para…", "Remetentes ocultos ({n})", "Mostrar",
    "Prazo {date}", "faltam {n} dias", "hoje", "Ler e-mail completo", "Fechar", "Abrir no Gmail", "Ver original", "Ver tradução",
    "Traduzindo…", "A tradução precisa de uma chave de API do Claude (ANTHROPIC_API_KEY no .env.local).", "Não foi possível traduzir agora.",
    "Criado por", "Idioma", "Carregando…", "{n} e-mails", "Alternar tema claro/escuro", "Abas laterais", "Abas no topo",
  ], ["Transporte", "Horário", "Calendário de provas", "Trabalhos da turma", "Webinars e hackathons", "Eventos do campus", "Revisar", "Outros"]],

  sv: [[
    "TRANSPORT", "SCHEMA", "EVENEMANG",
    "Sorterat.", "Din student-", "inkorg",
    "Bussnyheter, schemaändringar, tentor, hackathons och campusevenemang, automatiskt sorterade ur din skolmejl.",
    "Logga in med Google", "Endast läsbehörighet. Vi ser aldrig ditt lösenord och skickar eller raderar aldrig mejl.",
    "Inkorg", "Uppdatera", "Logga ut", "Uppdaterar…", "Uppdaterad {time}",
    "Kommande deadlines", "Inget här just nu.", "Inte viktigt", "Viktigt → flytta till…", "Dolda avsändare ({n})", "Visa igen",
    "Deadline {date}", "{n} dagar kvar", "idag", "Läs hela mejlet", "Stäng", "Öppna i Gmail", "Visa original", "Visa översättning",
    "Översätter…", "Översättning kräver en Claude API-nyckel (ANTHROPIC_API_KEY i .env.local).", "Det gick inte att översätta just nu.",
    "Skapad av", "Språk", "Laddar…", "{n} mejl", "Växla ljust/mörkt tema", "Sidoflikar", "Flikar överst",
  ], ["Transport", "Schema", "Tentaschema", "Klassuppgifter", "Webbinarier & hackathons", "Campusevenemang", "Granska", "Övrigt"]],

  nb: [[
    "TRANSPORT", "TIMEPLAN", "ARRANGEMENTER",
    "Sortert.", "Din student-", "innboks",
    "Bussmeldinger, timeplanendringer, eksamener, hackathons og campusarrangementer, automatisk sortert fra skole-e-posten din.",
    "Logg inn med Google", "Kun lesetilgang. Vi ser aldri passordet ditt og sender eller sletter aldri e-post.",
    "Innboks", "Oppdater", "Logg ut", "Oppdaterer…", "Oppdatert {time}",
    "Kommende frister", "Ingenting her akkurat nå.", "Ikke viktig", "Viktig → flytt til…", "Skjulte avsendere ({n})", "Vis igjen",
    "Frist {date}", "{n} dager igjen", "i dag", "Les hele e-posten", "Lukk", "Åpne i Gmail", "Vis original", "Vis oversettelse",
    "Oversetter…", "Oversettelse krever en Claude API-nøkkel (ANTHROPIC_API_KEY i .env.local).", "Kunne ikke oversette nå.",
    "Laget av", "Språk", "Laster…", "{n} e-poster", "Bytt lyst/mørkt tema", "Sidefaner", "Faner øverst",
  ], ["Transport", "Timeplan", "Eksamensplan", "Klasseoppgaver", "Webinarer og hackathons", "Campusarrangementer", "Gjennomgå", "Annet"]],

  fi: [[
    "LIIKENNE", "LUKUJÄRJESTYS", "TAPAHTUMAT",
    "Valmis.", "Sinun opiskelija-", "postisi",
    "Bussitiedotteet, lukujärjestyksen muutokset, tentit, hackathonit ja kampustapahtumat poimitaan automaattisesti opiskelijasähköpostistasi.",
    "Kirjaudu Googlella", "Vain lukuoikeus. Emme koskaan näe salasanaasi emmekä lähetä tai poista sähköposteja.",
    "Saapuneet", "Päivitä", "Kirjaudu ulos", "Päivitetään…", "Päivitetty {time}",
    "Tulevat määräajat", "Täällä ei ole vielä mitään.", "Ei tärkeä", "Tärkeä → siirrä kohteeseen…", "Piilotetut lähettäjät ({n})", "Näytä uudelleen",
    "Määräaika {date}", "{n} päivää jäljellä", "tänään", "Lue koko viesti", "Sulje", "Avaa Gmailissa", "Näytä alkuperäinen", "Näytä käännös",
    "Käännetään…", "Kääntäminen vaatii Claude API -avaimen (ANTHROPIC_API_KEY tiedostossa .env.local).", "Kääntäminen ei onnistunut juuri nyt.",
    "Tekijä", "Kieli", "Ladataan…", "{n} viestiä", "Vaihda vaalea/tumma teema", "Sivuvälilehdet", "Ylävälilehdet",
  ], ["Liikenne", "Lukujärjestys", "Tenttiaikataulu", "Kurssitehtävät", "Webinaarit ja hackathonit", "Kampustapahtumat", "Tarkista", "Muut"]],

  uk: [[
    "ТРАНСПОРТ", "РОЗКЛАД", "ПОДІЇ",
    "Готово.", "Твоя студентська", "пошта",
    "Новини про автобуси, зміни в розкладі, іспити, хакатони та події кампусу — автоматично відібрані з твоєї університетської пошти.",
    "Увійти через Google", "Доступ лише для читання. Ми ніколи не бачимо твій пароль і не надсилаємо та не видаляємо листи.",
    "Вхідні", "Оновити", "Вийти", "Оновлення…", "Оновлено о {time}",
    "Найближчі дедлайни", "Тут поки нічого немає.", "Неважливо", "Важливо → перемістити до…", "Приховані відправники ({n})", "Показати",
    "Термін {date}", "залишилось {n} дн.", "сьогодні", "Читати лист повністю", "Закрити", "Відкрити в Gmail", "Показати оригінал", "Показати переклад",
    "Переклад…", "Для перекладу потрібен API-ключ Claude (ANTHROPIC_API_KEY у .env.local).", "Зараз не вдалося перекласти.",
    "Автор", "Мова", "Завантаження…", "Листів: {n}", "Перемкнути світлу/темну тему", "Вкладки збоку", "Вкладки зверху",
  ], ["Транспорт", "Розклад", "Розклад іспитів", "Навчальні завдання", "Вебінари та хакатони", "Події кампусу", "Перевірити", "Інше"]],

  be: [[
    "ТРАНСПАРТ", "РАСКЛАД", "ПАДЗЕІ",
    "Гатова.", "Твая студэнцкая", "пошта",
    "Навіны пра аўтобусы, змены ў раскладзе, экзамены, хакатоны і падзеі кампуса — аўтаматычна адабраныя з тваёй універсітэцкай пошты.",
    "Увайсці праз Google", "Доступ толькі для чытання. Мы ніколі не бачым твой пароль і не адпраўляем і не выдаляем лісты.",
    "Уваходныя", "Абнавіць", "Выйсці", "Абнаўленне…", "Абноўлена ў {time}",
    "Бліжэйшыя тэрміны", "Тут пакуль нічога няма.", "Неважна", "Важна → перамясціць у…", "Схаваныя адпраўнікі ({n})", "Паказаць",
    "Тэрмін {date}", "засталося {n} дз.", "сёння", "Чытаць ліст цалкам", "Закрыць", "Адкрыць у Gmail", "Паказаць арыгінал", "Паказаць пераклад",
    "Пераклад…", "Для перакладу патрэбны API-ключ Claude (ANTHROPIC_API_KEY у .env.local).", "Зараз не ўдалося перакласці.",
    "Аўтар", "Мова", "Загрузка…", "Лістоў: {n}", "Пераключыць светлую/цёмную тэму", "Укладкі збоку", "Укладкі зверху",
  ], ["Транспарт", "Расклад", "Расклад экзаменаў", "Навучальныя заданні", "Вебінары і хакатоны", "Падзеі кампуса", "Праверыць", "Іншае"]],

  pl: [[
    "TRANSPORT", "PLAN ZAJĘĆ", "WYDARZENIA",
    "Gotowe.", "Twoja skrzynka", "studencka",
    "Komunikaty o autobusach, zmiany w planie zajęć, egzaminy, hackathony i wydarzenia na kampusie — automatycznie wyłowione z Twojej uczelnianej poczty.",
    "Zaloguj się przez Google", "Dostęp tylko do odczytu. Nigdy nie widzimy Twojego hasła i nigdy nie wysyłamy ani nie usuwamy wiadomości.",
    "Odebrane", "Odśwież", "Wyloguj", "Odświeżanie…", "Zaktualizowano o {time}",
    "Nadchodzące terminy", "Na razie nic tu nie ma.", "Nieważne", "Ważne → przenieś do…", "Ukryci nadawcy ({n})", "Pokaż",
    "Termin {date}", "zostało {n} dni", "dziś", "Czytaj całą wiadomość", "Zamknij", "Otwórz w Gmailu", "Pokaż oryginał", "Pokaż tłumaczenie",
    "Tłumaczenie…", "Tłumaczenie wymaga klucza API Claude (ANTHROPIC_API_KEY w .env.local).", "Nie udało się teraz przetłumaczyć.",
    "Autor", "Język", "Ładowanie…", "Wiadomości: {n}", "Przełącz jasny/ciemny motyw", "Karty z boku", "Karty u góry",
  ], ["Transport", "Plan zajęć", "Harmonogram egzaminów", "Zadania z zajęć", "Webinary i hackathony", "Wydarzenia na kampusie", "Do przejrzenia", "Inne"]],

  sl: [[
    "PREVOZ", "URNIK", "DOGODKI",
    "Urejeno.", "Tvoj študentski", "nabiralnik",
    "Obvestila o avtobusih, spremembe urnika, izpiti, hackathoni in dogodki na kampusu — samodejno izluščeni iz tvoje študentske pošte.",
    "Prijava z Googlom", "Dostop samo za branje. Tvojega gesla nikoli ne vidimo in nikoli ne pošiljamo ali brišemo e-pošte.",
    "Prejeto", "Osveži", "Odjava", "Osveževanje…", "Posodobljeno ob {time}",
    "Prihajajoči roki", "Tu trenutno ni ničesar.", "Ni pomembno", "Pomembno → premakni v…", "Skriti pošiljatelji ({n})", "Prikaži",
    "Rok {date}", "še {n} dni", "danes", "Preberi celotno sporočilo", "Zapri", "Odpri v Gmailu", "Prikaži izvirnik", "Prikaži prevod",
    "Prevajanje…", "Za prevajanje je potreben ključ API za Claude (ANTHROPIC_API_KEY v .env.local).", "Prevajanje trenutno ni uspelo.",
    "Avtor", "Jezik", "Nalaganje…", "Sporočil: {n}", "Preklopi svetlo/temno temo", "Stranski zavihki", "Zgornji zavihki",
  ], ["Prevoz", "Urnik", "Razpored izpitov", "Naloge pri predmetih", "Spletni seminarji in hackathoni", "Dogodki na kampusu", "Za pregled", "Drugo"]],

  sk: [[
    "DOPRAVA", "ROZVRH", "PODUJATIA",
    "Hotovo.", "Tvoja študentská", "schránka",
    "Správy o autobusoch, zmeny rozvrhu, skúšky, hackathony a podujatia na kampuse — automaticky vytriedené z tvojej školskej pošty.",
    "Prihlásiť sa cez Google", "Prístup len na čítanie. Nikdy nevidíme tvoje heslo a nikdy neodosielame ani nemažeme e-maily.",
    "Doručená pošta", "Obnoviť", "Odhlásiť sa", "Obnovuje sa…", "Aktualizované o {time}",
    "Blížiace sa termíny", "Momentálne tu nič nie je.", "Nedôležité", "Dôležité → presunúť do…", "Skrytí odosielatelia ({n})", "Zobraziť",
    "Termín {date}", "zostáva {n} dní", "dnes", "Čítať celý e-mail", "Zavrieť", "Otvoriť v Gmaile", "Zobraziť originál", "Zobraziť preklad",
    "Prekladá sa…", "Preklad vyžaduje kľúč API pre Claude (ANTHROPIC_API_KEY v .env.local).", "Momentálne sa nepodarilo preložiť.",
    "Autor", "Jazyk", "Načítava sa…", "E-mailov: {n}", "Prepnúť svetlú/tmavú tému", "Bočné karty", "Horné karty",
  ], ["Doprava", "Rozvrh", "Rozpis skúšok", "Zadania z predmetov", "Webináre a hackathony", "Podujatia na kampuse", "Na kontrolu", "Ostatné"]],

  el: [[
    "ΜΕΤΑΦΟΡΑ", "ΠΡΟΓΡΑΜΜΑ", "ΕΚΔΗΛΩΣΕΙΣ",
    "Έτοιμο.", "Τα φοιτητικά σου", "εισερχόμενα",
    "Ενημερώσεις λεωφορείων, αλλαγές προγράμματος, εξετάσεις, hackathons και εκδηλώσεις στην πανεπιστημιούπολη, ταξινομημένα αυτόματα από το πανεπιστημιακό σου email.",
    "Σύνδεση με Google", "Πρόσβαση μόνο για ανάγνωση. Δεν βλέπουμε ποτέ τον κωδικό σου και δεν στέλνουμε ούτε διαγράφουμε email.",
    "Εισερχόμενα", "Ανανέωση", "Αποσύνδεση", "Ανανέωση…", "Ενημερώθηκε στις {time}",
    "Επερχόμενες προθεσμίες", "Δεν υπάρχει τίποτα εδώ προς το παρόν.", "Όχι σημαντικό", "Σημαντικό → μετακίνηση σε…", "Κρυφοί αποστολείς ({n})", "Εμφάνιση",
    "Προθεσμία {date}", "απομένουν {n} ημ.", "σήμερα", "Ανάγνωση ολόκληρου του email", "Κλείσιμο", "Άνοιγμα στο Gmail", "Εμφάνιση πρωτοτύπου", "Εμφάνιση μετάφρασης",
    "Μετάφραση…", "Η μετάφραση απαιτεί κλειδί API του Claude (ANTHROPIC_API_KEY στο .env.local).", "Η μετάφραση δεν είναι δυνατή αυτή τη στιγμή.",
    "Δημιουργός", "Γλώσσα", "Φόρτωση…", "{n} email", "Εναλλαγή φωτεινού/σκοτεινού θέματος", "Πλευρικές καρτέλες", "Καρτέλες επάνω",
  ], ["Μεταφορά", "Πρόγραμμα μαθημάτων", "Πρόγραμμα εξετάσεων", "Εργασίες μαθημάτων", "Webinars & hackathons", "Εκδηλώσεις", "Για έλεγχο", "Άλλα"]],

  tr: [[
    "ULAŞIM", "DERS PROGRAMI", "ETKİNLİKLER",
    "Düzenli.", "Öğrenci gelen", "kutun",
    "Servis duyuruları, ders programı değişiklikleri, sınavlar, hackathonlar ve kampüs etkinlikleri, okul e-postandan otomatik olarak ayıklanır.",
    "Google ile giriş yap", "Yalnızca okuma erişimi. Şifreni asla görmeyiz, e-posta göndermeyiz veya silmeyiz.",
    "Gelen kutusu", "Yenile", "Çıkış yap", "Yenileniyor…", "Güncellendi: {time}",
    "Yaklaşan son tarihler", "Şu an burada bir şey yok.", "Önemli değil", "Önemli → şuraya taşı…", "Gizlenen gönderenler ({n})", "Göster",
    "Son tarih {date}", "{n} gün kaldı", "bugün", "E-postanın tamamını oku", "Kapat", "Gmail'de aç", "Orijinali göster", "Çeviriyi göster",
    "Çevriliyor…", "Çeviri için Claude API anahtarı gerekir (.env.local içinde ANTHROPIC_API_KEY).", "Şu anda çevrilemedi.",
    "Hazırlayan", "Dil", "Yükleniyor…", "{n} e-posta", "Açık/koyu temayı değiştir", "Yan sekmeler", "Üst sekmeler",
  ], ["Ulaşım", "Ders programı", "Sınav takvimi", "Ödevler", "Webinarlar ve hackathonlar", "Kampüs etkinlikleri", "İncele", "Diğer"]],

  he: [[
    "תחבורה", "מערכת שעות", "אירועים",
    "מסודר.", "תיבת הסטודנט", "שלך",
    "עדכוני הסעות, שינויים במערכת השעות, מבחנים, האקתונים ואירועי קמפוס — מסוננים אוטומטית מהמייל האקדמי שלך.",
    "התחברות עם Google", "גישת קריאה בלבד. איננו רואים את הסיסמה שלך לעולם, ואיננו שולחים או מוחקים מיילים.",
    "דואר נכנס", "רענון", "התנתקות", "מרענן…", "עודכן ב־{time}",
    "מועדים קרובים", "אין כאן כלום כרגע.", "לא חשוב", "חשוב ← העבר אל…", "שולחים מוסתרים ({n})", "הצג שוב",
    "מועד אחרון {date}", "נותרו {n} ימים", "היום", "קריאת המייל המלא", "סגירה", "פתיחה ב־Gmail", "הצג מקור", "הצג תרגום",
    "מתרגם…", "התרגום דורש מפתח API של Claude ‏(ANTHROPIC_API_KEY בקובץ ‎.env.local).", "לא ניתן לתרגם כרגע.",
    "נוצר על ידי", "שפה", "טוען…", "{n} מיילים", "החלפת ערכת נושא בהירה/כהה", "כרטיסיות בצד", "כרטיסיות למעלה",
  ], ["תחבורה", "מערכת שעות", "לוח מבחנים", "מטלות", "וובינרים והאקתונים", "אירועי קמפוס", "לבדיקה", "אחר"]],

  sr: [[
    "ПРЕВОЗ", "РАСПОРЕД", "ДОГАЂАЈИ",
    "Сређено.", "Твоје студентско", "сандуче",
    "Обавештења о аутобусима, измене распореда, испити, хакатони и догађаји на кампусу — аутоматски издвојени из твоје факултетске поште.",
    "Пријави се преко Google-а", "Приступ само за читање. Никада не видимо твоју лозинку и никада не шаљемо нити бришемо поруке.",
    "Пријемно сандуче", "Освежи", "Одјави се", "Освежавање…", "Ажурирано у {time}",
    "Предстојећи рокови", "Тренутно овде нема ничега.", "Није важно", "Важно → премести у…", "Сакривени пошиљаоци ({n})", "Прикажи",
    "Рок {date}", "још {n} дана", "данас", "Прочитај целу поруку", "Затвори", "Отвори у Gmail-у", "Прикажи оригинал", "Прикажи превод",
    "Превођење…", "За превод је потребан Claude API кључ (ANTHROPIC_API_KEY у .env.local).", "Тренутно није могуће превести.",
    "Аутор", "Језик", "Учитавање…", "Порука: {n}", "Промени светлу/тамну тему", "Бочне картице", "Горње картице",
  ], ["Превоз", "Распоред", "Распоред испита", "Задаци са предавања", "Вебинари и хакатони", "Догађаји на кампусу", "За преглед", "Остало"]],

  sq: [[
    "TRANSPORTI", "ORARI", "AKTIVITETET",
    "Gati.", "Kutia jote", "studentore",
    "Njoftime për autobusët, ndryshime orari, provime, hakatone dhe aktivitete në kampus, të veçuara automatikisht nga emaili yt i universitetit.",
    "Hyr me Google", "Qasje vetëm për lexim. Nuk e shohim kurrë fjalëkalimin tënd dhe nuk dërgojmë apo fshijmë email-e.",
    "Kutia hyrëse", "Rifresko", "Dil", "Duke rifreskuar…", "Përditësuar në {time}",
    "Afatet e ardhshme", "Asgjë këtu për momentin.", "Jo e rëndësishme", "E rëndësishme → zhvendos te…", "Dërguesit e fshehur ({n})", "Shfaq",
    "Afati {date}", "edhe {n} ditë", "sot", "Lexo emailin e plotë", "Mbyll", "Hape në Gmail", "Shfaq origjinalin", "Shfaq përkthimin",
    "Duke përkthyer…", "Përkthimi kërkon një çelës API të Claude (ANTHROPIC_API_KEY në .env.local).", "Nuk u përkthye dot tani.",
    "Krijuar nga", "Gjuha", "Duke u ngarkuar…", "{n} email-e", "Ndrysho temën e çelët/errët", "Skeda anësore", "Skeda sipër",
  ], ["Transporti", "Orari", "Orari i provimeve", "Detyrat e klasës", "Webinare dhe hakatone", "Aktivitete në kampus", "Për rishikim", "Të tjera"]],

  cs: [[
    "DOPRAVA", "ROZVRH", "AKCE",
    "Hotovo.", "Tvoje studentská", "schránka",
    "Zprávy o autobusech, změny rozvrhu, zkoušky, hackathony a akce na kampusu — automaticky vytříděné z tvé školní pošty.",
    "Přihlásit se přes Google", "Přístup jen pro čtení. Nikdy nevidíme tvé heslo a nikdy neodesíláme ani nemažeme e-maily.",
    "Doručená pošta", "Obnovit", "Odhlásit se", "Obnovuje se…", "Aktualizováno v {time}",
    "Blížící se termíny", "Zatím tu nic není.", "Nedůležité", "Důležité → přesunout do…", "Skrytí odesílatelé ({n})", "Zobrazit",
    "Termín {date}", "zbývá {n} dní", "dnes", "Číst celý e-mail", "Zavřít", "Otevřít v Gmailu", "Zobrazit originál", "Zobrazit překlad",
    "Překládá se…", "Překlad vyžaduje klíč API pro Claude (ANTHROPIC_API_KEY v .env.local).", "Teď se nepodařilo přeložit.",
    "Autor", "Jazyk", "Načítání…", "E-mailů: {n}", "Přepnout světlý/tmavý motiv", "Boční karty", "Horní karty",
  ], ["Doprava", "Rozvrh", "Rozpis zkoušek", "Úkoly z předmětů", "Webináře a hackathony", "Akce na kampusu", "Ke kontrole", "Ostatní"]],

  hu: [[
    "KÖZLEKEDÉS", "ÓRAREND", "ESEMÉNYEK",
    "Rendezve.", "A te egyetemi", "postaládád",
    "Buszhírek, órarendváltozások, vizsgák, hackathonok és kampuszesemények, automatikusan kiválogatva az egyetemi leveleidből.",
    "Bejelentkezés Google-fiókkal", "Csak olvasási hozzáférés. Soha nem látjuk a jelszavadat, és soha nem küldünk vagy törlünk leveleket.",
    "Beérkezett", "Frissítés", "Kijelentkezés", "Frissítés…", "Frissítve: {time}",
    "Közelgő határidők", "Itt most nincs semmi.", "Nem fontos", "Fontos → áthelyezés ide…", "Elrejtett feladók ({n})", "Megjelenítés",
    "Határidő: {date}", "még {n} nap", "ma", "Teljes levél olvasása", "Bezárás", "Megnyitás a Gmailben", "Eredeti mutatása", "Fordítás mutatása",
    "Fordítás…", "A fordításhoz Claude API-kulcs kell (ANTHROPIC_API_KEY a .env.local fájlban).", "Most nem sikerült lefordítani.",
    "Készítette", "Nyelv", "Betöltés…", "{n} levél", "Világos/sötét téma váltása", "Oldalsó fülek", "Felső fülek",
  ], ["Közlekedés", "Órarend", "Vizsgabeosztás", "Órai feladatok", "Webináriumok és hackathonok", "Kampuszesemények", "Átnézendő", "Egyéb"]],

  bs: [[
    "PRIJEVOZ", "RASPORED", "DOGAĐAJI",
    "Sređeno.", "Tvoje studentsko", "sanduče",
    "Obavještenja o autobusima, izmjene rasporeda, ispiti, hakatoni i događaji na kampusu — automatski izdvojeni iz tvoje fakultetske pošte.",
    "Prijavi se putem Googlea", "Pristup samo za čitanje. Nikada ne vidimo tvoju lozinku i nikada ne šaljemo niti brišemo poruke.",
    "Pristigla pošta", "Osvježi", "Odjavi se", "Osvježavanje…", "Ažurirano u {time}",
    "Predstojeći rokovi", "Trenutno ovdje nema ničega.", "Nije važno", "Važno → premjesti u…", "Sakriveni pošiljaoci ({n})", "Prikaži",
    "Rok {date}", "još {n} dana", "danas", "Pročitaj cijelu poruku", "Zatvori", "Otvori u Gmailu", "Prikaži original", "Prikaži prijevod",
    "Prevođenje…", "Za prijevod je potreban Claude API ključ (ANTHROPIC_API_KEY u .env.local).", "Trenutno nije moguće prevesti.",
    "Autor", "Jezik", "Učitavanje…", "Poruka: {n}", "Promijeni svijetlu/tamnu temu", "Bočne kartice", "Gornje kartice",
  ], ["Prijevoz", "Raspored", "Raspored ispita", "Zadaci s predavanja", "Webinari i hakatoni", "Događaji na kampusu", "Za pregled", "Ostalo"]],
};

export const EXTRA_STRINGS: Record<string, Strings> = Object.fromEntries(
  Object.entries(RAW)
    .map(([code, [text, tabs]]) => [code, build(code, text, tabs)] as const)
    .filter((entry): entry is readonly [string, Strings] => entry[1] !== null),
);
