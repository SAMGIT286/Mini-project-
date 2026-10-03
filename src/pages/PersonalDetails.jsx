import { useState, useEffect } from "react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import ProfilePhotoUpload from "../components/common/ProfilePhotoUpload";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/common/RoleBadge";

export default function PersonalDetails() {
  const { user, updateUser, role, isYoungProfessional, isCaregiver, isEmergencyContact } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "John Doe",
    dob: user?.dob || "1958-04-12",
    age: user?.age || "66",
    gender: user?.gender || "Male",
    email: user?.email || "john@example.com",
    phone: user?.phone || "+91 98765 43210",
    language: user?.language || "English",
    timezone: user?.timezone || "(UTC+05:30) India Standard Time",
    location: user?.location || "Mumbai, Maharashtra",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        dob: user.dob || prev.dob,
        age: user.age || prev.age,
        gender: user.gender || prev.gender,
        location: user.location || prev.location,
        language: user.language || prev.language,
        timezone: user.timezone || prev.timezone,
      }));
    }
  }, [user]);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleNextAction = () => {
    updateUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      dob: form.dob,
      age: form.age,
      gender: form.gender,
      location: form.location,
      language: form.language,
      timezone: form.timezone,
    });
    return true;
  };

  return (
    <OnboardingLayout
      step={2}
      title="Personal Information"
      subtitle="Provide your basic profile details and add an avatar photo."
      backTo="/onboarding/user-type"
      nextTo="/onboarding/emergency-contacts"
      nextAction={handleNextAction}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <RoleBadge role={role} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
        <ProfilePhotoUpload
          photoUrl={user?.photoUrl}
          userName={form.name}
          size="xl"
          autoSave={true}
        />
      </div>

      <div className="form-grid">
        <label className="form-field full">
          <span className="field-label">Full Name *</span>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
            required
          />
        </label>

        <label className="form-field">
          <span className="field-label">Date of Birth</span>
          <input
            type="date"
            value={form.dob}
            onChange={(e) => update("dob", e.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="field-label">Age</span>
          <input
            type="number"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="field-label">Gender</span>
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </label>

        <label className="form-field">
          <span className="field-label">Email Address *</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </label>

        <label className="form-field">
          <span className="field-label">Phone Number</span>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="form-field">
          <span className="field-label">Preferred Language</span>
          <select
            value={form.language}
            onChange={(e) => update("language", e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Tamil</option>
            <option>Spanish</option>
          </select>
        </label>

        <label className="form-field full">
          <span className="field-label">City & Location</span>
          <input
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Bandra, Mumbai"
          />
        </label>
      </div>
    </OnboardingLayout>
  );
}
