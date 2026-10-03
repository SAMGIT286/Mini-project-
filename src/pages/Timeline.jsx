import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Filter,
  Activity,
  Pill,
  Clock,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/common/Modal";
import RoleBadge from "../components/common/RoleBadge";
import ReadOnlyBanner from "../components/common/ReadOnlyBanner";

export default function Timeline() {
  const { memories = [], addMemory, deleteMemory } = useApp();
  const { user, role, isReadOnly, isEmergencyContact } = useAuth();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Date());
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState({ time: "12:00", title: "", type: "routine" });

  const monthStart = new Date(selected.getFullYear(), selected.getMonth(), 1);
  const days = new Date(selected.getFullYear(), selected.getMonth() + 1, 0).getDate();
  const first = monthStart.getDay();
  const cells = useMemo(
    () => Array.from({ length: first + days }, (_, i) => (i < first ? null : i - first + 1)),
    [first, days]
  );
  const label = selected.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const filteredMemories = (memories || []).filter((m) => {
    if (filterType === "all") return true;
    return m.type === filterType;
  });

  const save = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!form.title.trim()) return;

    addMemory({
      time: formatTime(form.time),
      title: form.title,
      type: form.type || "routine",
    });
    setForm({ time: "12:00", title: "", type: "routine" });
    setOpen(false);
  };

  const move = (n) => setSelected(new Date(selected.getFullYear(), selected.getMonth() + n, 1));

  return (
    <div className="page">
      {isEmergencyContact && (
        <div style={{ marginBottom: "16px" }}>
          <ReadOnlyBanner patientName={user?.associatedPatient?.name || "John Doe"} />
        </div>
      )}

      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow">ACTIVITY & MEMORY TRACKING</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>Memory Timeline</h1>
            <RoleBadge role={role} />
          </div>
          <p>
            {isEmergencyContact
              ? `Viewing daily activity and medication timeline for ${user?.associatedPatient?.name || "John Doe"}.`
              : "A chronological day-by-day record of your activities, medicines, and memories."}
          </p>
        </div>

        {!isReadOnly && (
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Add Memory
          </button>
        )}
      </div>

      <div className="timeline-filter-bar">
        <span>Filter events:</span>
        {["all", "routine", "medicine", "appointment", "person", "memory"].map((typeKey) => (
          <button
            key={typeKey}
            type="button"
            className={`filter-pill ${filterType === typeKey ? "active" : ""}`}
            onClick={() => setFilterType(typeKey)}
          >
            {typeKey === "all" ? "All Events" : labelFor(typeKey)}
          </button>
        ))}
      </div>

      <div className="timeline-layout">
        <section className="panel calendar-panel">
          <div className="calendar-header">
            <button className="icon-btn" onClick={() => move(-1)} title="Previous month">
              <ChevronLeft size={17} />
            </button>
            <strong>{label}</strong>
            <button className="icon-btn" onClick={() => move(1)} title="Next month">
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="week-labels">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {cells.map((date, i) =>
              date ? (
                <button
                  className={`calendar-day ${date === selected.getDate() ? "selected" : ""}`}
                  key={i}
                  onClick={() =>
                    setSelected(new Date(selected.getFullYear(), selected.getMonth(), date))
                  }
                >
                  <span>{date}</span>
                  {date === selected.getDate() && <i />}
                </button>
              ) : (
                <span key={i} />
              )
            )}
          </div>
          <div className="calendar-legend">
            <span>
              <i className="dot green" /> Activity Logged
            </span>
            <span>
              <i className="dot orange" /> Medicine Event
            </span>
          </div>
        </section>

        <section className="panel timeline-panel">
          <div className="panel-header">
            <div>
              <h2>
                Events on{" "}
                {selected.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <p>{filteredMemories.length} recorded events for this view</p>
            </div>
            <CalendarDays size={18} />
          </div>

          <div className="timeline-list">
            {filteredMemories.length ? (
              filteredMemories.map((m) => (
                <div className="timeline-event" key={m.id}>
                  <div className="timeline-time">{m.time}</div>
                  <div className="timeline-line">
                    <span className={`timeline-dot ${m.type || "memory"}`} />
                  </div>
                  <div className="timeline-content">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <strong>{m.title}</strong>
                        <span>{labelFor(m.type)}</span>
                      </div>
                      {!isReadOnly && (
                        <button
                          className="timeline-delete"
                          onClick={() => deleteMemory(m.id)}
                          title="Delete memory"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No activities recorded for this filter.</div>
            )}
          </div>
        </section>
      </div>

      {open && !isReadOnly && (
        <Modal title="Add New Memory to Timeline" onClose={() => setOpen(false)}>
          <form className="stack-form" onSubmit={save}>
            <div className="form-grid">
              <label className="form-field">
                <span className="field-label">Time</span>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </label>

              <label className="form-field">
                <span className="field-label">Category</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="routine">Daily routine</option>
                  <option value="medicine">Medicine</option>
                  <option value="appointment">Appointment</option>
                  <option value="person">Social Interaction</option>
                  <option value="memory">Personal Memory</option>
                </select>
              </label>
            </div>

            <label className="form-field">
              <span className="field-label">What happened? *</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Had lunch with family in Bandra"
              />
            </label>

            <button className="btn btn-primary btn-full" type="submit">
              Save Memory
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function formatTime(v) {
  if (!v) return "";
  const [h, m] = v.split(":");
  const d = new Date();
  d.setHours(+h, +m);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function labelFor(type) {
  return (
    {
      routine: "Daily routine",
      medicine: "Medicine taken",
      appointment: "Doctor / Appointment",
      person: "Social Interaction",
      memory: "Personal Memory",
    }[type] || "Memory"
  );
}
