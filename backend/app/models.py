import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Role(str, enum.Enum):
    client = "client"
    counsellor = "counsellor"


class CounsellorStatus(str, enum.Enum):
    available = "available"
    busy = "busy"
    offline = "offline"


class SessionType(str, enum.Enum):
    scheduled = "scheduled"
    instant = "instant"


class SessionStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    in_progress = "in_progress"
    completed = "completed"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), nullable=False)
    specialty: Mapped[str | None] = mapped_column(String(120), nullable=True)
    status: Mapped[CounsellorStatus | None] = mapped_column(
        Enum(CounsellorStatus), nullable=True
    )
    bio: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    client_sessions = relationship(
        "CounsellingSession",
        foreign_keys="CounsellingSession.client_id",
        back_populates="client",
    )
    counsellor_sessions = relationship(
        "CounsellingSession",
        foreign_keys="CounsellingSession.counsellor_id",
        back_populates="counsellor",
    )


class CounsellingSession(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    counsellor_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    type: Mapped[SessionType] = mapped_column(Enum(SessionType), nullable=False)
    status: Mapped[SessionStatus] = mapped_column(
        Enum(SessionStatus), nullable=False, default=SessionStatus.pending
    )
    scheduled_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    client = relationship("User", foreign_keys=[client_id], back_populates="client_sessions")
    counsellor = relationship(
        "User", foreign_keys=[counsellor_id], back_populates="counsellor_sessions"
    )
