import { BriefcaseBusiness, HeartHandshake, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useState } from "react";

const types = [
  { id: "young_professional", title: "Young Professional", text: "Stay organized and remember what matters.", icon: BriefcaseBusiness },
  { id: "elderly", title: "Elderly Person", text: "Get personalized assistance and reminders.", icon: UserRound },
  { id: "caregiver", title: "Caregiver Access", text: "Monitor and support your loved one.", icon: HeartHandshake },
];

export default function UserType() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("elderly");

  return (
    <OnboardingLayout
      step={1}
      title="Welcome!"
      subtitle="Tell us a little about yourself so we can personalize your experience."
      nextTo="/onboarding/personal-details"
    >
      <div className="choice-grid">
        {types.map(({ id, title, text, icon: Icon }) => (
          <button key={id} className={`choice-card ${selected === id ? "selected" : ""}`} onClick={() => setSelected(id)}>
            <div className="choice-icon"><Icon size={25} /></div>
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
