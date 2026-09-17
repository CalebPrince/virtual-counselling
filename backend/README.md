# Haven backend

FastAPI + SQLite API for the Haven virtual counselling demo. Pairs with the React frontend in `../frontend`.

## Local development

Requires Python 3.12 (3.14 breaks pydantic-core's prebuilt wheels).

```bash
python -m venv venv
./venv/Scripts/python.exe -m pip install -r requirements.txt
./venv/Scripts/python.exe -m uvicorn app.main:app --port 8018 --reload
```

Seed data (5 counsellors, 2 clients) is created automatically on first run if the database is empty.

## Deployment (Render / Railway)

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (see `Procfile`)
- Env var: `FRONTEND_ORIGINS=https://your-deployed-frontend.example.com` — comma-separated list of
  extra origins allowed by CORS, on top of `localhost:5173` for local dev.

SQLite persistence depends on the host's disk being persistent across restarts — fine for a demo,
but don't rely on data surviving a cold start on a free-tier host that sleeps.
