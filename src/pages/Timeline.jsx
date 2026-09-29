import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Modal from "../components/common/Modal";

const calendar = [
  ["Sun", 1], ["Mon", 2], ["Tue", 3], ["Wed", 4], ["Thu", 5], ["Fri", 6], ["Sat", 7],
  ["Sun", 8], ["Mon", 9], ["Tue", 10], ["Wed", 11], ["Thu", 12], ["Fri", 13], ["Sat", 14],
  ["Sun", 15], ["Mon", 16], ["Tue", 17], ["Wed", 18], ["Thu", 19], ["Fri", 20], ["Sat", 21],
  ["Sun", 22], ["Mon", 23], ["Tue", 24], ["Wed", 25], ["Thu", 26], ["Fri", 27], ["Sat", 28],
];

export default function Timeline() {
  const { memories, addMemory } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ time: "12:00", title: "" });

  const save = (e) => {
    e.preventDefault();
    addMemory(form);
    setOpen(false);
    setForm({ time: "12:00", title: "" });
  };

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading"><div className="eyebrow">YOUR MEMORY</div><h1>Memory Timeline</h1><p>A day-by-day view of your memories and activities.</p></div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Add Memory</button>
      </div>

      <div className="timeline-layout">
        <section className="panel calendar-panel">
          <div className="calendar-header"><button className="icon-btn"><ChevronLeft size={17} /></button><strong>September 2024</strong><button className="icon-btn"><ChevronRight size={17} /></button></div>
          <div className="week-labels">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <span key={d}>{d}</span>)}</div>
          <div className="calendar-grid">
            {calendar.map(([day, date]) => (
              <button className={`calendar-day ${date === 9 ? "selected" : ""}`} key={date}>
                <span>{date}</span>
                {date === 9 && <i />}
              </button>
            ))}
          </div>
          <div className="calendar-legend"><span><i className="dot green" /> Memory</span><span><i className="dot orange" /> Medicine</span></div>
        </section>

        <section className="panel timeline-panel">
          <div className="panel-header"><div><h2>Events on 9 September 2024</h2><p>5 activities recorded</p></div><CalendarDays size={18} /></div>
          <div className="timeline-list">
            {memories.map((m) => (
              <div className="timeline-event" key={m.id}>
                <div className="timeline-time">{m.time}</div>
                <div className="timeline-line"><span className={`timeline-dot ${m.type}`} /></div>
                <div className="timeline-content"><strong>{m.title}</strong><span>{labelFor(m.type)}</span></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {open && (
        <Modal title="Add Memory" onClose={() => setOpen(false)}>
          <form className="stack-form" onSubmit={save}>
            <label className="form-field"><span className="field-label">Time</span><input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
            <label className="form-field"><span className="field-label">What happened?</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Had lunch with family" /></label>
            <button className="btn btn-primary btn-full" type="submit">Save Memory</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function labelFor(type) {
  return { routine: "Daily routine", medicine: "Medicine", appointment: "Appointment", person: "Interaction", memory: "Memory" }[type] || "Memory";
}
