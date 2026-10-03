import { MoreVertical, Plus, Pill, Trash2, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/common/Modal";
import RoleBadge from "../components/common/RoleBadge";
import ReadOnlyBanner from "../components/common/ReadOnlyBanner";

const empty = {
  name: "",
  dosage: "1 tablet",
  frequency: "Once daily",
  time: "08:00",
  startDate: "",
  endDate: "",
  reminderEnabled: true,
  notes: "",
};

export default function Medicines() {
  const { medicines = [], addMedicine, updateMedicine, deleteMedicine, markMedicineTaken } = useApp();
  const { user, role, isReadOnly, isEmergencyContact } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openAdd = () => {
    if (isReadOnly) return;
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (m) => {
    if (isReadOnly) return;
    setEditing(m.id);
    setForm({ ...m, time: to24(m.time) });
    setOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!form.name.trim()) return;

    const data = { ...form, time: formatTime(form.time) };
    editing ? updateMedicine(editing, data) : addMedicine(data);
    setOpen(false);
  };

  return (
    <div className="page">
      {isEmergencyContact && (
        <div style={{ marginBottom: "16px" }}>
          <ReadOnlyBanner patientName={user?.associatedPatient?.name || "John Doe"} />
        </div>
      )}

      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow">MEDICATIONS & REMINDERS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>Medicines</h1>
            <RoleBadge role={role} />
          </div>
          <p>
            {isEmergencyContact
              ? `Viewing active medication plan for ${user?.associatedPatient?.name || "John Doe"}.`
              : "Manage your daily prescriptions, supplements, and timing reminders."}
          </p>
        </div>

        {!isReadOnly && (
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Medicine
          </button>
        )}
      </div>

      <div className="tabs">
        <button className="tab active">Active Prescriptions ({medicines.length})</button>
      </div>

      <div className="medicine-list">
        {medicines.map((m) => (
          <MedicineRow
            key={m.id}
            medicine={m}
            isReadOnly={isReadOnly}
            onTaken={markMedicineTaken}
            onEdit={() => openEdit(m)}
            onDelete={() => deleteMedicine(m.id)}
          />
        ))}
      </div>

      {!medicines.length && (
        <div className="panel empty-state">No medicines or supplements registered yet.</div>
      )}

      {open && !isReadOnly && (
        <Modal
          title={editing ? "Edit Medicine Details" : "Add New Medicine"}
          onClose={() => setOpen(false)}
        >
          <form className="stack-form" onSubmit={save}>
            <label className="form-field">
              <span className="field-label">Medicine Name *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Blood Pressure Medicine"
              />
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span className="field-label">Dosage</span>
                <input
                  value={form.dosage}
                  onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                  placeholder="e.g. 1 tablet (5mg)"
                />
              </label>

              <label className="form-field">
                <span className="field-label">Frequency</span>
                <select
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>Weekly</option>
                  <option>As needed (SOS)</option>
                </select>
              </label>

              <label className="form-field">
                <span className="field-label">Time</span>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </label>

              <label className="form-field">
                <span className="field-label">Start Date</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </label>

              <label className="form-field">
                <span className="field-label">End Date (optional)</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </label>
            </div>

            <label className="check-row">
              <input
                type="checkbox"
                checked={form.reminderEnabled}
                onChange={(e) =>
                  setForm({ ...form, reminderEnabled: e.target.checked })
                }
              />
              <span>Enable audio & notification reminders</span>
            </label>

            <label className="form-field">
              <span className="field-label">Doctor's Instructions / Notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows="3"
                placeholder="e.g. Take after breakfast with water"
              />
            </label>

            <button className="btn btn-primary btn-full" type="submit">
              <Pill size={16} /> {editing ? "Save Changes" : "Save Medicine"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function MedicineRow({ medicine, isReadOnly, onTaken, onEdit, onDelete }) {
  return (
    <div className="medicine-card">
      <div className={`medicine-icon ${medicine.status === "taken" ? "taken" : ""}`}>
        <Pill size={20} />
      </div>
      <div className="medicine-main">
        <div className="medicine-title-row">
          <h3>{medicine.name}</h3>
          {!isReadOnly && (
            <div className="card-actions">
              <button className="icon-btn" onClick={onEdit} title="Edit Medicine">
                <Pencil size={14} />
              </button>
              <button
                className="icon-btn danger-icon"
                onClick={() =>
                  window.confirm(`Delete ${medicine.name}?`) && onDelete()
                }
                title="Delete Medicine"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        <p>
          {medicine.dosage} · {medicine.frequency}
          {medicine.notes ? ` · (${medicine.notes})` : ""}
        </p>
        <div className="medicine-meta">◷ Scheduled: {medicine.time}</div>
      </div>

      <div className="medicine-status">
        {medicine.status === "taken" ? (
          <span className="status-pill success">
            <Check size={12} /> Taken {medicine.takenAt ? `at ${medicine.takenAt}` : ""}
          </span>
        ) : isReadOnly ? (
          <span className="status-pill warning" style={{ background: "#fff6e6", color: "#b37400" }}>
            Scheduled
          </span>
        ) : (
          <button className="mini-btn" onClick={() => onTaken(medicine.id)}>
            Mark as Taken
          </button>
        )}
      </div>
    </div>
  );
}

function formatTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function to24(value) {
  if (!value || value.includes("T")) return value;
  const d = new Date(`2000-01-01 ${value}`);
  return Number.isNaN(d.getTime())
    ? "08:00"
    : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
