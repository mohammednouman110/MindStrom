# NeuroRecallAI Integration TODO

## Frontend
- [x] Install `recharts` dependency
- [ ] Create `src/app/neuro/layout.tsx` (minimal, no AppShell)
- [ ] Create `src/app/neuro/page.tsx` (exact NeuroRecallAI component)
- [ ] Update `src/lib/api.ts` with new backend endpoints

## Backend
- [ ] Update `backend/app/schemas.py` — add Topic, Flashcard, ReviewPayload, RetentionCurve, Achievement schemas
- [ ] Create `backend/app/services/topic_service.py` — topics, flashcards, achievements, profile data
- [ ] Update `backend/app/services/analytics_service.py` — add retention_curve_data()
- [ ] Update `backend/app/services/assistant_service.py` — NeuroTutor persona + memory strengths context
- [ ] Update `backend/app/main.py` — wire all new endpoints
- [ ] Update `backend/requirements.txt` if needed

