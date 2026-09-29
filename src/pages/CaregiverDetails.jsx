import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useState } from "react";

export default function CaregiverDetails() {
  const [form, setForm] = useState({
    name: "Priya Mehta", relationship: "Daughter-in-law",
    phone: "+91 98987 76655", email: "priya@example.com",
  });
  const [permissions, setPermissions] = useState({
    medicine: true, appointments: true, timeline: true, alerts: true,
  });

  const toggle = (key) => setPermissions((p) => ({ ...p, [key]: !p[key] }));

  return (
    <OnboardingLayout
      step={4}
      title="Caregiver Information"
      subtitle="You can add a caregiver now or later."
      backTo="/onboarding/emergency-contacts"
      nextTo="/onboarding/additional-details"
    >
      <div className="form-grid">
        {[
          ["name", "Name"], ["relationship", "Relationship"], ["phone", "Phone Number"], ["email", "Email"],
        ].map(([key, label]) => (
          <label className="form-field" key={key}>
            <span className="field-label">{label}</span>
            {key === "relationship" ? (
              <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                <option>Daughter-in-law</option><option>Daughter</option><option>Son</option><option>Spouse</option>
              </select>
            ) : (
              <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            )}
          </label>
        ))}
      </div>

      <div className="section-box mt-20">
        <div className="section-box-title">Access Permissions</div>
        <div className="permission-list">
          {[
            ["medicine", "View medicine status"],
            ["appointments", "View appointments"],
            ["timeline", "View daily timeline"],
            ["alerts", "Receive alerts and notifications"],
          ].map(([key, label]) => (
            <label className="check-row" key={key}>
              <input type="checkbox" checked={permissions[key]} onChange={() => toggle(key)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}
