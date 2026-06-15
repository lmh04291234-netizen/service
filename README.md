# Matjam rental market

Next.js + Auth.js version of the chair and pillow rental marketplace.

## Run locally

```powershell
cd C:\Users\emh04\Desktop\서비스
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Demo email login

```txt
demo@matjam.kr
demo1234
```

## Built-in signup

The local signup flow saves users to `data/users.json`.
Passwords are hashed with `bcrypt`.

For production, replace `data/users.json` with a real database such as PostgreSQL, MySQL, Supabase, or PlanetScale.

## Google and Naver login

The app now supports two modes:

- Real OAuth mode: used when client ID and secret are set in `.env.local`.
- Dev demo mode: used automatically when keys are missing, so the buttons still work during local development.

Set these values in `.env.local` when you have real OAuth apps:

```txt
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

Google callback URL:

```txt
http://localhost:3000/api/auth/callback/google
```

Naver callback URL:

```txt
http://localhost:3000/api/auth/callback/naver
```

For production, also add:

```txt
https://your-domain.com/api/auth/callback/google
https://your-domain.com/api/auth/callback/naver
```

## Important files

- Auth config: `lib/auth.ts`
- User storage: `lib/users.ts`
- Auth.js route: `app/api/auth/[...nextauth]/route.ts`
- Signup API: `app/api/auth/register/route.ts`
- OAuth status API: `app/api/auth/provider-status/route.ts`
- Main page: `app/page.tsx`

## Production note

Never commit `.env.local`.
Use deployment environment variables for secrets.
