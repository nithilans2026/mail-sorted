import type { Category } from "./categorize";
import { EXTRA_LANGS, EXTRA_STRINGS } from "./i18n-extra";

type LangInfo = { code: string; name: string; english: string; locale: string; dir?: "rtl" };

const BASE_LANGS: readonly LangInfo[] = [
  { code: "en", name: "English", english: "English", locale: "en-IN" },
  { code: "ta", name: "தமிழ்", english: "Tamil", locale: "ta-IN" },
  { code: "hi", name: "हिन्दी", english: "Hindi", locale: "hi-IN" },
  { code: "te", name: "తెలుగు", english: "Telugu", locale: "te-IN" },
  { code: "ml", name: "മലയാളം", english: "Malayalam", locale: "ml-IN" },
  { code: "de", name: "Deutsch", english: "German", locale: "de-DE" },
  { code: "fr", name: "Français", english: "French", locale: "fr-FR" },
  { code: "es", name: "Español", english: "Spanish", locale: "es-ES" },
  { code: "zh", name: "中文", english: "Simplified Chinese", locale: "zh-CN" },
  { code: "ja", name: "日本語", english: "Japanese", locale: "ja-JP" },
  { code: "ko", name: "한국어", english: "Korean", locale: "ko-KR" },
];

export const LANGS: readonly LangInfo[] = [...BASE_LANGS, ...EXTRA_LANGS];

export function langInfo(code: string): LangInfo {
  return LANGS.find((l) => l.code === code) ?? LANGS[0];
}

export type Strings = {
  navTransport: string; navTimetable: string; navEvents: string;
  heroTitle: string; heroSub1: string; heroSub2: string; heroCopy: string;
  signIn: string; privacy: string; inbox: string;
  refresh: string; signOut: string; refreshing: string; updated: string;
  deadlines: string; nothing: string; notImportant: string; moveTo: string;
  hiddenSenders: string; unhide: string; deadline: string; daysLeft: string; today: string;
  readFull: string; close: string; openGmail: string; showOriginal: string; showTranslation: string;
  translating: string; needsKey: string; translateFailed: string;
  createdBy: string; language: string; loading: string; mailsCount: string; toggleTheme: string; tabsSide: string; tabsTop: string;
  tabs: Record<Category, string>;
};

const en: Strings = {
  navTransport: "TRANSPORT", navTimetable: "TIMETABLE", navEvents: "EVENTS",
  heroTitle: "Mail Sorted", heroSub1: "Your Student", heroSub2: "Inbox",
  heroCopy: "Bus updates, timetable changes, exams, hackathons and campus events, pulled out of your college mail automatically.",
  signIn: "Sign in with Google",
  privacy: "Read-only access. We never see your password, and never send or delete mail.",
  inbox: "Inbox", refresh: "Refresh", signOut: "Sign out", refreshing: "Refreshing…", updated: "Updated {time}",
  deadlines: "Upcoming deadlines", nothing: "Nothing here right now.", notImportant: "Not important",
  moveTo: "Important → move to…", hiddenSenders: "Hidden senders ({n})", unhide: "Unhide",
  deadline: "Deadline {date}", daysLeft: "{n}d left", today: "today",
  readFull: "Read full mail", close: "Close", openGmail: "Open in Gmail",
  showOriginal: "Show original", showTranslation: "Show translation",
  translating: "Translating…",
  needsKey: "Translation needs a Claude API key (ANTHROPIC_API_KEY in .env.local).",
  translateFailed: "Couldn't translate this right now.",
  createdBy: "Created by", language: "Language", loading: "Loading…", mailsCount: "{n} mails", toggleTheme: "Switch light/dark theme", tabsSide: "Side tabs", tabsTop: "Top tabs",
  tabs: { transport: "Transport", timetable: "Timetable", exams: "Exam Schedule", assignments: "Class Assignments", opportunities: "Webinars & Hackathons", campus: "Campus Events", review: "Review", other: "Other" },
};

const ta: Strings = {
  navTransport: "போக்குவரத்து", navTimetable: "கால அட்டவணை", navEvents: "நிகழ்வுகள்",
  heroTitle: "தயார்.", heroSub1: "உங்கள் மாணவர்", heroSub2: "இன்பாக்ஸ்",
  heroCopy: "பேருந்து அறிவிப்புகள், கால அட்டவணை மாற்றங்கள், தேர்வுகள், ஹேக்கத்தான்கள் மற்றும் வளாக நிகழ்வுகள் — உங்கள் கல்லூரி மின்னஞ்சலில் இருந்து தானாகப் பிரித்தெடுக்கப்படுகின்றன.",
  signIn: "Google மூலம் உள்நுழைக",
  privacy: "படிக்க மட்டும் அனுமதி. உங்கள் கடவுச்சொல்லை நாங்கள் பார்ப்பதில்லை; மின்னஞ்சல்களை அனுப்புவதோ நீக்குவதோ இல்லை.",
  inbox: "இன்பாக்ஸ்", refresh: "புதுப்பி", signOut: "வெளியேறு", refreshing: "புதுப்பிக்கிறது…", updated: "புதுப்பித்தது: {time}",
  deadlines: "வரவிருக்கும் கடைசி தேதிகள்", nothing: "இப்போது இங்கு எதுவும் இல்லை.", notImportant: "முக்கியமில்லை",
  moveTo: "முக்கியம் → இங்கு நகர்த்து…", hiddenSenders: "மறைக்கப்பட்ட அனுப்புநர்கள் ({n})", unhide: "மீண்டும் காட்டு",
  deadline: "கடைசி தேதி {date}", daysLeft: "{n} நாட்கள் உள்ளன", today: "இன்று",
  readFull: "முழு மின்னஞ்சலைப் படி", close: "மூடு", openGmail: "Gmail-இல் திற",
  showOriginal: "மூலத்தைக் காட்டு", showTranslation: "மொழிபெயர்ப்பைக் காட்டு",
  translating: "மொழிபெயர்க்கிறது…",
  needsKey: "மொழிபெயர்ப்புக்கு Claude API key தேவை (.env.local-இல் ANTHROPIC_API_KEY).",
  translateFailed: "இப்போது மொழிபெயர்க்க முடியவில்லை.",
  createdBy: "உருவாக்கியவர்", language: "மொழி", loading: "ஏற்றுகிறது…", mailsCount: "{n} மின்னஞ்சல்கள்", toggleTheme: "ஒளி/இருள் தீமை மாற்று", tabsSide: "பக்கவாட்டு தாவல்கள்", tabsTop: "மேல் தாவல்கள்",
  tabs: { transport: "போக்குவரத்து", timetable: "கால அட்டவணை", exams: "தேர்வு அட்டவணை", assignments: "வகுப்பு ஒப்படைப்புகள்", opportunities: "வெபினார்கள் & ஹேக்கத்தான்கள்", campus: "வளாக நிகழ்வுகள்", review: "பரிசீலனை", other: "மற்றவை" },
};

const hi: Strings = {
  navTransport: "परिवहन", navTimetable: "समय-सारिणी", navEvents: "कार्यक्रम",
  heroTitle: "तैयार।", heroSub1: "आपका छात्र", heroSub2: "इनबॉक्स",
  heroCopy: "बस अपडेट, समय-सारिणी में बदलाव, परीक्षाएँ, हैकाथॉन और कैंपस कार्यक्रम — आपके कॉलेज मेल से अपने-आप छाँटे जाते हैं।",
  signIn: "Google से साइन इन करें",
  privacy: "केवल पढ़ने की अनुमति। हम आपका पासवर्ड कभी नहीं देखते, और न ही कोई मेल भेजते या हटाते हैं।",
  inbox: "इनबॉक्स", refresh: "रीफ़्रेश करें", signOut: "साइन आउट", refreshing: "रीफ़्रेश हो रहा है…", updated: "अपडेट किया गया: {time}",
  deadlines: "आने वाली अंतिम तिथियाँ", nothing: "अभी यहाँ कुछ नहीं है।", notImportant: "ज़रूरी नहीं",
  moveTo: "ज़रूरी → यहाँ ले जाएँ…", hiddenSenders: "छिपाए गए प्रेषक ({n})", unhide: "फिर से दिखाएँ",
  deadline: "अंतिम तिथि {date}", daysLeft: "{n} दिन बाकी", today: "आज",
  readFull: "पूरा मेल पढ़ें", close: "बंद करें", openGmail: "Gmail में खोलें",
  showOriginal: "मूल दिखाएँ", showTranslation: "अनुवाद दिखाएँ",
  translating: "अनुवाद हो रहा है…",
  needsKey: "अनुवाद के लिए Claude API key चाहिए (.env.local में ANTHROPIC_API_KEY)।",
  translateFailed: "अभी अनुवाद नहीं हो सका।",
  createdBy: "निर्माता", language: "भाषा", loading: "लोड हो रहा है…", mailsCount: "{n} मेल", toggleTheme: "लाइट/डार्क थीम बदलें", tabsSide: "साइड टैब", tabsTop: "ऊपर टैब",
  tabs: { transport: "परिवहन", timetable: "समय-सारिणी", exams: "परीक्षा कार्यक्रम", assignments: "कक्षा असाइनमेंट", opportunities: "वेबिनार और हैकाथॉन", campus: "कैंपस कार्यक्रम", review: "समीक्षा", other: "अन्य" },
};

const te: Strings = {
  navTransport: "రవాణా", navTimetable: "టైమ్‌టేబుల్", navEvents: "ఈవెంట్లు",
  heroTitle: "సిద్ధం.", heroSub1: "మీ విద్యార్థి", heroSub2: "ఇన్‌బాక్స్",
  heroCopy: "బస్ అప్‌డేట్లు, టైమ్‌టేబుల్ మార్పులు, పరీక్షలు, హ్యాకథాన్‌లు, క్యాంపస్ ఈవెంట్లు — మీ కాలేజీ మెయిల్ నుండి ఆటోమేటిక్‌గా వేరు చేయబడతాయి.",
  signIn: "Googleతో సైన్ ఇన్ చేయండి",
  privacy: "చదవడానికి మాత్రమే అనుమతి. మేము మీ పాస్‌వర్డ్‌ను ఎప్పుడూ చూడము, మెయిల్‌ను పంపము లేదా తొలగించము.",
  inbox: "ఇన్‌బాక్స్", refresh: "రిఫ్రెష్", signOut: "సైన్ అవుట్", refreshing: "రిఫ్రెష్ అవుతోంది…", updated: "అప్‌డేట్ చేసిన సమయం: {time}",
  deadlines: "రాబోయే గడువులు", nothing: "ప్రస్తుతం ఇక్కడ ఏమీ లేదు.", notImportant: "ముఖ్యం కాదు",
  moveTo: "ముఖ్యం → ఇక్కడికి తరలించు…", hiddenSenders: "దాచిన పంపినవారు ({n})", unhide: "మళ్ళీ చూపించు",
  deadline: "గడువు {date}", daysLeft: "{n} రోజులు మిగిలాయి", today: "ఈరోజు",
  readFull: "పూర్తి మెయిల్ చదవండి", close: "మూసివేయి", openGmail: "Gmailలో తెరవండి",
  showOriginal: "అసలు చూపించు", showTranslation: "అనువాదం చూపించు",
  translating: "అనువదిస్తోంది…",
  needsKey: "అనువాదానికి Claude API key అవసరం (.env.localలో ANTHROPIC_API_KEY).",
  translateFailed: "ప్రస్తుతం అనువదించలేకపోయాం.",
  createdBy: "రూపొందించినవారు", language: "భాష", loading: "లోడ్ అవుతోంది…", mailsCount: "{n} మెయిల్స్", toggleTheme: "లైట్/డార్క్ థీమ్ మార్చు", tabsSide: "పక్క ట్యాబ్‌లు", tabsTop: "పై ట్యాబ్‌లు",
  tabs: { transport: "రవాణా", timetable: "టైమ్‌టేబుల్", exams: "పరీక్షల షెడ్యూల్", assignments: "క్లాస్ అసైన్‌మెంట్లు", opportunities: "వెబినార్లు & హ్యాకథాన్‌లు", campus: "క్యాంపస్ ఈవెంట్లు", review: "సమీక్ష", other: "ఇతరాలు" },
};

const ml: Strings = {
  navTransport: "ഗതാഗതം", navTimetable: "ടൈംടേബിൾ", navEvents: "പരിപാടികൾ",
  heroTitle: "തയ്യാർ.", heroSub1: "നിങ്ങളുടെ വിദ്യാർത്ഥി", heroSub2: "ഇൻബോക്സ്",
  heroCopy: "ബസ് അറിയിപ്പുകൾ, ടൈംടേബിൾ മാറ്റങ്ങൾ, പരീക്ഷകൾ, ഹാക്കത്തോണുകൾ, ക്യാമ്പസ് പരിപാടികൾ — നിങ്ങളുടെ കോളേജ് മെയിലിൽ നിന്ന് സ്വയമേവ വേർതിരിക്കുന്നു.",
  signIn: "Google ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക",
  privacy: "വായിക്കാൻ മാത്രമുള്ള അനുമതി. ഞങ്ങൾ നിങ്ങളുടെ പാസ്‌വേഡ് കാണുന്നില്ല, മെയിൽ അയയ്ക്കുകയോ ഇല്ലാതാക്കുകയോ ചെയ്യുന്നില്ല.",
  inbox: "ഇൻബോക്സ്", refresh: "പുതുക്കുക", signOut: "സൈൻ ഔട്ട്", refreshing: "പുതുക്കുന്നു…", updated: "പുതുക്കിയത്: {time}",
  deadlines: "വരാനിരിക്കുന്ന അവസാന തീയതികൾ", nothing: "ഇപ്പോൾ ഇവിടെ ഒന്നുമില്ല.", notImportant: "പ്രധാനമല്ല",
  moveTo: "പ്രധാനം → ഇതിലേക്ക് മാറ്റുക…", hiddenSenders: "മറച്ച അയച്ചവർ ({n})", unhide: "വീണ്ടും കാണിക്കുക",
  deadline: "അവസാന തീയതി {date}", daysLeft: "{n} ദിവസം ബാക്കി", today: "ഇന്ന്",
  readFull: "മുഴുവൻ മെയിൽ വായിക്കുക", close: "അടയ്ക്കുക", openGmail: "Gmail-ൽ തുറക്കുക",
  showOriginal: "യഥാർത്ഥം കാണിക്കുക", showTranslation: "വിവർത്തനം കാണിക്കുക",
  translating: "വിവർത്തനം ചെയ്യുന്നു…",
  needsKey: "വിവർത്തനത്തിന് Claude API key ആവശ്യമാണ് (.env.local-ൽ ANTHROPIC_API_KEY).",
  translateFailed: "ഇപ്പോൾ വിവർത്തനം ചെയ്യാനായില്ല.",
  createdBy: "നിർമ്മിച്ചത്", language: "ഭാഷ", loading: "ലോഡ് ചെയ്യുന്നു…", mailsCount: "{n} മെയിലുകൾ", toggleTheme: "ലൈറ്റ്/ഡാർക്ക് തീം മാറ്റുക", tabsSide: "വശത്തെ ടാബുകൾ", tabsTop: "മുകളിലെ ടാബുകൾ",
  tabs: { transport: "ഗതാഗതം", timetable: "ടൈംടേബിൾ", exams: "പരീക്ഷാ ഷെഡ്യൂൾ", assignments: "ക്ലാസ് അസൈൻമെന്റുകൾ", opportunities: "വെബിനാറുകളും ഹാക്കത്തോണുകളും", campus: "ക്യാമ്പസ് പരിപാടികൾ", review: "അവലോകനം", other: "മറ്റുള്ളവ" },
};

const de: Strings = {
  navTransport: "TRANSPORT", navTimetable: "STUNDENPLAN", navEvents: "EVENTS",
  heroTitle: "Sortiert.", heroSub1: "Dein Uni-", heroSub2: "Postfach",
  heroCopy: "Busmeldungen, Stundenplanänderungen, Prüfungen, Hackathons und Campus-Events – automatisch aus deinen Uni-Mails herausgefiltert.",
  signIn: "Mit Google anmelden",
  privacy: "Nur Lesezugriff. Wir sehen nie dein Passwort und senden oder löschen keine E-Mails.",
  inbox: "Posteingang", refresh: "Aktualisieren", signOut: "Abmelden", refreshing: "Wird aktualisiert…", updated: "Aktualisiert um {time}",
  deadlines: "Anstehende Fristen", nothing: "Hier ist gerade nichts.", notImportant: "Nicht wichtig",
  moveTo: "Wichtig → verschieben nach…", hiddenSenders: "Ausgeblendete Absender ({n})", unhide: "Wieder anzeigen",
  deadline: "Frist {date}", daysLeft: "noch {n} Tage", today: "heute",
  readFull: "Ganze E-Mail lesen", close: "Schließen", openGmail: "In Gmail öffnen",
  showOriginal: "Original anzeigen", showTranslation: "Übersetzung anzeigen",
  translating: "Wird übersetzt…",
  needsKey: "Für Übersetzungen wird ein Claude-API-Schlüssel benötigt (ANTHROPIC_API_KEY in .env.local).",
  translateFailed: "Übersetzung gerade nicht möglich.",
  createdBy: "Erstellt von", language: "Sprache", loading: "Wird geladen…", mailsCount: "{n} E-Mails", toggleTheme: "Hell-/Dunkelmodus wechseln", tabsSide: "Seitliche Tabs", tabsTop: "Obere Tabs",
  tabs: { transport: "Transport", timetable: "Stundenplan", exams: "Prüfungsplan", assignments: "Kursaufgaben", opportunities: "Webinare & Hackathons", campus: "Campus-Events", review: "Zur Durchsicht", other: "Sonstiges" },
};

const fr: Strings = {
  navTransport: "TRANSPORT", navTimetable: "EMPLOI DU TEMPS", navEvents: "ÉVÉNEMENTS",
  heroTitle: "Trié.", heroSub1: "Ta boîte", heroSub2: "mail étudiante",
  heroCopy: "Infos bus, changements d'emploi du temps, examens, hackathons et événements du campus, extraits automatiquement de ta messagerie universitaire.",
  signIn: "Se connecter avec Google",
  privacy: "Accès en lecture seule. Nous ne voyons jamais ton mot de passe et n'envoyons ni ne supprimons aucun e-mail.",
  inbox: "Boîte de réception", refresh: "Actualiser", signOut: "Se déconnecter", refreshing: "Actualisation…", updated: "Mis à jour à {time}",
  deadlines: "Échéances à venir", nothing: "Rien pour le moment.", notImportant: "Pas important",
  moveTo: "Important → déplacer vers…", hiddenSenders: "Expéditeurs masqués ({n})", unhide: "Afficher",
  deadline: "Échéance {date}", daysLeft: "{n} j restants", today: "aujourd'hui",
  readFull: "Lire l'e-mail complet", close: "Fermer", openGmail: "Ouvrir dans Gmail",
  showOriginal: "Voir l'original", showTranslation: "Voir la traduction",
  translating: "Traduction…",
  needsKey: "La traduction nécessite une clé API Claude (ANTHROPIC_API_KEY dans .env.local).",
  translateFailed: "Impossible de traduire pour le moment.",
  createdBy: "Créé par", language: "Langue", loading: "Chargement…", mailsCount: "{n} e-mails", toggleTheme: "Basculer thème clair/sombre", tabsSide: "Onglets latéraux", tabsTop: "Onglets en haut",
  tabs: { transport: "Transport", timetable: "Emploi du temps", exams: "Calendrier des examens", assignments: "Devoirs", opportunities: "Webinaires & hackathons", campus: "Événements du campus", review: "À vérifier", other: "Autres" },
};

const es: Strings = {
  navTransport: "TRANSPORTE", navTimetable: "HORARIO", navEvents: "EVENTOS",
  heroTitle: "Ordenado.", heroSub1: "Tu bandeja", heroSub2: "estudiantil",
  heroCopy: "Avisos de autobús, cambios de horario, exámenes, hackatones y eventos del campus, extraídos automáticamente de tu correo universitario.",
  signIn: "Iniciar sesión con Google",
  privacy: "Acceso de solo lectura. Nunca vemos tu contraseña y nunca enviamos ni borramos correos.",
  inbox: "Bandeja de entrada", refresh: "Actualizar", signOut: "Cerrar sesión", refreshing: "Actualizando…", updated: "Actualizado a las {time}",
  deadlines: "Próximas fechas límite", nothing: "No hay nada aquí por ahora.", notImportant: "No es importante",
  moveTo: "Importante → mover a…", hiddenSenders: "Remitentes ocultos ({n})", unhide: "Mostrar",
  deadline: "Fecha límite {date}", daysLeft: "quedan {n} d", today: "hoy",
  readFull: "Leer correo completo", close: "Cerrar", openGmail: "Abrir en Gmail",
  showOriginal: "Ver original", showTranslation: "Ver traducción",
  translating: "Traduciendo…",
  needsKey: "La traducción necesita una clave de API de Claude (ANTHROPIC_API_KEY en .env.local).",
  translateFailed: "No se pudo traducir ahora.",
  createdBy: "Creado por", language: "Idioma", loading: "Cargando…", mailsCount: "{n} correos", toggleTheme: "Cambiar tema claro/oscuro", tabsSide: "Pestañas laterales", tabsTop: "Pestañas arriba",
  tabs: { transport: "Transporte", timetable: "Horario", exams: "Calendario de exámenes", assignments: "Tareas de clase", opportunities: "Webinars y hackatones", campus: "Eventos del campus", review: "Revisar", other: "Otros" },
};

const zh: Strings = {
  navTransport: "交通", navTimetable: "课表", navEvents: "活动",
  heroTitle: "已整理。", heroSub1: "你的学生", heroSub2: "收件箱",
  heroCopy: "校车通知、课表变动、考试、黑客松和校园活动——自动从你的学校邮箱中整理出来。",
  signIn: "使用 Google 登录",
  privacy: "仅读取权限。我们绝不会看到你的密码，也不会发送或删除邮件。",
  inbox: "收件箱", refresh: "刷新", signOut: "退出登录", refreshing: "正在刷新…", updated: "更新于 {time}",
  deadlines: "即将到来的截止日期", nothing: "这里暂时没有内容。", notImportant: "不重要",
  moveTo: "重要 → 移至…", hiddenSenders: "已隐藏的发件人（{n}）", unhide: "取消隐藏",
  deadline: "截止 {date}", daysLeft: "剩 {n} 天", today: "今天",
  readFull: "阅读完整邮件", close: "关闭", openGmail: "在 Gmail 中打开",
  showOriginal: "显示原文", showTranslation: "显示译文",
  translating: "正在翻译…",
  needsKey: "翻译功能需要 Claude API 密钥（.env.local 中的 ANTHROPIC_API_KEY）。",
  translateFailed: "暂时无法翻译。",
  createdBy: "作者", language: "语言", loading: "加载中…", mailsCount: "{n} 封邮件", toggleTheme: "切换浅色/深色主题", tabsSide: "侧边标签", tabsTop: "顶部标签",
  tabs: { transport: "交通", timetable: "课表", exams: "考试安排", assignments: "课程作业", opportunities: "讲座与黑客松", campus: "校园活动", review: "待查看", other: "其他" },
};

const ja: Strings = {
  navTransport: "交通", navTimetable: "時間割", navEvents: "イベント",
  heroTitle: "整理済み。", heroSub1: "あなたの大学", heroSub2: "受信トレイ",
  heroCopy: "バスのお知らせ、時間割の変更、試験、ハッカソン、キャンパスイベントを、大学のメールから自動で振り分けます。",
  signIn: "Google でログイン",
  privacy: "読み取り専用のアクセスです。パスワードを見ることはなく、メールを送信・削除することもありません。",
  inbox: "受信トレイ", refresh: "更新", signOut: "ログアウト", refreshing: "更新中…", updated: "{time} に更新",
  deadlines: "近づいている締め切り", nothing: "今のところ何もありません。", notImportant: "重要ではない",
  moveTo: "重要 → 移動先…", hiddenSenders: "非表示の送信者（{n}）", unhide: "再表示",
  deadline: "締め切り {date}", daysLeft: "残り{n}日", today: "今日",
  readFull: "メール全文を読む", close: "閉じる", openGmail: "Gmail で開く",
  showOriginal: "原文を表示", showTranslation: "翻訳を表示",
  translating: "翻訳中…",
  needsKey: "翻訳には Claude API キーが必要です（.env.local の ANTHROPIC_API_KEY）。",
  translateFailed: "現在翻訳できません。",
  createdBy: "作成者", language: "言語", loading: "読み込み中…", mailsCount: "{n} 件のメール", toggleTheme: "ライト/ダークテーマを切り替え", tabsSide: "サイドタブ", tabsTop: "上部タブ",
  tabs: { transport: "交通", timetable: "時間割", exams: "試験日程", assignments: "授業の課題", opportunities: "ウェビナー・ハッカソン", campus: "キャンパスイベント", review: "要確認", other: "その他" },
};

const ko: Strings = {
  navTransport: "교통", navTimetable: "시간표", navEvents: "행사",
  heroTitle: "정리 완료.", heroSub1: "나의 학교", heroSub2: "받은편지함",
  heroCopy: "버스 공지, 시간표 변경, 시험, 해커톤, 캠퍼스 행사를 학교 메일에서 자동으로 분류해 드립니다.",
  signIn: "Google로 로그인",
  privacy: "읽기 전용 권한입니다. 비밀번호를 볼 수 없으며 메일을 보내거나 삭제하지 않습니다.",
  inbox: "받은편지함", refresh: "새로고침", signOut: "로그아웃", refreshing: "새로고침 중…", updated: "{time}에 업데이트됨",
  deadlines: "다가오는 마감일", nothing: "지금은 아무것도 없습니다.", notImportant: "중요하지 않음",
  moveTo: "중요 → 이동…", hiddenSenders: "숨긴 발신자 ({n})", unhide: "다시 표시",
  deadline: "마감 {date}", daysLeft: "{n}일 남음", today: "오늘",
  readFull: "전체 메일 읽기", close: "닫기", openGmail: "Gmail에서 열기",
  showOriginal: "원문 보기", showTranslation: "번역 보기",
  translating: "번역 중…",
  needsKey: "번역하려면 Claude API 키가 필요합니다 (.env.local의 ANTHROPIC_API_KEY).",
  translateFailed: "지금은 번역할 수 없습니다.",
  createdBy: "제작자", language: "언어", loading: "불러오는 중…", mailsCount: "메일 {n}개", toggleTheme: "라이트/다크 테마 전환", tabsSide: "측면 탭", tabsTop: "상단 탭",
  tabs: { transport: "교통", timetable: "시간표", exams: "시험 일정", assignments: "수업 과제", opportunities: "웨비나 & 해커톤", campus: "캠퍼스 행사", review: "검토", other: "기타" },
};

const STRINGS: Record<string, Strings> = { en, ta, hi, te, ml, de, fr, es, zh, ja, ko, ...EXTRA_STRINGS };

export function strings(lang: string): Strings {
  return STRINGS[lang] ?? en;
}

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
