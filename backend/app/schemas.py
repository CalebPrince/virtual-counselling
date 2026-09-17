from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from .models import CounsellorStatus, Role, SessionStatus, SessionType


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Role
    specialty: str | None = None
    bio: str | None = None


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: CounsellorStatus | None = None
    created_at: datetime


class CounsellorStatusUpdate(BaseModel):
    status: CounsellorStatus


class ScheduledSessionCreate(BaseModel):
    client_id: int
    counsellor_id: int
    scheduled_time: datetime


class InstantSessionCreate(BaseModel):
    client_id: int
    specialty: str | None = None


class SessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    client_id: int
    counsellor_id: int | None
    type: SessionType
    status: SessionStatus
    scheduled_time: datetime | None
    created_at: datetime
    client: UserOut
    counsellor: UserOut | None = None
