import { Activity, BedDouble, Coffee, Dumbbell, Moon, Utensils, HeartPulse, UserCheck } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdditionalDetails() {
  const navigate = useNavigate();
  const { user, updateUser, role, isYoungProfessional, isCaregiver } = useAuth();

  const [form, setForm] = useState({
    doctor: user?.doctor?.name || (isYoungProfessional ? "Dr. Kapoor" : "Dr. Sharma"),
    specialization: user?.doctor?.specialization || (isYoungProfessional ? "Physician & Wellness" : "General Physician"),
    hospital: user?.doctor?.hospital || (isYoungProfessional ? "Apollo Clinic" : "City Hospital"),
    phone: user?.doctor?.phone || (isYoungProfessional ? "+91 98111 55667" : "+91 98765 43210"),
    wake: user?.routine?.wake || (isYoungProfessional ? "06:00" : "06:30"),
    sleep: user?.routine?.sleep || (isYoungProfessional ? "23:30" : "22:00"),
    breakfast: user?.routine?.breakfast || "08:00",
    lunch: user?.routine?.lunch || "13:00",
    dinner: user?.routine?.dinner || "20:00",
    exercise: user?.routine?.exercise || (isYoungProfessional ? "06:45" : "17:00"),
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleFinish = () => {
    updateUser({
      doctor: {
        name: form.doctor,
        specialization: form.specialization,
        hospital: form.hospital,
        phone: form.phone,
      },
      routine: {
        wake: form.wake,
        sleep: form.sleep,
        breakfast: form.breakfast,
        lunch: form.lunch,
        dinner: form.dinner,
        exercise: form.exercise,
      },
      setupComplete: true,
    });

    if (role === "caregiver") {
      navigate("/caregiver", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
    return true;
  };

  const destination = role === "caregiver" ? "/caregiver" : "/dashboard";

  return (
    <OnboardingLayout
      step={5}
      title="Daily Routine & Doctor Details"
      subtitle="These optional details help MemoMind structure your daily timeline and reminders."
      backTo="/onboarding/caregiver-details"
      nextTo={destination}
      nextAction={handleFinish}
      nextLabel="Finish Setup"
    >
      <div className="subheading-row">
        <h3>
          Primary Doctor / Clinic Information <span>(Optional)</span>
        </h3>
      </div>
      <div className="form-grid">
        <label className="form-field">
          <span className="field-label">Doctor Name</span>
          <input
            value={form.doctor}
            onChange={(e) => update("doctor", e.target.value)}
            placeholder="e.g. Dr. Sharma"
          />
        </label>
        <label className="form-field">
          <span className="field-label">Specialization</span>
          <input
            value={form.specialization}
            onChange={(e) => update("specialization", e.target.value)}
            placeholder="e.g. General Physician"
          />
        </label>
        <label className="form-field">
          <span className="field-label">Hospital / Clinic</span>
          <input
            value={form.hospital}
            onChange={(e) => update("hospital", e.target.value)}
            placeholder="e.g. City Hospital"
          />
        </label>
        <label className="form-field">
          <span className="field-label">Doctor Phone</span>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>
      </div>

      <div className="subheading-row mt-24">
        <h3>
          Daily Schedule & Routine <span>(Optional)</span>
        </h3>
      </div>
      <div className="routine-grid">
        {[
          ["wake", "Wake-up time", BedDouble],
          ["sleep", "Sleep time", Moon],
          ["breakfast", "Breakfast time", Coffee],
          ["lunch", "Lunch time", Utensils],
          ["dinner", "Dinner time", Utensils],
          ["exercise", "Exercise / Walk", Dumbbell],
        ].map(([key, label, Icon]) => (
          <label className="routine-item" key={key}>
            <span className="routine-icon">
              <Icon size={16} />
            </span>
            <span>{label}</span>
            <input
              type="time"
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="info-note">
        <Activity size={16} />
        You can always customize your schedule, medicines, and timeline from the main dashboard.
      </div>
    </OnboardingLayout>
  );
}
