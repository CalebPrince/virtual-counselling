import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session as DBSession

from . import crud, models, schemas
from .database import Base, engine, get_db
from .seed import seed_if_empty

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Virtual Counselling Platform API")

# Comma-separated list of extra allowed origins, e.g. your deployed
# Netlify/Vercel URL: FRONTEND_ORIGINS=https://haven-demo.netlify.app
extra_origins = [
    origin.strip()
    for origin in os.environ.get("FRONTEND_ORIGINS", "").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        *extra_origins,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    db = next(get_db())
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


# --- Users -----------------------------------------------------------------


@app.post("/api/users", response_model=schemas.UserOut)
def create_user(user_in: schemas.UserCreate, db: DBSession = Depends(get_db)):
    return crud.create_user(db, user_in)


@app.get("/api/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: DBSession = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/clients", response_model=list[schemas.UserOut])
def list_clients(db: DBSession = Depends(get_db)):
    return crud.list_clients(db)


# --- Counsellors -------------------------------------------------------------


@app.get("/api/counsellors", response_model=list[schemas.UserOut])
def list_counsellors(
    available: bool | None = None,
    specialty: str | None = None,
    db: DBSession = Depends(get_db),
):
    return crud.list_counsellors(db, available=available, specialty=specialty)


@app.patch("/api/counsellors/{counsellor_id}/status", response_model=schemas.UserOut)
def update_counsellor_status(
    counsellor_id: int,
    body: schemas.CounsellorStatusUpdate,
    db: DBSession = Depends(get_db),
):
    counsellor = crud.get_user(db, counsellor_id)
    if not counsellor or counsellor.role != models.Role.counsellor:
        raise HTTPException(status_code=404, detail="Counsellor not found")
    return crud.set_counsellor_status(db, counsellor, body.status)


@app.get("/api/counsellors/{counsellor_id}/sessions", response_model=list[schemas.SessionOut])
def counsellor_sessions(counsellor_id: int, db: DBSession = Depends(get_db)):
    counsellor = crud.get_user(db, counsellor_id)
    if not counsellor or counsellor.role != models.Role.counsellor:
        raise HTTPException(status_code=404, detail="Counsellor not found")
    return crud.list_sessions_for_counsellor(db, counsellor_id)


# --- Sessions ----------------------------------------------------------------


@app.post("/api/sessions/scheduled", response_model=schemas.SessionOut)
def book_scheduled_session(
    booking: schemas.ScheduledSessionCreate, db: DBSession = Depends(get_db)
):
    client = crud.get_user(db, booking.client_id)
    counsellor = crud.get_user(db, booking.counsellor_id)
    if not client or client.role != models.Role.client:
        raise HTTPException(status_code=404, detail="Client not found")
    if not counsellor or counsellor.role != models.Role.counsellor:
        raise HTTPException(status_code=404, detail="Counsellor not found")
    return crud.create_scheduled_session(db, booking)


@app.post("/api/sessions/instant", response_model=schemas.SessionOut)
def request_instant_session(
    request: schemas.InstantSessionCreate, db: DBSession = Depends(get_db)
):
    client = crud.get_user(db, request.client_id)
    if not client or client.role != models.Role.client:
        raise HTTPException(status_code=404, detail="Client not found")
    return crud.create_instant_session(db, request)


@app.get("/api/sessions/{session_id}", response_model=schemas.SessionOut)
def get_session(session_id: int, db: DBSession = Depends(get_db)):
    session = crud.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.get("/api/clients/{client_id}/sessions", response_model=list[schemas.SessionOut])
def client_sessions(client_id: int, db: DBSession = Depends(get_db)):
    client = crud.get_user(db, client_id)
    if not client or client.role != models.Role.client:
        raise HTTPException(status_code=404, detail="Client not found")
    return crud.list_sessions_for_client(db, client_id)
