import { Plus } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import AppointmentCard from "../components/appointments/AppointmentCard";
import Modal from "../components/common/Modal";

const empty = { title: "", doctorName: "", specialization: "", hospital: "", phone: "", date: "2024-09-20", time: "11:00", location: "", reminder: "30 minutes before" };

export default function Appointments() {
  const { appointments, addAppointment } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);

  const save = (e) => {
    e.preventDefault();
    addAppointment(form);
    setOpen(false);
    setForm(empty);
  };

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading"><div className="eyebrow">SCHEDULE</div><h1>Appointments</h1><p>Keep track of your appointments.</p></div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Add Appointment</button>
      </div>

      <div className="tabs"><button className="tab active">Upcoming</button><button className="tab">Past</button></div>
      <div className="appointment-list">{appointments.map((a) => <AppointmentCard key={a.id} appointment={a} />)}</div>

      {open && (
        <Modal title="Add Appointment" onClose={() => setOpen(false)}>
          <form className="stack-form" onSubmit={save}>
            <label className="form-field"><span className="field-label">Appointment title</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Doctor Appointment" /></label>
            <div className="form-grid">
              <label className="form-field"><span className="field-label">Doctor name</span><input value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">Specialization</span><input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">Hospital / Clinic</span><input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">Phone</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">Date</span><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
              <label className="form-field"><span className="field-label">Time</span><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
            </div>
            <label className="form-field"><span className="field-label">Location</span><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
            <label className="form-field"><span className="field-label">Reminder</span><select value={form.reminder} onChange={(e) => setForm({ ...form, reminder: e.target.value })}><option>15 minutes before</option><option>30 minutes before</option><option>1 hour before</option></select></label>
            <button className="btn btn-primary btn-full" type="submit">Save Appointment</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
