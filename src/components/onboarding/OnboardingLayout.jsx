import { ArrowLeft, ArrowRight, Check, SkipForward } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const steps = ["Role", "Profile", "Contacts", "Caregiver", "Details"];

export default function OnboardingLayout({
  step,
  title,
  subtitle,
  children,
  nextTo,
  backTo,
  skipTo,
  onSkip,
  nextAction,
  nextLabel = "Next",
}) {
  const navigate = useNavigate();
  const { updateUser, role } = useAuth();

  const handleNext = async () => {
    if (nextAction) {
      const result = await nextAction();
      if (result === false) return; // Prevent navigation if validation fails
    }

    if (nextTo === "/dashboard" || nextTo === "/caregiver") {
      updateUser({ setupComplete: true });
    }

    if (nextTo) {
      navigate(nextTo);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    if (skipTo) {
      navigate(skipTo);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-top">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <div className="brand-name">MemoMind</div>
            <div className="brand-tagline">Remember Today. Live Better.</div>
          </div>
        </div>
        <div className="onboarding-step-text">
          Step {step} of {steps.length}
        </div>
      </div>

      <div className="progress-track">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`progress-segment ${i + 1 <= step ? "done" : ""}`}
          >
            <span>{i + 1 < step ? <Check size={12} /> : i + 1}</span>
            <small>{s}</small>
          </div>
        ))}
      </div>

      <div className="onboarding-card">
        <div className="page-heading centered">
          <div className="eyebrow">MEMOMIND SETUP</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div>{children}</div>

        <div className="onboarding-actions">
          {backTo ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(backTo)}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <span />
          )}

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {skipTo && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleSkip}
                style={{ color: "var(--muted)" }}
              >
                <span>Skip for now</span>
                <SkipForward size={14} />
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
            >
              <span>{nextLabel}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
