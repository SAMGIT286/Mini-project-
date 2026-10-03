import { BriefcaseBusiness, HeartHandshake, ShieldAlert, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const types = [
  {
    id: "elderly",
    title: "Elderly Person",
    text: "Get personalized voice assistance, medication reminders, and memory logging.",
    icon: UserRound,
  },
  {
    id: "young_professional",
    title: "Young Professional",
    text: "Stay organized with daily routines, appointments, and wellness habits.",
    icon: BriefcaseBusiness,
  },
  {
    id: "caregiver",
    title: "Caregiver Access",
    text: "Monitor and support your loved one's health, medications, and schedule.",
    icon: HeartHandshake,
  },
  {
    id: "emergency_contact",
    title: "Emergency Contact",
    text: "Read-only access to patient timeline, emergency details, and critical alerts.",
    icon: ShieldAlert,
  },
];

export default function UserType() {
  const navigate = useNavigate();
  const { user, updateUser, role } = useAuth();
  const [selected, setSelected] = useState(role || user?.role || "elderly");

  const handleNext = () => {
    updateUser({ role: selected, userType: selected });
    navigate("/onboarding/personal-details");
  };

  return (
    <OnboardingLayout
      step={1}
      title="Welcome to MemoMind!"
      subtitle="Select your role so we can customize your dashboard and features."
      nextAction={handleNext}
      nextTo="/onboarding/personal-details"
    >
      <div className="choice-grid">
        {types.map(({ id, title, text, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`choice-card ${selected === id ? "selected" : ""}`}
            onClick={() => {
              setSelected(id);
              updateUser({ role: id, userType: id });
            }}
          >
            <div className="choice-icon">
              <Icon size={25} />
            </div>
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
