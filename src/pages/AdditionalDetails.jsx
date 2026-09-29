import { Activity, BedDouble, Coffee, Dumbbell, Moon, Utensils } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdditionalDetails() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    doctor: "Dr. Sharma", specialization: "General Physician", hospital: "City Hospital", phone: "+91 98765 43210",
    wake: "06:30", sleep: "22:00", breakfast: "08:00", lunch: "13:00", dinner: "20:00", exercise: "17:00",
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <OnboardingLayout
      step={5}
      title="A Few More Details"
      subtitle="These details help us provide better assistance."
      backTo="/onboarding/caregiver-details"
      nextTo="/dashboard"
      nextLabel="Finish Setup"
    >
      <div className="subheading-row">
        <h3>Doctor Information <span>(Optional)</span></h3>
      </div>
      <div className="form-grid">
        {[
          ["doctor", "Doctor Name"], ["specialization", "Specialization"], ["hospital", "Hospital / Clinic"], ["phone", "Phone Number"],
        ].map(([key, label]) => (
          <label className="form-field" key={key}>
            <span className="field-label">{label}</span>
            <input value={form[key]} onChange={(e) => update(key, e.target.value)} />
          </label>
        ))}
      </div>

      <div className="subheading-row mt-24">
        <h3>Daily Routine <span>(Optional)</span></h3>
      </div>
      <div className="routine-grid">
        {[
          ["wake", "Wake-up time", BedDouble],
          ["sleep", "Sleep time", Moon],
          ["breakfast", "Breakfast time", Coffee],
          ["lunch", "Lunch time", Utensils],
          ["dinner", "Dinner time", Utensils],
          ["exercise", "Exercise / Walk time", Dumbbell],
        ].map(([key, label, Icon]) => (
          <label className="routine-item" key={key}>
            <span className="routine-icon"><Icon size={16} /></span>
            <span>{label}</span>
            <input type="time" value={form[key]} onChange={(e) => update(key, e.target.value)} />
          </label>
        ))}
      </div>

      <div className="info-note">
        <Activity size={16} />
        Medicines, memories and appointments can be added after setup.
      </div>
    </OnboardingLayout>
  );
}
