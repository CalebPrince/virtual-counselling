import { Briefcase, Star } from "lucide-react";
import type { User } from "../api";
import { StatusBadge } from "./StatusBadge";
import { photoFor } from "../counsellorPhotos";
import { statsFor } from "../counsellorStats";

export function CounsellorCard({
  counsellor,
  onBook,
}: {
  counsellor: User;
  onBook: (counsellor: User) => void;
}) {
  const initials = counsellor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  const photo = photoFor(counsellor.email);
  const stats = statsFor(counsellor.email);

  return (
    <div className="counsellor-card card">
      <div className="counsellor-card-photo">
        {photo ? (
          <img src={photo} alt={counsellor.name} loading="lazy" />
        ) : (
          <span className="counsellor-avatar counsellor-avatar-lg">{initials}</span>
        )}
        {counsellor.status && (
          <span className="counsellor-card-badge">
            <StatusBadge status={counsellor.status} />
          </span>
        )}
      </div>
      <div className="counsellor-card-body">
        <h3 style={{ fontSize: "1.05rem", marginBottom: 2 }}>{counsellor.name}</h3>
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          {counsellor.specialty}
        </p>

        <div className="counsellor-stats">
          <span className="counsellor-stat counsellor-stat-rating">
            <Star size={13} strokeWidth={0} fill="currentColor" />
            {stats.rating.toFixed(1)}
            <span className="muted">({stats.reviews})</span>
          </span>
          <span className="counsellor-stat">
            <Briefcase size={13} strokeWidth={2} />
            {stats.years} yrs exp.
          </span>
        </div>

        <p className="muted" style={{ fontSize: "0.87rem", marginBottom: 18, flex: 1 }}>
          {counsellor.bio}
        </p>
        <button
          className="btn btn-ghost btn-block"
          disabled={counsellor.status === "offline"}
          onClick={() => onBook(counsellor)}
        >
          {counsellor.status === "offline" ? "Unavailable to book" : "Book a session"}
        </button>
      </div>
    </div>
  );
}
