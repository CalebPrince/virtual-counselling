import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Overlay } from "./Overlay";

const TOPICS = [
  "Anxiety & Stress",
  "Relationships & Family",
  "Depression",
  "Addiction & Recovery",
  "Grief & Loss",
];

const FEELINGS = ["Anxious", "Overwhelmed", "Sad", "Okay", "Hopeful"];

export function IntakeQuiz({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: (specialty: string | null, feeling: string | null) => void;
}) {
  const [step, setStep] = useState<0 | 1>(0);
  const [topic, setTopic] = useState<string | null>(null);
  const [feeling, setFeeling] = useState<string | null>(null);

  return (
    <Overlay onClose={onClose}>
      <span className="eyebrow">Quick check-in · Step {step + 1} of 2</span>

      {step === 0 ? (
        <>
          <h3 style={{ margin: "6px 0 4px" }}>What would you like to talk about?</h3>
          <p className="muted" style={{ marginBottom: 18, fontSize: "0.87rem" }}>
            This helps us match you with a counsellor who fits — you can skip if you're not sure.
          </p>
          <div className="quiz-options">
            {TOPICS.map((t) => (
              <button
                key={t}
                className={`quiz-option ${topic === t ? "active" : ""}`}
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button className="btn btn-ghost" onClick={() => onComplete(null, null)}>
              Skip, just match me
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(1)}>
              Continue <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 style={{ margin: "6px 0 4px" }}>How are you feeling right now?</h3>
          <p className="muted" style={{ marginBottom: 18, fontSize: "0.87rem" }}>
            No wrong answer — this just helps your counsellor meet you where you are.
          </p>
          <div className="quiz-options">
            {FEELINGS.map((f) => (
              <button
                key={f}
                className={`quiz-option ${feeling === f ? "active" : ""}`}
                onClick={() => setFeeling(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button className="btn btn-ghost" onClick={() => setStep(0)}>
              Back
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onComplete(topic, feeling)}>
              Find me a counsellor <ArrowRight size={15} strokeWidth={2} />
            </button>
          </div>
        </>
      )}
    </Overlay>
  );
}
