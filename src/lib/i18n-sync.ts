// Text for the Sync button, new-mail notices and the sync history panel, in every site language.
// Positional, in this order: sync, syncing, syncHistory, manual, auto, newMail, opened, newCount, noNew, syncFailed, newBadge.

export type SyncStrings = {
  sync: string; syncing: string; syncHistory: string;
  trigger: { manual: string; auto: string; newMail: string; open: string };
  newCount: string; noNew: string; syncFailed: string; newBadge: string;
};

const RAW: Record<string, string[]> = {
  en: ["Sync", "Syncing…", "Sync history", "Manual", "Auto (every 2 h)", "New mail arrived", "Opened", "{n} new", "No new mail", "Sync failed", "NEW"],
  ta: ["ஒத்திசை", "ஒத்திசைக்கிறது…", "ஒத்திசைவு வரலாறு", "கைமுறை", "தானியங்கி (2 மணிநேரத்திற்கு ஒருமுறை)", "புதிய மின்னஞ்சல் வந்தது", "திறக்கப்பட்டது", "{n} புதியவை", "புதிய மின்னஞ்சல் இல்லை", "ஒத்திசைவு தோல்வி", "புதிது"],
  hi: ["सिंक करें", "सिंक हो रहा है…", "सिंक इतिहास", "मैन्युअल", "स्वचालित (हर 2 घंटे)", "नया मेल आया", "खोला गया", "{n} नए", "कोई नया मेल नहीं", "सिंक विफल", "नया"],
  te: ["సింక్", "సింక్ అవుతోంది…", "సింక్ చరిత్ర", "మాన్యువల్", "ఆటో (ప్రతి 2 గంటలకు)", "కొత్త మెయిల్ వచ్చింది", "తెరిచారు", "{n} కొత్తవి", "కొత్త మెయిల్ లేదు", "సింక్ విఫలమైంది", "కొత్తది"],
  ml: ["സിങ്ക്", "സിങ്ക് ചെയ്യുന്നു…", "സിങ്ക് ചരിത്രം", "മാനുവൽ", "ഓട്ടോ (ഓരോ 2 മണിക്കൂറിലും)", "പുതിയ മെയിൽ വന്നു", "തുറന്നു", "{n} പുതിയത്", "പുതിയ മെയിൽ ഇല്ല", "സിങ്ക് പരാജയപ്പെട്ടു", "പുതിയത്"],
  de: ["Synchronisieren", "Wird synchronisiert…", "Sync-Verlauf", "Manuell", "Automatisch (alle 2 Std.)", "Neue E-Mail eingegangen", "Geöffnet", "{n} neu", "Keine neuen E-Mails", "Synchronisierung fehlgeschlagen", "NEU"],
  fr: ["Synchroniser", "Synchronisation…", "Historique de synchro", "Manuelle", "Auto (toutes les 2 h)", "Nouvel e-mail reçu", "Ouverture", "{n} nouveau(x)", "Aucun nouvel e-mail", "Échec de la synchro", "NOUVEAU"],
  es: ["Sincronizar", "Sincronizando…", "Historial de sincronización", "Manual", "Automática (cada 2 h)", "Llegó un correo nuevo", "Al abrir", "{n} nuevos", "Sin correos nuevos", "Error al sincronizar", "NUEVO"],
  zh: ["同步", "正在同步…", "同步记录", "手动", "自动（每 2 小时）", "收到新邮件", "打开时", "{n} 封新邮件", "没有新邮件", "同步失败", "新"],
  ja: ["同期", "同期中…", "同期履歴", "手動", "自動（2時間ごと）", "新着メール", "起動時", "新着 {n} 件", "新着メールなし", "同期に失敗しました", "新着"],
  ko: ["동기화", "동기화 중…", "동기화 기록", "수동", "자동 (2시간마다)", "새 메일 도착", "열 때", "새 메일 {n}개", "새 메일 없음", "동기화 실패", "새 메일"],
  bn: ["সিঙ্ক", "সিঙ্ক হচ্ছে…", "সিঙ্ক ইতিহাস", "ম্যানুয়াল", "স্বয়ংক্রিয় (প্রতি ২ ঘণ্টায়)", "নতুন মেইল এসেছে", "খোলার সময়", "{n}টি নতুন", "নতুন মেইল নেই", "সিঙ্ক ব্যর্থ", "নতুন"],
  mr: ["सिंक करा", "सिंक होत आहे…", "सिंक इतिहास", "मॅन्युअल", "स्वयंचलित (दर 2 तासांनी)", "नवीन मेल आला", "उघडताना", "{n} नवीन", "नवीन मेल नाही", "सिंक अयशस्वी", "नवीन"],
  pa: ["ਸਿੰਕ ਕਰੋ", "ਸਿੰਕ ਹੋ ਰਿਹਾ ਹੈ…", "ਸਿੰਕ ਇਤਿਹਾਸ", "ਹੱਥੀਂ", "ਆਟੋ (ਹਰ 2 ਘੰਟੇ)", "ਨਵੀਂ ਮੇਲ ਆਈ", "ਖੋਲ੍ਹਣ ਵੇਲੇ", "{n} ਨਵੀਆਂ", "ਕੋਈ ਨਵੀਂ ਮੇਲ ਨਹੀਂ", "ਸਿੰਕ ਅਸਫਲ", "ਨਵੀਂ"],
  gu: ["સિંક કરો", "સિંક થઈ રહ્યું છે…", "સિંક ઇતિહાસ", "મેન્યુઅલ", "ઓટો (દર 2 કલાકે)", "નવો મેલ આવ્યો", "ખોલતી વખતે", "{n} નવા", "કોઈ નવો મેલ નથી", "સિંક નિષ્ફળ", "નવું"],
  kn: ["ಸಿಂಕ್", "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ…", "ಸಿಂಕ್ ಇತಿಹಾಸ", "ಹಸ್ತಚಾಲಿತ", "ಸ್ವಯಂ (ಪ್ರತಿ 2 ಗಂಟೆಗೆ)", "ಹೊಸ ಮೇಲ್ ಬಂದಿದೆ", "ತೆರೆದಾಗ", "{n} ಹೊಸವು", "ಹೊಸ ಮೇಲ್ ಇಲ್ಲ", "ಸಿಂಕ್ ವಿಫಲವಾಗಿದೆ", "ಹೊಸದು"],
  si: ["සමමුහුර්ත කරන්න", "සමමුහුර්ත වෙමින්…", "සමමුහුර්ත ඉතිහාසය", "අතින්", "ස්වයංක්‍රීය (පැය 2කට වරක්)", "නව ඊමේල් ලැබුණි", "විවෘත කළ විට", "නව {n}", "නව ඊමේල් නැත", "සමමුහුර්තය අසාර්ථකයි", "නව"],
  ms: ["Segerak", "Menyegerak…", "Sejarah segerak", "Manual", "Auto (setiap 2 jam)", "E-mel baharu diterima", "Semasa dibuka", "{n} baharu", "Tiada e-mel baharu", "Segerak gagal", "BAHARU"],
  id: ["Sinkronkan", "Menyinkronkan…", "Riwayat sinkronisasi", "Manual", "Otomatis (tiap 2 jam)", "Email baru masuk", "Saat dibuka", "{n} baru", "Tidak ada email baru", "Sinkronisasi gagal", "BARU"],
  vi: ["Đồng bộ", "Đang đồng bộ…", "Lịch sử đồng bộ", "Thủ công", "Tự động (mỗi 2 giờ)", "Có email mới", "Khi mở", "{n} mới", "Không có email mới", "Đồng bộ thất bại", "MỚI"],
  th: ["ซิงค์", "กำลังซิงค์…", "ประวัติการซิงค์", "ด้วยตนเอง", "อัตโนมัติ (ทุก 2 ชม.)", "มีอีเมลใหม่", "ตอนเปิด", "ใหม่ {n} ฉบับ", "ไม่มีอีเมลใหม่", "ซิงค์ไม่สำเร็จ", "ใหม่"],
  ru: ["Синхронизировать", "Синхронизация…", "История синхронизации", "Вручную", "Авто (каждые 2 ч)", "Пришло новое письмо", "При открытии", "новых: {n}", "Новых писем нет", "Ошибка синхронизации", "НОВОЕ"],
  ar: ["مزامنة", "جارٍ المزامنة…", "سجل المزامنة", "يدوي", "تلقائي (كل ساعتين)", "وصل بريد جديد", "عند الفتح", "{n} جديدة", "لا يوجد بريد جديد", "فشلت المزامنة", "جديد"],
  ur: ["سنک کریں", "سنک ہو رہا ہے…", "سنک کی تاریخ", "دستی", "خودکار (ہر 2 گھنٹے)", "نئی میل آئی", "کھولنے پر", "{n} نئی", "کوئی نئی میل نہیں", "سنک ناکام", "نئی"],
  sw: ["Sawazisha", "Inasawazisha…", "Historia ya usawazishaji", "Kwa mkono", "Otomatiki (kila saa 2)", "Barua pepe mpya imefika", "Wakati wa kufungua", "{n} mpya", "Hakuna barua pepe mpya", "Usawazishaji umeshindwa", "MPYA"],
  af: ["Sinchroniseer", "Sinchroniseer tans…", "Sinchronisasie-geskiedenis", "Handmatig", "Outomaties (elke 2 uur)", "Nuwe e-pos ontvang", "By oopmaak", "{n} nuut", "Geen nuwe e-pos nie", "Sinchronisasie het misluk", "NUUT"],
  hy: ["Համաժամեցնել", "Համաժամեցվում է…", "Համաժամեցման պատմություն", "Ձեռքով", "Ավտոմատ (ամեն 2 ժամը մեկ)", "Նոր նամակ է եկել", "Բացելիս", "{n} նոր", "Նոր նամակ չկա", "Համաժամեցումը ձախողվեց", "ՆՈՐ"],
  nl: ["Synchroniseren", "Synchroniseren…", "Synchronisatiegeschiedenis", "Handmatig", "Automatisch (elke 2 uur)", "Nieuwe e-mail ontvangen", "Bij openen", "{n} nieuw", "Geen nieuwe e-mail", "Synchroniseren mislukt", "NIEUW"],
  pt: ["Sincronizar", "Sincronizando…", "Histórico de sincronização", "Manual", "Automática (a cada 2 h)", "Chegou e-mail novo", "Ao abrir", "{n} novos", "Nenhum e-mail novo", "Falha na sincronização", "NOVO"],
  sv: ["Synka", "Synkar…", "Synkhistorik", "Manuell", "Automatisk (varannan timme)", "Nytt mejl har kommit", "Vid öppning", "{n} nya", "Inga nya mejl", "Synkningen misslyckades", "NY"],
  nb: ["Synkroniser", "Synkroniserer…", "Synkroniseringslogg", "Manuell", "Automatisk (hver 2. time)", "Ny e-post mottatt", "Ved åpning", "{n} nye", "Ingen ny e-post", "Synkronisering mislyktes", "NY"],
  fi: ["Synkronoi", "Synkronoidaan…", "Synkronointihistoria", "Manuaalinen", "Automaattinen (2 h välein)", "Uusi viesti saapui", "Avattaessa", "{n} uutta", "Ei uusia viestejä", "Synkronointi epäonnistui", "UUSI"],
  uk: ["Синхронізувати", "Синхронізація…", "Історія синхронізації", "Вручну", "Авто (кожні 2 год)", "Надійшов новий лист", "Під час відкриття", "нових: {n}", "Нових листів немає", "Помилка синхронізації", "НОВЕ"],
  be: ["Сінхранізаваць", "Сінхранізацыя…", "Гісторыя сінхранізацыі", "Уручную", "Аўта (кожныя 2 г)", "Прыйшоў новы ліст", "Пры адкрыцці", "новых: {n}", "Новых лістоў няма", "Памылка сінхранізацыі", "НОВАЕ"],
  pl: ["Synchronizuj", "Synchronizowanie…", "Historia synchronizacji", "Ręcznie", "Automatycznie (co 2 godz.)", "Przyszła nowa wiadomość", "Przy otwarciu", "nowe: {n}", "Brak nowych wiadomości", "Synchronizacja nie powiodła się", "NOWE"],
  sl: ["Sinhroniziraj", "Sinhroniziranje…", "Zgodovina sinhronizacije", "Ročno", "Samodejno (vsaki 2 uri)", "Prispelo je novo sporočilo", "Ob odprtju", "novih: {n}", "Ni novih sporočil", "Sinhronizacija ni uspela", "NOVO"],
  sk: ["Synchronizovať", "Synchronizuje sa…", "História synchronizácie", "Ručne", "Automaticky (každé 2 h)", "Prišiel nový e-mail", "Pri otvorení", "nové: {n}", "Žiadne nové e-maily", "Synchronizácia zlyhala", "NOVÉ"],
  el: ["Συγχρονισμός", "Συγχρονισμός…", "Ιστορικό συγχρονισμού", "Χειροκίνητα", "Αυτόματα (κάθε 2 ώρες)", "Ήρθε νέο email", "Κατά το άνοιγμα", "{n} νέα", "Κανένα νέο email", "Ο συγχρονισμός απέτυχε", "ΝΕΟ"],
  tr: ["Senkronize et", "Senkronize ediliyor…", "Senkronizasyon geçmişi", "Manuel", "Otomatik (2 saatte bir)", "Yeni e-posta geldi", "Açılışta", "{n} yeni", "Yeni e-posta yok", "Senkronizasyon başarısız", "YENİ"],
  he: ["סנכרון", "מסנכרן…", "היסטוריית סנכרון", "ידני", "אוטומטי (כל שעתיים)", "הגיע מייל חדש", "בפתיחה", "{n} חדשים", "אין מיילים חדשים", "הסנכרון נכשל", "חדש"],
  sr: ["Синхронизуј", "Синхронизација…", "Историја синхронизације", "Ручно", "Аутоматски (на 2 сата)", "Стигла је нова порука", "При отварању", "нових: {n}", "Нема нових порука", "Синхронизација није успела", "НОВО"],
  sq: ["Sinkronizo", "Duke sinkronizuar…", "Historiku i sinkronizimit", "Manual", "Automatik (çdo 2 orë)", "Mbërriti email i ri", "Në hapje", "{n} të reja", "Asnjë email i ri", "Sinkronizimi dështoi", "E RE"],
  cs: ["Synchronizovat", "Synchronizuje se…", "Historie synchronizace", "Ručně", "Automaticky (každé 2 h)", "Přišel nový e-mail", "Při otevření", "nové: {n}", "Žádné nové e-maily", "Synchronizace selhala", "NOVÉ"],
  hu: ["Szinkronizálás", "Szinkronizálás…", "Szinkronizálási előzmények", "Kézi", "Automatikus (2 óránként)", "Új levél érkezett", "Megnyitáskor", "{n} új", "Nincs új levél", "A szinkronizálás sikertelen", "ÚJ"],
  bs: ["Sinhronizuj", "Sinhronizacija…", "Historija sinhronizacije", "Ručno", "Automatski (svaka 2 sata)", "Stigla je nova poruka", "Pri otvaranju", "novih: {n}", "Nema novih poruka", "Sinhronizacija nije uspjela", "NOVO"],
};

function build(r: string[]): SyncStrings {
  return {
    sync: r[0], syncing: r[1], syncHistory: r[2],
    trigger: { manual: r[3], auto: r[4], newMail: r[5], open: r[6] },
    newCount: r[7], noNew: r[8], syncFailed: r[9], newBadge: r[10],
  };
}

export function syncStrings(lang: string): SyncStrings {
  const raw = RAW[lang];
  return build(raw && raw.length === 11 ? raw : RAW.en);
}

export const SYNC_LANG_CODES = Object.keys(RAW);
