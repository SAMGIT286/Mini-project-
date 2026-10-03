import { useState } from "react";
import { HeartHandshake, Plus, Pencil, Trash2, Check, Shield, Phone, Mail, UserCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";

const initialCaregiver = {
  name: "",
  relationship: "Daughter",
  phone: "",
  email: "",
  permissions: {
    medicine: true,
    appointments: true,
    timeline: true,
    alerts: true,
  },
};

export default function CaregiverSection() {
  const { user, updateUser } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState(user?.caregiver || initialCaregiver);
  const [message, setMessage] = useState("");

  const hasCaregiver = !!(user?.caregiver && user?.caregiver?.name);

  const openAddModal = () => {
    setForm(initialCaregiver);
    setOpenModal(true);
  };

  const openEditModal = () => {
    setForm(user?.caregiver || initialCaregiver);
    setOpenModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      return;
    }
    updateUser({ caregiver: form });
    setOpenModal(false);
    setMessage("Caregiver details updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to disconnect this caregiver? You can add one back anytime.")) {
      updateUser({ caregiver: null });
      setMessage("Caregiver removed.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const togglePermission = (key) => {
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions?.[key],
      },
    }));
  };

  return (
    <div className="caregiver-section-container">
      <div className="settings-section-title">
        <h2>Connected Caregiver</h2>
        <p>Manage family members or trusted caregivers who have access to assist you.</p>
      </div>

      {message && (
        <div className="photo-upload-message success" style={{ marginBottom: "15px" }}>
          <Check size={14} />
          <span>{message}</span>
        </div>
      )}

      {hasCaregiver ? (
        <div className="caregiver-card-detailed">
          <div className="caregiver-header-row">
            <div className="caregiver-avatar-box">
              <HeartHandshake size={24} />
            </div>
            <div className="caregiver-info-main">
              <div className="caregiver-title-flex">
                <h3>{user.caregiver.name}</h3>
                <span className="pill green">{user.caregiver.relationship || "Caregiver"}</span>
              </div>
              <div className="caregiver-contacts">
                {user.caregiver.phone && (
                  <span>
                    <Phone size={12} /> {user.caregiver.phone}
                  </span>
                )}
                {user.caregiver.email && (
                  <span>
                    <Mail size={12} /> {user.caregiver.email}
                  </span>
                )}
              </div>
            </div>

            <div className="caregiver-action-buttons">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={openEditModal}
                title="Edit Caregiver"
              >
                <Pencil size={13} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm danger-btn"
                onClick={handleRemove}
                title="Remove Caregiver"
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="caregiver-permissions-box">
            <span className="permissions-title">
              <Shield size={13} /> Authorized Access Permissions:
            </span>
            <div className="permissions-chips">
              <span className={`perm-chip ${user.caregiver.permissions?.medicine ? "enabled" : "disabled"}`}>
                💊 Medicine Tracking
              </span>
              <span className={`perm-chip ${user.caregiver.permissions?.appointments ? "enabled" : "disabled"}`}>
                📅 Doctor Appointments
              </span>
              <span className={`perm-chip ${user.caregiver.permissions?.timeline ? "enabled" : "disabled"}`}>
                ⏱️ Daily Activity Timeline
              </span>
              <span className={`perm-chip ${user.caregiver.permissions?.alerts ? "enabled" : "disabled"}`}>
                🚨 Emergency & Adherence Alerts
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="caregiver-empty-card">
          <div className="empty-icon-wrap">
            <HeartHandshake size={28} />
          </div>
          <h3>No Caregiver Added Yet</h3>
          <p>
            Adding a caregiver is completely optional. If added, they can help monitor your medication schedule and appointments.
          </p>
          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            <Plus size={15} /> Add Caregiver
          </button>
        </div>
      )}

      {openModal && (
        <Modal
          title={hasCaregiver ? "Edit Caregiver Information" : "Add New Caregiver"}
          onClose={() => setOpenModal(false)}
        >
          <form className="stack-form" onSubmit={handleSave}>
            <label className="form-field">
              <span className="field-label">Caregiver Full Name *</span>
              <input
                required
                placeholder="e.g. Priya Mehta"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span className="field-label">Relationship</span>
                <select
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                >
                  <option>Daughter</option>
                  <option>Son</option>
                  <option>Daughter-in-law</option>
                  <option>Son-in-law</option>
                  <option>Spouse</option>
                  <option>Sibling</option>
                  <option>Professional Nurse / Caregiver</option>
                  <option>Trusted Friend</option>
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
            </div>

            <label className="form-field">
              <span className="field-label">Email Address</span>
              <input
                type="email"
                placeholder="caregiver@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <div className="section-box" style={{ marginTop: "10px" }}>
              <div className="section-box-title">
                <Shield size={14} /> Access Permissions
              </div>
              <div className="permission-list">
                {[
                  ["medicine", "View medicine status and adherence"],
                  ["appointments", "View and manage doctor appointments"],
                  ["timeline", "View daily memory and activity timeline"],
                  ["alerts", "Receive automated emergency alerts and notifications"],
                ].map(([key, label]) => (
                  <label className="check-row" key={key}>
                    <input
                      type="checkbox"
                      checked={!!form.permissions?.[key]}
                      onChange={() => togglePermission(key)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={14} /> Save Caregiver
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
