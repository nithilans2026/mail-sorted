# MAIL SORTED: setup

## 1. Install Node.js (one time)
Download the **LTS** installer from https://nodejs.org and run it with the default options.
Close and reopen the terminal afterwards, then check: `node -v`

## 2. Create Google sign-in credentials (about 10 minutes, one time)
1. Go to https://console.cloud.google.com and sign in.
2. Top bar → project picker → **New project** → name it `mail-sorted` → Create.
3. Menu → **APIs & Services → Library** → search **Gmail API** → **Enable**.
4. **Google Auth Platform → Branding / Audience**:
   - App name: `MAIL SORTED`, support email: yours
   - User type: **External**, publishing status **Testing**
   - **Test users**: add your own Gmail (up to 100 users while in Testing)
5. **Google Auth Platform → Clients → Create client**
   - Application type: **Web application**
   - Authorised redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Create, then copy the **Client ID** and **Client secret**.

> The app asks for `gmail.modify` (read mail + move to Trash). It cannot send mail or permanently delete it.
> Some college accounts block outside apps; if Google says *"access blocked by your administrator"*, use a personal Gmail
> or forward your college mail to one.

## 3. Add your secrets (never commit them, never paste them anywhere public)
1. Copy `.env.example` to `.env.local`.
2. Fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and a long random `NEXTAUTH_SECRET`.
3. `ANTHROPIC_API_KEY` is optional. Without it, keyword rules sort everything, mails they can't place go to **Review**,
   and translation is turned off.

## 4. Run it
```
npm install
npm run dev
```
Open http://localhost:3000 and click **Sign in with Google**.

## 5. Put it online (Vercel)
1. Import the repo in https://vercel.com (or run `npx vercel deploy --prod`).
2. Add the same variables in **Project → Settings → Environment Variables**, plus
   `NEXTAUTH_URL=https://<your-app>.vercel.app`.
3. In Google Cloud, add `https://<your-app>.vercel.app/api/auth/callback/google` as another redirect URI.

## 6. Android app (optional)
The site is an installable PWA. To wrap it as an APK, enter your live URL at https://www.pwabuilder.com →
**Package for stores → Android**, then publish the generated `assetlinks.json` at `public/.well-known/assetlinks.json`.
Keep the generated signing key private.
