# 빌려봄 rental market

Next.js + Auth.js rental marketplace for trying items before buying and renting things only when needed.

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

The app supports two modes:

- Real OAuth mode: used when client ID and secret are set.
- Dev demo mode: used automatically when keys are missing, so the buttons still work during local development.

Set these values in `.env.local` when you have real OAuth apps:

```txt
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

Google callback URL:

```txt
http://localhost:3000/api/auth/callback/google
https://service-five-mu.vercel.app/api/auth/callback/google
```

Naver callback URL:

```txt
http://localhost:3000/api/auth/callback/naver
https://service-five-mu.vercel.app/api/auth/callback/naver
```

For Vercel production, add these environment variables in the Vercel project settings:

```txt
NEXTAUTH_URL=https://service-five-mu.vercel.app
NEXTAUTH_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
```

After changing Vercel environment variables, redeploy the project.

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
The current JSON user storage is for prototype development. Use a real database before accepting real users.
