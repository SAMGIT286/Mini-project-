import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = ["Type", "Personal", "Contacts", "Caregiver", "Details"];

export default function OnboardingLayout({ step, title, subtitle, children, nextTo, backTo, nextLabel = "Next" }) {
  const navigate = useNavigate();

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
        <div className="onboarding-step-text">Step {step} of {steps.length}</div>
      </div>

      <div className="progress-track">
        {steps.map((s, i) => (
          <div key={s} className={`progress-segment ${i + 1 <= step ? "done" : ""}`}>
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
            <button className="btn btn-outline" onClick={() => navigate(backTo)}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : <span />}
          <button className="btn btn-primary" onClick={() => navigate(nextTo)}>
            {nextLabel} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
