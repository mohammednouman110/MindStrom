<<<<<<< HEAD
# MindStrom AI

Responsive AI-powered learning platform built with Next.js, Tailwind CSS, Framer Motion, FastAPI, Firebase-ready auth/sync, and n8n-ready automation hooks.

## What is included

- Modern landing page plus dedicated pages for dashboard, learning, memory analytics, AI tutor, automations, and docs
- Context API state management with local-first persistence and Firebase upgrade path
- PDF upload flow, AI learning-pack generation, flashcards, adaptive quizzes, and instant feedback
- Confusion heatmap, future-forget prediction, retention curves, time optimization, leaderboard, and gamification
- Browser voice input/output on the tutor page
- FastAPI backend with endpoints for learning-pack generation, tutor chat, automation triggers, and analytics

## Folder structure

```text
.
|-- src/
|   |-- app/
|   |   |-- (workspace)/
|   |   |-- login/
|   |   |-- signup/
|   |   `-- page.tsx
|   |-- components/
|   |-- context/
|   |-- data/
|   `-- lib/
|-- backend/
|   |-- app/
|   |   |-- core/
|   |   |-- services/
|   |   |-- main.py
|   |   `-- schemas.py
|   `-- requirements.txt
`-- .env.example
```

## Frontend setup

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`.

## API routes

- `POST /api/v1/learning/generate-pack`
- `POST /api/v1/assistant/chat`
- `POST /api/v1/automation/trigger`
- `GET /api/v1/analytics/dashboard`
- `GET /api/v1/analytics/heatmap`
- `GET /health`

FastAPI interactive docs are available at `/docs` and `/redoc`.

## Environment variables

Copy `.env.example` to `.env.local` for Next.js and `.env` for the backend, then set:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_FIREBASE_*`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `N8N_WEBHOOK_URL`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## Notes

- The frontend works immediately in local-first demo mode even without backend or Firebase credentials.
- Firebase auth and Firestore sync activate automatically once the public env vars are set.
- The backend currently falls back to heuristic AI outputs when OpenAI credentials are not configured.
=======
# MindStrom
>>>>>>> 8c04b877b11db1b7e31d2917946eb2af61d3be8b
