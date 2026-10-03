import { Pencil, Plus, Trash2, CalendarDays, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/common/Modal";
import RoleBadge from "../components/common/RoleBadge";
import ReadOnlyBanner from "../components/common/ReadOnlyBanner";

const empty = {
  title: "",
  doctorName: "",
  specialization: "",
  hospital: "",
  phone: "",
  date: new Date().toISOString().slice(0, 10),
  time: "11:00 AM",
  location: "",
  reminder: "30 minutes before",
};

export default function Appointments() {
  const { appointments = [], addAppointment, updateAppointment, deleteAppointment } = useApp();
  const { user, role, isReadOnly, isEmergencyContact } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const add = () => {
    if (isReadOnly) return;
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const edit = (a) => {
    if (isReadOnly) return;
    setEditing(a.id);
    setForm({ ...a });
    setOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!form.title.trim()) return;

    editing ? updateAppointment(editing, form) : addAppointment(form);
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
          <div className="eyebrow">APPOINTMENTS & DOCTOR VISITS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>Appointments</h1>
            <RoleBadge role={role} />
          </div>
          <p>
            {isEmergencyContact
              ? `Viewing upcoming medical visits and consultations for ${user?.associatedPatient?.name || "John Doe"}.`
              : "Keep track of scheduled consultations, checkups, and reminders."}
          </p>
        </div>

        {!isReadOnly && (
          <button className="btn btn-primary" onClick={add}>
            <Plus size={16} /> Add Appointment
          </button>
        )}
      </div>

      <div className="tabs">
        <button className="tab active">Upcoming Schedule ({appointments.length})</button>
      </div>

      <div className="appointment-list">
        {appointments.map((a) => (
          <AppointmentRow
            key={a.id}
            appointment={a}
            isReadOnly={isReadOnly}
            onEdit={() => edit(a)}
            onDelete={() =>
              window.confirm(`Delete ${a.title}?`) && deleteAppointment(a.id)
            }
          />
        ))}
      </div>

      {!appointments.length && (
        <div className="panel empty-state">No upcoming appointments scheduled.</div>
      )}

      {open && !isReadOnly && (
        <Modal
          title={editing ? "Edit Appointment Details" : "Add New Appointment"}
          onClose={() => setOpen(false)}
        >
          <form className="stack-form" onSubmit={save}>
            <label className="form-field">
              <span className="field-label">Appointment Title *</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Dr. Sharma Regular Checkup"
              />
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span className="field-label">Doctor Name</span>
                <input
                  value={form.doctorName}
                  onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                  placeholder="e.g. Dr. Sharma"
                />
              </label>

              <label className="form-field">
                <span className="field-label">Specialization</span>
                <input
                  value={form.specialization}
                  onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                  }
                  placeholder="e.g. Cardiologist"
                />
              </label>

              <label className="form-field">
                <span className="field-label">Hospital / Clinic</span>
                <input
                  value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                  placeholder="e.g. City Hospital"
                />
              </label>

              <label className="form-field">
                <span className="field-label">Doctor Phone</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label className="form-field">
                <span className="field-label">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </label>

              <label className="form-field">
                <span className="field-label">Time</span>
                <input
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="e.g. 11:30 AM"
                  required
                />
              </label>
            </div>

            <label className="form-field">
              <span className="field-label">Location / Address</span>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. City Hospital, 2nd Floor, Bandra West"
              />
            </label>

            <label className="form-field">
              <span className="field-label">Notification Reminder</span>
              <select
                value={form.reminder}
                onChange={(e) => setForm({ ...form, reminder: e.target.value })}
              >
                <option>15 minutes before</option>
                <option>30 minutes before</option>
                <option>1 hour before</option>
                <option>1 day before</option>
              </select>
            </label>

            <button className="btn btn-primary btn-full" type="submit">
              {editing ? "Save Changes" : "Save Appointment"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function AppointmentRow({ appointment, isReadOnly, onEdit, onDelete }) {
  const dateObj = new Date(`${appointment.date}T12:00:00`);
  const isValidDate = !Number.isNaN(dateObj.getTime());
  const month = isValidDate
    ? dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    : "OCT";
  const day = isValidDate ? dateObj.getDate() : "12";

  return (
    <div className="appointment-card">
      <div className="date-block">
        <span>{month}</span>
        <strong>{day}</strong>
      </div>
      <div className="appointment-main">
        <div className="appointment-title-row">
          <h3>{appointment.title}</h3>
          {!isReadOnly && (
            <div className="card-actions">
              <button className="icon-btn" onClick={onEdit} title="Edit Appointment">
                <Pencil size={14} />
              </button>
              <button
                className="icon-btn danger-icon"
                onClick={onDelete}
                title="Delete Appointment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        <p>
          {appointment.doctorName || "Doctor"} · {appointment.specialization || "Appointment"}
          {appointment.phone ? ` · Tel: ${appointment.phone}` : ""}
        </p>
        <div className="appointment-meta">
          <span>◷ {appointment.time}</span>
          <span>⌖ {appointment.location || appointment.hospital || "Location not set"}</span>
        </div>
      </div>
      <span className="upcoming-label">Scheduled</span>
    </div>
  );
}
