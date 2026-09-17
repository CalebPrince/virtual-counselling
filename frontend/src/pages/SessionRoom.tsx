import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  MicOff,
  MessageSquare,
  PhoneOff,
  Send,
  Users,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { api, type CounsellingSession } from "../api";
import { useIdentity } from "../context/IdentityContext";
import { photoFor } from "../counsellorPhotos";
import { Overlay } from "../components/Overlay";

function initialsOf(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

type Panel = "none" | "participants" | "chat";

export function SessionRoom() {
  const { id } = useParams();
  const { identity } = useIdentity();
  const navigate = useNavigate();
  const [session, setSession] = useState<CounsellingSession | null>(null);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [panel, setPanel] = useState<Panel>(() =>
    typeof window !== "undefined" && window.innerWidth >= 760 ? "participants" : "none",
  );
  const [cameraError, setCameraError] = useState(false);
  const [recording, setRecording] = useState(false);
  const [showRecordPrompt, setShowRecordPrompt] = useState(false);
  const selfVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getSession(Number(id)).then(setSession);
  }, [id]);

  useEffect(() => {
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!videoOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }
    setCameraError(false);
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (selfVideoRef.current) selfVideoRef.current.srcObject = stream;
      })
      .catch(() => {
        if (!cancelled) setCameraError(true);
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [videoOn]);

  if (!identity || !session) {
    return (
      <div className="room-shell">
        <div className="room-stage">
          <p style={{ color: "rgba(255,255,255,0.7)" }}>Loading session…</p>
        </div>
      </div>
    );
  }

  const counterpart = identity.role === "client" ? session.counsellor : session.client;
  const counterpartPhoto = photoFor(counterpart?.email);
  const selfPhoto = photoFor(identity.email);
  const homePath = identity.role === "client" ? "/client" : "/counsellor";
  const showSelfCamera = videoOn && !cameraError;

  function togglePanel(next: Panel) {
    setPanel((p) => (p === next ? "none" : next));
  }

  function handleRecordClick() {
    if (recording) {
      setRecording(false);
    } else {
      setShowRecordPrompt(true);
    }
  }

  return (
    <div className="room-shell">
      <div className="room-topbar">
        <div className="room-topbar-left">
          <span className="live-dot" />
          <span>Live &middot; {counterpart ? counterpart.name : "Connecting…"}</span>
        </div>
        <div className="room-topbar-right">
          <button
            className={`record-toggle ${recording ? "active" : ""}`}
            onClick={handleRecordClick}
          >
            <span className="record-dot" />
            {recording ? "Recording" : "Record"}
          </button>
          <span className="room-timer">{formatElapsed(elapsed)}</span>
          <button
            className={`room-icon-btn ${panel === "participants" ? "active" : ""}`}
            onClick={() => togglePanel("participants")}
            aria-label="Participants"
          >
            <Users size={17} strokeWidth={2} />
            <span className="room-icon-count">2</span>
          </button>
          <button
            className={`room-icon-btn ${panel === "chat" ? "active" : ""}`}
            onClick={() => togglePanel("chat")}
            aria-label="Chat"
          >
            <MessageSquare size={17} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="room-body">
        <div className="room-stage">
          <div className="video-grid">
            <div className="video-tile">
              {counterpartPhoto ? (
                <img src={counterpartPhoto} alt={counterpart?.name ?? ""} />
              ) : (
                <div className="video-tile-fallback">
                  <span className="room-avatar">{counterpart ? initialsOf(counterpart.name) : "…"}</span>
                </div>
              )}
              <span className="video-tile-label">{counterpart ? counterpart.name : "Waiting…"}</span>
            </div>

            <div className="video-tile video-tile-self">
              <video
                ref={selfVideoRef}
                autoPlay
                muted
                playsInline
                style={{ display: showSelfCamera ? "block" : "none" }}
              />
              {!showSelfCamera &&
                (selfPhoto ? (
                  <img src={selfPhoto} alt={identity.name} />
                ) : (
                  <div className="video-tile-fallback video-tile-fallback-self">
                    <span className="room-avatar room-avatar-sm">{initialsOf(identity.name)}</span>
                  </div>
                ))}
              <span className="video-tile-label">You</span>
              {muted && (
                <span className="video-tile-muted">
                  <MicOff size={12} strokeWidth={2.4} />
                </span>
              )}
            </div>
          </div>
        </div>

        {panel !== "none" && (
          <aside className="room-panel">
            <div className="room-panel-head">
              <h4>{panel === "participants" ? "Participants (2)" : "Chat"}</h4>
              <button className="room-panel-close" onClick={() => setPanel("none")} aria-label="Close">
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {panel === "participants" ? (
              <div className="participant-list">
                <div className="participant-row">
                  <span className="identity-avatar" style={{ background: "var(--clay-500)" }}>
                    {initialsOf(identity.name)}
                  </span>
                  <span style={{ flex: 1 }}>{identity.name} (you)</span>
                  {muted ? <MicOff size={15} className="muted" /> : <Mic size={15} className="muted" />}
                </div>
                {counterpart && (
                  <div className="participant-row">
                    {counterpartPhoto ? (
                      <img src={counterpartPhoto} alt="" className="profile-row-photo" />
                    ) : (
                      <span className="identity-avatar" style={{ background: "var(--teal-600)" }}>
                        {initialsOf(counterpart.name)}
                      </span>
                    )}
                    <span style={{ flex: 1 }}>{counterpart.name}</span>
                    <Mic size={15} className="muted" />
                  </div>
                )}
              </div>
            ) : (
              <div className="chat-panel">
                <p className="chat-empty muted">Chat isn't wired up in this preview yet.</p>
                <div className="chat-input-row">
                  <input placeholder="Type a message…" disabled />
                  <button disabled aria-label="Send">
                    <Send size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      <div className="room-controls">
        <button
          className={`room-btn ${muted ? "active" : ""}`}
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={() => setMuted((m) => !m)}
        >
          {muted ? <MicOff size={19} strokeWidth={2} /> : <Mic size={19} strokeWidth={2} />}
        </button>
        <button
          className={`room-btn ${!videoOn ? "active" : ""}`}
          aria-label={videoOn ? "Turn camera off" : "Turn camera on"}
          onClick={() => setVideoOn((v) => !v)}
        >
          {videoOn ? <Video size={19} strokeWidth={2} /> : <VideoOff size={19} strokeWidth={2} />}
        </button>
        <button className="room-btn end" onClick={() => navigate(homePath)}>
          <PhoneOff size={17} strokeWidth={2.2} />
          End call
        </button>
      </div>

      {showRecordPrompt && (
        <Overlay onClose={() => setShowRecordPrompt(false)}>
          <span className="eyebrow">Live recording</span>
          <h3 style={{ margin: "6px 0 10px" }}>Record this session?</h3>
          <p className="muted" style={{ marginBottom: 20 }}>
            {counterpart ? counterpart.name : "The other participant"} will be notified that this
            session is being recorded. You can stop the recording anytime from the same button.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setShowRecordPrompt(false)}>
              Cancel
            </button>
            <button
              className="btn btn-clay"
              style={{ flex: 1 }}
              onClick={() => {
                setRecording(true);
                setShowRecordPrompt(false);
              }}
            >
              Start recording
            </button>
          </div>
        </Overlay>
      )}
    </div>
  );
}
