import { Plus, Trash2, ShieldAlert } from "lucide-react";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const blank = { name: "", relationship: "Family", phone: "", email: "" };

export default function EmergencyContacts() {
  const { user, updateUser } = useAuth();
  const [contacts, setContacts] = useState(
    user?.emergencyContacts && user.emergencyContacts.length > 0
      ? user.emergencyContacts
      : [
          {
            name: "Anita Sharma",
            relationship: "Daughter",
            phone: "+91 98765 43210",
            email: "anita@example.com",
          },
          {
            name: "Rahul Sharma",
            relationship: "Son",
            phone: "+91 91234 56789",
            email: "rahul@example.com",
          },
        ]
  );

  const update = (index, key, value) =>
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [key]: value } : c))
    );

  const removeContact = (index) => {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateUser({ emergencyContacts: contacts });
    return true;
  };

  return (
    <OnboardingLayout
      step={3}
      title="Emergency Contacts"
      subtitle="Add trusted family members or friends to notify in case of an emergency."
      backTo="/onboarding/personal-details"
      nextTo="/onboarding/caregiver-details"
      nextAction={handleNext}
    >
      <div className="contact-stack">
        {contacts.map((contact, index) => (
          <div className="section-box" key={index}>
            <div className="section-box-title">
              <span>
                Contact {index + 1}{" "}
                {index === 0 && <span className="pill green">Primary</span>}
              </span>
              {contacts.length > 1 && (
                <button
                  type="button"
                  className="icon-btn danger-icon"
                  style={{ marginLeft: "auto", width: "24px", height: "24px" }}
                  onClick={() => removeContact(index)}
                  title="Remove contact"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span className="field-label">Name *</span>
                <input
                  value={contact.name}
                  onChange={(e) => update(index, "name", e.target.value)}
                  placeholder="Contact Name"
                  required
                />
              </label>

              <label className="form-field">
                <span className="field-label">Relationship</span>
                <select
                  value={contact.relationship}
                  onChange={(e) => update(index, "relationship", e.target.value)}
                >
                  <option>Daughter</option>
                  <option>Son</option>
                  <option>Spouse</option>
                  <option>Sibling</option>
                  <option>Friend</option>
                  <option>Colleague</option>
                  <option>Neighbor</option>
                </select>
              </label>

              <label className="form-field">
                <span className="field-label">Phone Number *</span>
                <input
                  value={contact.phone}
                  onChange={(e) => update(index, "phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </label>

              <label className="form-field">
                <span className="field-label">Email (optional)</span>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => update(index, "email", e.target.value)}
                  placeholder="contact@example.com"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-light-green"
        style={{ marginTop: "10px" }}
        onClick={() => setContacts((p) => [...p, blank])}
      >
        <Plus size={15} /> Add Another Contact
      </button>
    </OnboardingLayout>
  );
}
