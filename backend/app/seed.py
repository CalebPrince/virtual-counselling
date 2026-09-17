from sqlalchemy.orm import Session as DBSession

from . import models


def seed_if_empty(db: DBSession) -> None:
    if db.query(models.User).count() > 0:
        return

    counsellors = [
        dict(
            name="Dr. Amara Owusu",
            email="amara.owusu@example.com",
            specialty="Anxiety & Stress",
            status=models.CounsellorStatus.available,
            bio="12 years helping clients manage anxiety and burnout.",
        ),
        dict(
            name="Kwame Boateng",
            email="kwame.boateng@example.com",
            specialty="Relationships & Family",
            status=models.CounsellorStatus.available,
            bio="Licensed family therapist focused on communication and conflict.",
        ),
        dict(
            name="Dr. Naledi Khumalo",
            email="naledi.khumalo@example.com",
            specialty="Depression",
            status=models.CounsellorStatus.busy,
            bio="Specializes in cognitive behavioral therapy for mood disorders.",
        ),
        dict(
            name="Tunde Afolabi",
            email="tunde.afolabi@example.com",
            specialty="Addiction & Recovery",
            status=models.CounsellorStatus.offline,
            bio="Works with clients navigating substance use recovery.",
        ),
        dict(
            name="Grace Mensah",
            email="grace.mensah@example.com",
            specialty="Grief & Loss",
            status=models.CounsellorStatus.available,
            bio="Supports clients through bereavement and major life transitions.",
        ),
    ]
    for c in counsellors:
        db.add(models.User(role=models.Role.counsellor, **c))

    clients = [
        dict(name="Jordan Lee", email="jordan.lee@example.com"),
        dict(name="Sam Rivera", email="sam.rivera@example.com"),
    ]
    for c in clients:
        db.add(models.User(role=models.Role.client, **c))

    db.commit()
