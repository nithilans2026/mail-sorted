# ✉ MAIL SORTED

**Your student inbox, sorted.** MAIL SORTED signs in with Google, reads your college Gmail and files every mail into
the categories students actually care about: bus updates, timetable changes, exam schedules, class assignments,
webinars & hackathons, and campus events. Deadlines float to the top, and new mail can ring a loud alert.

🌐 **Live:** https://mail-sorted.vercel.app  ·  📱 **Android:** [download the APK](https://mail-sorted.vercel.app/download/MAIL-SORTED.apk) (also on the Releases page)

---

## Features

- **📥 Complete Inbox + 8 smart categories:** 📥 Inbox (all received mail) · 🚌 Transport · 📅 Timetable · 📝 Exam Schedule · 📚 Class Assignments · 💡 Webinars & Hackathons · 🎉 Campus Events · 🔎 Review · 📦 Other
- **✉️ Compose & Send Emails:** Click the prominent **+** button (in the top bar or floating action button) to compose and send emails directly inside the app
- **📱 Mobile APK orientation switcher:** Easily switch between horizontal (top) and vertical (side) tab layouts directly on mobile and inside the APK
- **🌐 Real-time translation into 45 languages:** Email subjects, previews, and full email bodies are automatically translated into any of the 45 supported languages (including RTL Arabic, Urdu, Hebrew)
- **Rules + AI sorting:** free keyword rules handle most mail; Claude (optional) sorts the rest and pulls out deadlines and exam dates
- **⏰ Deadline countdowns** for exams, assignments and hackathon registrations
- **Live sync:** checks for new mail every minute, auto-syncs every 2 hours, ⟳ Sync button, and a sync history
- **🔔 Notifications:** loud alert sounds (Alarm, Siren, Bell, Chime, Ping), record or upload your own sound, or keep it silent
- **Select mode:** pick mails and move them to Gmail Trash (recoverable for 30 days); hide senders you don't care about
- **Installable app:** PWA with offline shell, an Android APK (Trusted Web Activity), pull-to-refresh, haptics and tap sounds
- **Design:** light/dark theme, side or top tabs, animated illustrations per category, scroll animations

## Tech stack

Next.js 14 (App Router) · TypeScript · NextAuth (Google OAuth) · Gmail API · Anthropic Claude API (optional) ·
Web Audio API · Service Worker / PWA · Vercel

## Run it yourself

See **[SETUP.md](SETUP.md)** for the full guide (Google Cloud credentials, environment variables, deploying to Vercel,
building the Android app). In short:

```bash
cp .env.example .env.local   # then fill in your own keys
npm install
npm run dev
```

## Privacy

- Signs in with Google OAuth; the app never sees your password.
- Uses the `gmail.modify` permission: read mail, and move mail to Trash **only when you choose**. It cannot send mail or permanently delete it.
- Mail is processed on request and not stored on any server. Hidden senders, theme and settings live in your own browser.
- When the optional Claude key is set, subjects and previews of unclear mails (and mails you ask to translate) are sent to the Anthropic API for sorting and translation.

## Author

Created by **Nithilan S** · nithilan.s2026@vitstudent.ac.in

## License

[MIT](LICENSE)
