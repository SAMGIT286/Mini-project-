import { Camera } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useState } from "react";

export default function PersonalDetails() {
  const [form, setForm] = useState({
    name: "John Doe", dob: "1990-01-10", age: "34", gender: "Male",
    email: "john@example.com", phone: "+91 98765 43210",
    language: "English", timezone: "(UTC+05:30) India Standard Time", location: "Mumbai, Maharashtra",
  });

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <OnboardingLayout
      step={2}
      title="Personal Information"
      subtitle="Let's start with some basic details."
      backTo="/onboarding/user-type"
      nextTo="/onboarding/emergency-contacts"
    >
      <div className="profile-upload-row">
        <div className="avatar avatar-xl">JD</div>
        <button className="btn btn-outline"><Camera size={15} /> Upload Photo</button>
      </div>

      <div className="form-grid">
        <label className="form-field full"><span className="field-label">Full Name</span><input value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
        <label className="form-field"><span className="field-label">Date of Birth</span><input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} /></label>
        <label className="form-field"><span className="field-label">Age</span><input value={form.age} onChange={(e) => update("age", e.target.value)} /></label>
        <label className="form-field"><span className="field-label">Gender</span><select value={form.gender} onChange={(e) => update("gender", e.target.value)}><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select></label>
        <label className="form-field"><span className="field-label">Email</span><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></label>
        <label className="form-field"><span className="field-label">Phone Number</span><input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label>
        <label className="form-field"><span className="field-label">Preferred Language</span><select value={form.language} onChange={(e) => update("language", e.target.value)}><option>English</option><option>Hindi</option><option>Marathi</option></select></label>
        <label className="form-field"><span className="field-label">Time Zone <em>(optional)</em></span><select value={form.timezone} onChange={(e) => update("timezone", e.target.value)}><option>(UTC+05:30) India Standard Time</option><option>(UTC+00:00) UTC</option><option>(UTC-05:00) Eastern Time</option></select></label>
        <label className="form-field full"><span className="field-label">Location</span><input value={form.location} onChange={(e) => update("location", e.target.value)} /></label>
      </div>
    </OnboardingLayout>
  );
}
