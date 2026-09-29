import { Plus } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useState } from "react";

const blank = { name: "", relationship: "", phone: "", email: "" };

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([
    { name: "Anita Sharma", relationship: "Daughter", phone: "+91 98765 43210", email: "anita@example.com" },
    { name: "Rahul Sharma", relationship: "Son", phone: "+91 91234 56789", email: "rahul@example.com" },
  ]);

  const update = (index, key, value) =>
    setContacts((prev) => prev.map((c, i) => i === index ? { ...c, [key]: value } : c));

  return (
    <OnboardingLayout
      step={3}
      title="Emergency Contacts"
      subtitle="Add at least one trusted emergency contact."
      backTo="/onboarding/personal-details"
      nextTo="/onboarding/caregiver-details"
    >
      <div className="contact-stack">
        {contacts.map((contact, index) => (
          <div className="section-box" key={index}>
            <div className="section-box-title">Contact {index + 1} {index === 0 && <span className="pill green">Primary</span>}</div>
            <div className="form-grid">
              <label className="form-field"><span className="field-label">Name</span><input value={contact.name} onChange={(e) => update(index, "name", e.target.value)} /></label>
              <label className="form-field"><span className="field-label">Relationship</span><select value={contact.relationship} onChange={(e) => update(index, "relationship", e.target.value)}><option>Daughter</option><option>Son</option><option>Spouse</option><option>Friend</option><option>Sibling</option></select></label>
              <label className="form-field"><span className="field-label">Phone Number</span><input value={contact.phone} onChange={(e) => update(index, "phone", e.target.value)} /></label>
              <label className="form-field"><span className="field-label">Email <em>(optional)</em></span><input value={contact.email} onChange={(e) => update(index, "email", e.target.value)} /></label>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-light-green" onClick={() => setContacts((p) => [...p, blank])}><Plus size={15} /> Add Another Contact</button>
    </OnboardingLayout>
  );
}
