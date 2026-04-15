# Sidago CRM Frontend

This is a Next.js 16 frontend for the Sidago CRM dashboard. The project includes a mock authentication flow and sample protected pages for dashboard and agent call management.

## Requirements

- Node.js 20 or newer
- npm

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:1001
```

If your `.env` uses `PORT=3000`, then open `http://localhost:3000` instead.

## Environment Variables

The project uses the following environment variables from `.env`:

```env
PORT=1001
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:1001/api
NEXT_PUBLIC_STORAGE_SECRET_KEY=947da80722bf69c56183d8a23c0ef4b2
```

## Available Scripts

- `npm run dev` starts the app in development mode
- `npm run build` creates a production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint

## Run With Docker

1. Make sure your `.env` file exists.
2. Build and start the container:

```bash
docker compose up --build
```

3. Open the app using the `PORT` value from your `.env` file.

## Mock User Credentials

The mock login API validates `email` and `password`. The "username" below is the mock user's display name from the seed data.

| Username | Email             | Password | Role       |
| -------- | ----------------- | -------- | ---------- |
| Mariz    | mariz@gmail.com   | 123456   | agent      |
| Tom      | tom@gmail.com     | 123456   | agent      |
| Chris    | chris@gmail.com   | 123456   | agent      |
| Bryan    | bryan@gmail.com   | 123456   | agent      |
| Ryan     | ryan@gmail.com    | 123456   | admin      |
| Matin    | matin@gmail.com   | 123456   | admin      |
| Tauseef  | tauseef@gmail.com | 123456   | backoffice |
| Shanto   | shanto@gmail.com  | 123456   | backoffice |
| Adil     | adil@gmail.com    | 123456   | admin      |

## Notes

- Mock users are defined in `lib/mocks/users.ts`.
- The mock login route is implemented in `app/api/auth/login/route.ts`.
- Passwords must be at least 6 characters in the current mock auth flow.
