import { useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { api, type User } from "../api";
import { Overlay } from "./Overlay";
import { photoFor } from "../counsellorPhotos";

function defaultSlot(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function BookingModal({
  counsellor,
  clientId,
  onClose,
  onBooked,
}: {
  counsellor: User;
  clientId: number;
  onClose: () => void;
  onBooked: () => void;
}) {
  const [slot, setSlot] = useState(defaultSlot());
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photo = photoFor(counsellor.email);

  async function confirm() {
    setBooking(true);
    setError(null);
    try {
      await api.bookScheduled({
        client_id: clientId,
        counsellor_id: counsellor.id,
        scheduled_time: new Date(slot).toISOString(),
      });
      setDone(true);
      onBooked();
    } catch {
      setError("Couldn't book that slot — try again.");
    } finally {
      setBooking(false);
    }
  }

  if (done) {
    return (
      <Overlay onClose={onClose}>
        <div className="confirm-check">
          <CheckCircle2 size={26} strokeWidth={2} />
        </div>
        <h3 style={{ marginBottom: 6 }}>You're booked</h3>
        <p className="muted" style={{ marginBottom: 20 }}>
          Session with {counsellor.name} on {new Date(slot).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
          .
        </p>
        <button className="btn btn-primary btn-block" onClick={onClose}>
          Done
        </button>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div className="booking-header">
        {photo ? (
          <img src={photo} alt={counsellor.name} className="booking-header-photo" />
        ) : (
          <span className="identity-avatar" style={{ background: "var(--teal-600)", width: 48, height: 48 }}>
            {counsellor.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </span>
        )}
        <div>
          <span className="eyebrow">Book a session</span>
          <h3 style={{ margin: "2px 0 0" }}>{counsellor.name}</h3>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            {counsellor.specialty}
          </p>
        </div>
      </div>

      <div className="field" style={{ marginBottom: 18 }}>
        <label>
          <CalendarClock size={13} strokeWidth={2} style={{ verticalAlign: -2, marginRight: 5 }} />
          Date &amp; time
        </label>
        <input type="datetime-local" value={slot} onChange={(e) => setSlot(e.target.value)} />
      </div>

      {error && (
        <p style={{ color: "var(--rose-600)", fontSize: "0.85rem", marginBottom: 12 }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" onClick={onClose} disabled={booking}>
          Cancel
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirm} disabled={booking}>
          {booking ? "Booking…" : "Confirm booking"}
        </button>
      </div>
    </Overlay>
  );
}
