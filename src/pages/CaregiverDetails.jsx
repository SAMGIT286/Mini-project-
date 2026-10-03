import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { HeartHandshake, Shield, Info } from "lucide-react";

export default function CaregiverDetails() {
  const { user, updateUser, isYoungProfessional } = useAuth();

  const [form, setForm] = useState({
    name: user?.caregiver?.name || (isYoungProfessional ? "" : "Priya Mehta"),
    relationship: user?.caregiver?.relationship || "Daughter-in-law",
    phone: user?.caregiver?.phone || (isYoungProfessional ? "" : "+91 98987 76655"),
    email: user?.caregiver?.email || (isYoungProfessional ? "" : "priya@example.com"),
  });

  const [permissions, setPermissions] = useState(
    user?.caregiver?.permissions || {
      medicine: true,
      appointments: true,
      timeline: true,
      alerts: true,
    }
  );

  const toggle = (key) => setPermissions((p) => ({ ...p, [key]: !p[key] }));

  const handleNext = () => {
    if (form.name.trim()) {
      updateUser({
        caregiver: {
          ...form,
          permissions,
        },
      });
    } else {
      updateUser({ caregiver: null });
    }
    return true;
  };

  const handleSkip = () => {
    updateUser({ caregiver: null });
  };

  return (
    <OnboardingLayout
      step={4}
      title="Caregiver Connection (Optional)"
      subtitle={
        isYoungProfessional
          ? "Young professionals can skip this step or link a health buddy / family member."
          : "You can add a caregiver now or later in Settings."
      }
      backTo="/onboarding/emergency-contacts"
      nextTo="/onboarding/additional-details"
      skipTo="/onboarding/additional-details"
      onSkip={handleSkip}
      nextAction={handleNext}
      nextLabel={form.name.trim() ? "Save & Next" : "Next"}
    >
      <div className="info-note" style={{ marginBottom: "18px" }}>
        <Info size={16} />
        <span>
          Caregiver setup is completely optional. You can easily add or edit your caregiver at any time from the Settings page.
        </span>
      </div>

      <div className="form-grid">
        <label className="form-field">
          <span className="field-label">Caregiver Name</span>
          <input
            placeholder="e.g. Priya Mehta (optional)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="form-field">
          <span className="field-label">Relationship</span>
          <select
            value={form.relationship}
            onChange={(e) => setForm({ ...form, relationship: e.target.value })}
          >
            <option>Daughter-in-law</option>
            <option>Daughter</option>
            <option>Son</option>
            <option>Spouse</option>
            <option>Sibling</option>
            <option>Professional Caregiver / Nurse</option>
            <option>Friend / Health Partner</option>
          </select>
        </label>

        <label className="form-field">
          <span className="field-label">Phone Number</span>
          <input
            placeholder="+91 98987 76655"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        <label className="form-field">
          <span className="field-label">Email Address</span>
          <input
            type="email"
            placeholder="caregiver@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
      </div>

      <div className="section-box mt-20">
        <div className="section-box-title">
          <Shield size={14} /> Caregiver Access Permissions
        </div>
        <div className="permission-list">
          {[
            ["medicine", "View medicine schedule and adherence"],
            ["appointments", "View upcoming doctor visits and appointments"],
            ["timeline", "View daily memory & activity timeline"],
            ["alerts", "Receive automated reminders and emergency alerts"],
          ].map(([key, label]) => (
            <label className="check-row" key={key}>
              <input
                type="checkbox"
                checked={!!permissions[key]}
                onChange={() => toggle(key)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
}
