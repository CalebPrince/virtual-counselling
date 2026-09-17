from datetime import datetime, timezone

from sqlalchemy.orm import Session as DBSession

from . import models, schemas


def get_user(db: DBSession, user_id: int) -> models.User | None:
    return db.get(models.User, user_id)


def get_user_by_email(db: DBSession, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: DBSession, user_in: schemas.UserCreate) -> models.User:
    existing = get_user_by_email(db, user_in.email)
    if existing:
        return existing
    user = models.User(
        name=user_in.name,
        email=user_in.email,
        role=user_in.role,
        specialty=user_in.specialty,
        bio=user_in.bio,
        status=models.CounsellorStatus.offline if user_in.role == models.Role.counsellor else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_clients(db: DBSession) -> list[models.User]:
    return (
        db.query(models.User)
        .filter(models.User.role == models.Role.client)
        .order_by(models.User.name)
        .all()
    )


def list_counsellors(
    db: DBSession, available: bool | None = None, specialty: str | None = None
) -> list[models.User]:
    query = db.query(models.User).filter(models.User.role == models.Role.counsellor)
    if available is True:
        query = query.filter(models.User.status == models.CounsellorStatus.available)
    elif available is False:
        query = query.filter(models.User.status != models.CounsellorStatus.available)
    if specialty:
        query = query.filter(models.User.specialty == specialty)
    return query.order_by(models.User.name).all()


def set_counsellor_status(
    db: DBSession, counsellor: models.User, status: models.CounsellorStatus
) -> models.User:
    counsellor.status = status
    if status == models.CounsellorStatus.available:
        pending = (
            db.query(models.CounsellingSession)
            .filter(
                models.CounsellingSession.type == models.SessionType.instant,
                models.CounsellingSession.counsellor_id.is_(None),
                models.CounsellingSession.status == models.SessionStatus.pending,
            )
            .order_by(models.CounsellingSession.created_at.asc())
            .first()
        )
        if pending:
            pending.counsellor_id = counsellor.id
            pending.status = models.SessionStatus.confirmed
            counsellor.status = models.CounsellorStatus.busy
    db.commit()
    db.refresh(counsellor)
    return counsellor


def _find_least_recently_assigned_counsellor(
    db: DBSession, specialty: str | None = None
) -> models.User | None:
    query = db.query(models.User).filter(
        models.User.role == models.Role.counsellor,
        models.User.status == models.CounsellorStatus.available,
    )
    available = query.all()
    if specialty:
        matching = [c for c in available if c.specialty == specialty]
        if matching:
            available = matching
    if not available:
        return None

    def last_assigned_at(counsellor: models.User) -> datetime | None:
        last_session = (
            db.query(models.CounsellingSession)
            .filter(models.CounsellingSession.counsellor_id == counsellor.id)
            .order_by(models.CounsellingSession.created_at.desc())
            .first()
        )
        return last_session.created_at if last_session else None

    ranked = sorted(
        available,
        key=lambda c: (
            last_assigned_at(c) is not None,
            last_assigned_at(c) or datetime.min.replace(tzinfo=timezone.utc),
        ),
    )
    return ranked[0]


def create_scheduled_session(
    db: DBSession, booking: schemas.ScheduledSessionCreate
) -> models.CounsellingSession:
    session = models.CounsellingSession(
        client_id=booking.client_id,
        counsellor_id=booking.counsellor_id,
        type=models.SessionType.scheduled,
        status=models.SessionStatus.confirmed,
        scheduled_time=booking.scheduled_time,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def create_instant_session(
    db: DBSession, request: schemas.InstantSessionCreate
) -> models.CounsellingSession:
    counsellor = _find_least_recently_assigned_counsellor(db, request.specialty)
    session = models.CounsellingSession(
        client_id=request.client_id,
        type=models.SessionType.instant,
        status=models.SessionStatus.pending,
    )
    if counsellor:
        session.counsellor_id = counsellor.id
        session.status = models.SessionStatus.confirmed
        counsellor.status = models.CounsellorStatus.busy
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session(db: DBSession, session_id: int) -> models.CounsellingSession | None:
    return db.get(models.CounsellingSession, session_id)


def list_sessions_for_client(db: DBSession, client_id: int) -> list[models.CounsellingSession]:
    return (
        db.query(models.CounsellingSession)
        .filter(models.CounsellingSession.client_id == client_id)
        .order_by(models.CounsellingSession.created_at.desc())
        .all()
    )


def list_sessions_for_counsellor(
    db: DBSession, counsellor_id: int
) -> list[models.CounsellingSession]:
    return (
        db.query(models.CounsellingSession)
        .filter(models.CounsellingSession.counsellor_id == counsellor_id)
        .order_by(models.CounsellingSession.created_at.desc())
        .all()
    )
