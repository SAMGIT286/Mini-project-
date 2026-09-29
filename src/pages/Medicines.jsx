import { Plus, Pill } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Modal from "../components/common/Modal";
import MedicineCard from "../components/medicines/MedicineCard";

const empty = { name: "", dosage: "1 tablet", frequency: "Once daily", time: "08:00", startDate: "", endDate: "", reminderEnabled: true, notes: "" };

export default function Medicines() {
  const { medicines, addMedicine, markMedicineTaken } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const save = (e) => {
    e.preventDefault();
    addMedicine({ ...form, time: formatTime(form.time) });
    setForm(empty);
    setOpen(false);
  };

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading"><div className="eyebrow">HEALTH & REMINDERS</div><h1>Medicines</h1><p>Manage your medicines and reminders.</p></div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Add Medicine</button>
      </div>

      <div className="tabs"><button className="tab active">Active ({medicines.length})</button><button className="tab">Completed</button></div>

      <div className="medicine-list">
        {medicines.map((m) => <MedicineCard key={m.id} medicine={m} onTaken={markMedicineTaken} />)}
      </div>

      {open && (
        <Modal title="Add Medicine" onClose={() => setOpen(false)}>
          <form className="stack-form" onSubmit={save}>
            <label className="form-field"><span className="field-label">Medicine name</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Blood Pressure Medicine" /></label>
            <div className="form-grid">
              <label className="form-field"><span className="field-label">Dosage</span><input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">Frequency</span><select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}><option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>Weekly</option></select></label>
              <label className="form-field"><span className="field-label">Time</span><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">Start date</span><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">End date</span><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label>
            </div>
            <label className="check-row"><input type="checkbox" checked={form.reminderEnabled} onChange={(e) => setForm({ ...form, reminderEnabled: e.target.checked })} /><span>Enable reminder</span></label>
            <label className="form-field"><span className="field-label">Notes</span><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="3" /></label>
            <button className="btn btn-primary btn-full" type="submit"><Pill size={16} /> Save Medicine</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function formatTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":");
  const date = new Date();
  date.setHours(h, m);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
