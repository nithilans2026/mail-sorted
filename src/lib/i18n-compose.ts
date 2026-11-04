// Text for Compose & Send Mail and Mobile Orientation, in every site language.

export type ComposeStrings = {
  compose: string;
  composeSend: string;
  sendingSpin: string;
  composeTo: string;
  composeSubject: string;
  composeBody: string;
  composeBodyPlaceholder: string;
  composeOptional: string;
  sendOk: string;
  sendFailed: string;
  sendNeedsReauth: string;
  orientation: string;
  horizontal: string;
  vertical: string;
};

const KEYS: (keyof ComposeStrings)[] = [
  "compose",
  "composeSend",
  "sendingSpin",
  "composeTo",
  "composeSubject",
  "composeBody",
  "composeBodyPlaceholder",
  "composeOptional",
  "sendOk",
  "sendFailed",
  "sendNeedsReauth",
  "orientation",
  "horizontal",
  "vertical",
];

const RAW: Record<string, string[]> = {
  en: ["Compose", "Send", "Sending…", "To", "Subject", "Message", "Write your email here…", "Optional", "Email sent successfully!", "Failed to send email", "Sign in again to allow sending emails.", "Orientation", "Horizontal", "Vertical"],
  ta: ["புதிய அஞ்சல்", "அனுப்பு", "அனுப்புகிறது…", "பெறுநர்", "பொருள்", "செய்தி", "உங்கள் மின்னஞ்சலை இங்கே எழுதுங்கள்…", "விருப்பத்தேர்வு", "மின்னஞ்சல் வெற்றிகரமாக அனுப்பப்பட்டது!", "மின்னஞ்சல் அனுப்ப முடியவில்லை", "மின்னஞ்சல் அனுப்ப அனுமதிக்க மீண்டும் உள்நுழைக.", "நோக்குநிலை", "கிடைமட்டம்", "செங்குத்து"],
  hi: ["नया मेल", "भेजें", "भेजा जा रहा है…", "प्रति", "विषय", "संदेश", "यहाँ अपना ईमेल लिखें…", "वैकल्पिक", "ईमेल सफलतापूर्वक भेजा गया!", "ईमेल भेजने में विफल", "ईमेल भेजने की अनुमति देने के लिए फिर से साइन इन करें।", "अभिविन्यास", "क्षैतिज", "लंबवत"],
  te: ["కొత్త మెయిల్", "పంపు", "పంపిస్తోంది…", "స్వీకర్త", "విషయం", "సందేశం", "మీ ఈమెయిల్‌ను ఇక్కడ రాయండి…", "ఐచ్ఛికం", "ఈమెయిల్ విజయవంతంగా పంపబడింది!", "ఈమెయిల్ పంపడం విఫలమైంది", "ఈమెయిల్స్ పంపడానికి మళ్ళీ సైన్ ఇన్ చేయండి.", "దిశ", "క్షితిజసమాంతర", "నిలువు"],
  ml: ["പുതിയ മെയിൽ", "അയക്കുക", "അയക്കുന്നു…", "സ്വീകർത്താവ്", "വിഷയം", "സന്ദേശം", "നിങ്ങളുടെ ഇമെയിൽ ഇവിടെ എഴുതുക…", "ഐച്ഛികം", "ഇമെയിൽ വിജയകരമായി അയച്ചു!", "ഇമെയിൽ അയക്കാൻ കഴിഞ്ഞില്ല", "ഇമെയിൽ അയക്കാൻ അനുവദിക്കാൻ വീണ്ടും സൈൻ ഇൻ ചെയ്യുക.", "ഓറിയന്റേഷൻ", "തിരശ്ചീനം", "ലംബം"],
  de: ["Verfassen", "Senden", "Wird gesendet…", "An", "Betreff", "Nachricht", "Schreibe deine E-Mail hier…", "Optional", "E-Mail erfolgreich gesendet!", "Fehler beim Senden", "Melde dich erneut an, um E-Mails zu senden.", "Ausrichtung", "Horizontal", "Vertikal"],
  fr: ["Nouveau message", "Envoyer", "Envoi en cours…", "À", "Objet", "Message", "Rédige ton message ici…", "Facultatif", "E-mail envoyé avec succès !", "Échec de l'envoi", "Reconnecte-toi pour autoriser l'envoi d'e-mails.", "Orientation", "Horizontal", "Vertical"],
  es: ["Redactar", "Enviar", "Enviando…", "Para", "Asunto", "Mensaje", "Escribe tu correo aquí…", "Opcional", "¡Correo enviado con éxito!", "Error al enviar el correo", "Vuelve a iniciar sesión para permitir enviar correos.", "Orientación", "Horizontal", "Vertical"],
  zh: ["写邮件", "发送", "正在发送…", "收件人", "主题", "正文", "在此输入邮件内容…", "选填", "邮件发送成功！", "发送邮件失败", "请重新登录以允许发送邮件。", "排列方向", "水平", "垂直"],
  ja: ["メール作成", "送信", "送信中…", "宛先", "件名", "本文", "メール内容を入力…", "任意", "メールを送信しました！", "送信に失敗しました", "メール送信を許可するには再ログインしてください。", "配置向き", "水平", "垂直"],
  ko: ["메일 작성", "보내기", "보내는 중…", "받는 사람", "제목", "내용", "메일 내용을 작성하세요…", "선택사항", "메일을 성공적으로 보냈습니다!", "메일 전송 실패", "메일 전송을 허용하려면 다시 로그인하세요.", "방향", "가로", "세로"],
  bn: ["নতুন মেইল", "পাঠান", "পাঠানো হচ্ছে…", "প্রাপক", "বিষয়", "বার্তা", "এখানে আপনার ইমেইল লিখুন…", "ঐচ্ছিক", "ইমেইল সফলভাবে পাঠানো হয়েছে!", "ইমেইল পাঠাতে ব্যর্থ", "ইমেইল পাঠানোর অনুমতি দিতে আবার সাইন ইন করুন।", "বিন্যাস", "অনুভূমিক", "উল্লম্ব"],
  mr: ["नवीन मेल", "पाठवा", "पाठवत आहे…", "प्रति", "विषय", "संदेश", "येथे तुमचा ईमेल लिहा…", "पर्यायी", "ईमेल यशस्वीपणे पाठवला!", "ईमेल पाठवणे अयशस्वी", "ईमेल पाठवण्याची परवानगी देण्यासाठी पुन्हा साइन इन करा.", "मांडणी", "आडवे", "उभे"],
  pa: ["ਨਵੀਂ ਮੇਲ", "ਭੇਜੋ", "ਭੇਜ ਰਿਹਾ ਹੈ…", "ਪ੍ਰਾਪਤਕਰਤਾ", "ਵਿਸ਼ਾ", "ਸੰਦੇਸ਼", "ਇੱਥੇ ਆਪਣੀ ਈਮੇਲ ਲਿਖੋ…", "ਵਿਕਲਪਿਕ", "ਈਮੇਲ ਸਫਲਤਾਪੂਰਵਕ ਭੇਜੀ ਗਈ!", "ਈਮੇਲ ਭੇਜਣ ਵਿੱਚ ਅਸਫਲ", "ਈਮੇਲ ਭੇਜਣ ਦੀ ਇਜਾਜ਼ਤ ਦੇਣ ਲਈ ਮੁੜ ਸਾਈਨ ਇਨ ਕਰੋ।", "ਦਿਸ਼ਾ", "ਲੇਟਵਾਂ", "ਖੜ੍ਹਵਾਂ"],
  gu: ["નવો મેલ", "મોકલો", "મોકલી રહ્યું છે…", "પ્રતિ", "વિષય", "સંદેશ", "અહીં તમારો ઈમેઈલ લખો…", "વૈકલ્પિક", "ઈમેઈલ સફળતાપૂર્વક મોકલાયો!", "ઈમેઈલ મોકલવામાં નિષ્ફળ", "ઈમેઈલ મોકલવાની મંજૂરી આપવા ફરી સાઇન ઇન કરો.", "દિશા", "આડું", "ઊભું"],
  kn: ["ಹೊಸ ಮೇಲ್", "ಕಳುಹಿಸಿ", "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…", "ಸ್ವೀಕರಿಸುವವರು", "ವಿಷಯ", "ಸಂದೇಶ", "ನಿಮ್ಮ ಇಮೇಲ್ ಅನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ…", "ಐಚ್ಛಿಕ", "ಇಮೇಲ್ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!", "ಇಮೇಲ್ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ", "ಇಮೇಲ್ ಕಳುಹಿಸಲು ಅನುಮತಿ ನೀಡಲು ಮತ್ತೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.", "ದಿಕ್ಕು", "ಅಡ್ಡಲಾಗಿ", "ಉದ್ದವಾಗಿ"],
  si: ["නව ඊමේල්", "යවන්න", "යවමින්…", "ලබන්නා", "විෂයය", "පණිවිඩය", "ඔබේ ඊමේලය මෙහි ලියන්න…", "විකල්ප", "ඊමේලය සාර්ථකව යවන ලදී!", "ඊමේල් යැවීම අසාර්ථකයි", "ඊමේල් යැවීමට අවසර දීමට නැවත පුරනය වන්න.", "දිශානතිය", "තිරස්", "සිරස්"],
  ms: ["Tulis", "Hantar", "Menghantar…", "Kepada", "Subjek", "Mesej", "Tulis e-mel anda di sini…", "Pilihan", "E-mel berjaya dihantar!", "Gagal menghantar e-mel", "Log masuk semula untuk membenarkan penghantaran e-mel.", "Orientasi", "Mendatar", "Menegak"],
  id: ["Tulis", "Kirim", "Mengirim…", "Kepada", "Subjek", "Pesan", "Tulis email Anda di sini…", "Opsional", "Email berhasil dikirim!", "Gagal mengirim email", "Masuk lagi untuk mengizinkan pengiriman email.", "Orientasi", "Horizontal", "Vertikal"],
  vi: ["Soạn thư", "Gửi", "Đang gửi…", "Đến", "Chủ đề", "Nội dung", "Viết email tại đây…", "Tùy chọn", "Đã gửi email thành công!", "Không thể gửi email", "Đăng nhập lại để cho phép gửi email.", "Định hướng", "Ngang", "Dọc"],
  th: ["เขียนอีเมล", "ส่ง", "กำลังส่ง…", "ถึง", "เรื่อง", "ข้อความ", "เขียนอีเมลของคุณที่นี่…", "ไม่บังคับ", "ส่งอีเมลเรียบร้อยแล้ว!", "ส่งอีเมลไม่สำเร็จ", "ลงชื่อเข้าใช้อีกครั้งเพื่ออนุญาตให้ส่งอีเมล", "การจัดวาง", "แนวนอน", "แนวตั้ง"],
  ru: ["Написать", "Отправить", "Отправка…", "Кому", "Тема", "Сообщение", "Напишите письмо здесь…", "Необязательно", "Письмо успешно отправлено!", "Не удалось отправить письмо", "Войдите снова, чтобы разрешить отправку писем.", "Ориентация", "Горизонтально", "Вертикально"],
  ar: ["إنشاء رسالة", "إرسال", "جارٍ الإرسال…", "إلى", "الموضوع", "الرسالة", "اكتب رسالتك هنا…", "اختياري", "تم إرسال البريد بنجاح!", "فشل إرسال البريد", "سجّل الدخول مجددًا للسماح بإرسال الرسائل.", "الاتجاه", "أفقي", "عمودي"],
  ur: ["نئی میل", "بھیجیں", "بھیجا جا رہا ہے…", "بنام", "موضوع", "پیغام", "اپنی ای میل یہاں لکھیں…", "اختیاری", "ای میل کامیابی سے بھیج دی گئی!", "ای میل بھیجنے میں ناکامی", "ای میل بھیجنے کی اجازت کے لیے دوبارہ سائن ان کریں۔", "سمت", "افقی", "عمودی"],
  sw: ["Tunga", "Tuma", "Inatuma…", "Kwa", "Mada", "Ujumbe", "Andika barua pepe yako hapa…", "Hiari", "Barua pepe imetumwa!", "Imeshindwa kutuma barua pepe", "Ingia tena ili kuruhusu kutuma barua pepe.", "Mwelekeo", "Mlalo", "Wima"],
  af: ["Skryf", "Stuur", "Stuur tans…", "Aan", "Onderwerp", "Boodskap", "Skryf jou e-pos hier…", "Opsioneel", "E-pos suksesvol gestuur!", "Kon nie e-pos stuur nie", "Meld weer aan om e-posse te stuur.", "Oriëntasie", "Horisontaal", "Vertikaal"],
  hy: ["Գրել", "Ուղարկել", "Ուղարկվում է…", "Ում", "Թեմա", "Հաղորդագրություն", "Գրեք ձեր նամակն այստեղ…", "Լրացուցիչ", "Նամակը հաջողությամբ ուղարկվեց:", "Չհաջողվեց ուղարկել", "Կրկին մուտք գործեք նամակներ ուղարկելու համար:", "Ուղղվածություն", "Հորիզոնական", "Ուղղահայաց"],
  nl: ["Opstellen", "Versturen", "Versturen…", "Aan", "Onderwerp", "Bericht", "Schrijf hier je e-mail…", "Optioneel", "E-mail succesvol verzonden!", "Versturen mislukt", "Log opnieuw in om e-mails te versturen.", "Oriëntatie", "Horizontaal", "Verticaal"],
  pt: ["Escrever", "Enviar", "Enviando…", "Para", "Assunto", "Mensagem", "Escreva seu e-mail aqui…", "Opcional", "E-mail enviado com sucesso!", "Falha ao enviar e-mail", "Entre novamente para permitir enviar e-mails.", "Orientação", "Horizontal", "Vertical"],
  sv: ["Skriv", "Skicka", "Skickar…", "Till", "Ämne", "Meddelande", "Skriv ditt mejl här…", "Valfritt", "Mejlet har skickats!", "Kunde inte skicka mejlet", "Logga in igen för att tillåta att skicka mejl.", "Orientering", "Horisontell", "Vertikal"],
  nb: ["Skriv", "Send", "Sender…", "Til", "Emne", "Melding", "Skriv e-posten din her…", "Valgfritt", "E-post sendt!", "Kunne ikke sende e-post", "Logg inn på nytt for å tillate sending av e-post.", "Orientering", "Horisontal", "Vertikal"],
  fi: ["Kirjoita", "Lähetä", "Lähetetään…", "Vastaanottaja", "Aihe", "Viesti", "Kirjoita viestisi tähän…", "Valinnainen", "Sähköposti lähetetty!", "Lähetys epäonnistui", "Kirjaudu uudelleen salliaksesi sähköpostien lähettämisen.", "Suunta", "Vaaka", "Pysty"],
  uk: ["Написати", "Надіслати", "Надсилання…", "Кому", "Тема", "Повідомлення", "Напишіть лист тут…", "Необов'язково", "Лист успішно надіслано!", "Не вдалося надіслати лист", "Увійдіть знову, щоб дозволити надсилання листів.", "Орієнтація", "Горизонтально", "Вертикально"],
  be: ["Напісаць", "Адправіць", "Адпраўка…", "Каму", "Тэма", "Паведамленне", "Напішыце ліст тут…", "Неабавязкова", "Ліст паспяхова адпраўлены!", "Не ўдалося адправіць ліст", "Увайдзіце зноў, каб дазволіць адпраўку лістоў.", "Арыентацыя", "Гарызантальна", "Вертыкальна"],
  pl: ["Utwórz", "Wyślij", "Wysyłanie…", "Do", "Temat", "Wiadomość", "Napisz wiadomość tutaj…", "Opcjonalnie", "Wiadomość wysłana pomyślnie!", "Nie udało się wysłać wiadomości", "Zaloguj się ponownie, aby zezwolić na wysyłanie wiadomości.", "Orientacja", "Pozioma", "Pionowa"],
  sl: ["Sestavi", "Pošlji", "Pošiljanje…", "Za", "Zadeva", "Sporočilo", "Napišite sporočilo tukaj…", "Izbirno", "Sporočilo uspešno poslano!", "Pošiljanje ni uspelo", "Znova se prijavite, da dovolite pošiljanje e-pošte.", "Usmerjenost", "Vodoravno", "Navpično"],
  sk: ["Napísať", "Odoslať", "Odosiela sa…", "Komu", "Predmet", "Správa", "Sem napíšte e-mail…", "Voliteľné", "E-mail úspešne odoslaný!", "Odoslanie zlyhalo", "Prihláste sa znova, aby ste povolili odosielanie e-mailov.", "Orientácia", "Vodorovne", "Zvisle"],
  el: ["Σύνταξη", "Αποστολή", "Αποστολή…", "Προς", "Θέμα", "Μήνυμα", "Γράψτε το email σας εδώ…", "Προαιρετικό", "Το email στάλθηκε με επιτυχία!", "Αποτυχία αποστολής email", "Συνδεθείτε ξανά για να επιτρέψετε την αποστολή email.", "Προσανατολισμός", "Οριζόντια", "Κάθετα"],
  tr: ["Oluştur", "Gönder", "Gönderiliyor…", "Kime", "Konu", "İleti", "E-postanızı buraya yazın…", "İsteğe bağlı", "E-posta başarıyla gönderildi!", "E-posta gönderilemedi", "E-posta göndermeye izin vermek için tekrar giriş yapın.", "Yönlendirme", "Yatay", "Dikey"],
  he: ["אימייל חדש", "שלח", "שולח…", "אל", "נושא", "הודעה", "כתוב את האימייל כאן…", "אופציונלי", "האימייל נשלח בהצלחה!", "שליחת האימייל נכשלה", "התחבר מחדש כדי לאפשר שליחת מיילים.", "כיוון", "אופקי", "אנכי"],
  sr: ["Састави", "Пошаљи", "Шаље се…", "За", "Тема", "Порука", "Овде напишите имејл…", "Опционо", "Имејл је успешно послат!", "Слање није успело", "Пријавите се поново да бисте омогућили слање имејлова.", "Оријентација", "Водоравно", "Усправно"],
  sq: ["Krijo", "Dërgo", "Duke dërguar…", "Për", "Subjekti", "Mesazhi", "Shkruaj email-in tënd këtu…", "Opsionale", "Email-i u dërgua me sukses!", "Dërgimi i email-it dështoi", "Hyni përsëri për të lejuar dërgimin e email-eve.", "Orientimi", "Horizontalisht", "Vertikalisht"],
  cs: ["Napsat", "Odeslat", "Odesílání…", "Komu", "Předmět", "Zpráva", "Sem napište e-mail…", "Volitelné", "E-mail byl úspěšně odeslán!", "Odeslání se nezdařilo", "Přihlaste se znovu pro povolení odesílání e-mailů.", "Orientace", "Vodorovně", "Svisle"],
  hu: ["Új levél", "Küldés", "Küldés…", "Címzett", "Tárgy", "Üzenet", "Írja ide a levelet…", "Opcionális", "E-mail sikeresen elküldve!", "Nem sikerült elküldeni az e-mailt", "Jelentkezzen be újra az e-mail küldés engedélyezéséhez.", "Tájolás", "Vízszintes", "Függőleges"],
  bs: ["Sastavi", "Pošalji", "Šalje se…", "Za", "Predmet", "Poruka", "Napišite svoj e-mail ovdje…", "Opcionalno", "E-mail uspješno poslan!", "Slanje e-maila nije uspjelo", "Prijavite se ponovo da biste omogućili slanje e-mailova.", "Orijentacija", "Horizontalno", "Vertikalno"],
};

export function composeStrings(lang: string): ComposeStrings {
  const raw = RAW[lang] && RAW[lang].length === KEYS.length ? RAW[lang] : RAW.en;
  return Object.fromEntries(KEYS.map((k, i) => [k, raw[i]])) as ComposeStrings;
}
