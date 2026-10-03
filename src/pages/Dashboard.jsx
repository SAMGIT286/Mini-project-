import {
  CalendarDays,
  Check,
  Clock3,
  Pill,
  Plus,
  Sparkles,
  Users,
  BookOpen,
  Phone,
  ShieldAlert,
  HeartHandshake,
  ArrowRight,
  BriefcaseBusiness,
  Activity,
  Heart,
  AlertTriangle,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/common/RoleBadge";
import ReadOnlyBanner from "../components/common/ReadOnlyBanner";

export default function Dashboard() {
  const { medicines, appointments, memories, markMedicineTaken } = useApp();
  const { user, role, isElderly, isYoungProfessional, isCaregiver, isEmergencyContact, isReadOnly } = useAuth();

  const upcoming = [...(appointments || [])].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  )[0];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // If Emergency Contact role: render Emergency Contact Read-Only Dashboard
  if (isEmergencyContact) {
    const patient = user?.associatedPatient || {
      name: "John Doe",
      relationship: "Father",
      age: "66",
      bloodGroup: "O+",
      doctor: "Dr. Sharma (+91 98765 43210)",
      caregiver: "Priya Mehta (+91 98987 76655)",
      status: "Stable & Routine Active",
    };

    return (
      <div className="dashboard-page">
        <ReadOnlyBanner patientName={patient.name} />

        <div className="welcome-row" style={{ marginTop: "16px" }}>
          <div>
            <div className="eyebrow">{today.toUpperCase()} · EMERGENCY MONITORING</div>
            <h1>Connected Patient: {patient.name}</h1>
            <p>
              Relationship: <strong>{patient.relationship}</strong> · Status: <span className="pill green">{patient.status}</span>
            </p>
          </div>
          <Link to="/timeline" className="btn btn-primary">
            <Activity size={16} /> View Patient Timeline
          </Link>
        </div>

        <div className="stats-grid">
          <StatCard icon={Pill} value={medicines.length} label="Active Medicines" />
          <StatCard icon={CalendarDays} value={appointments.length} label="Upcoming Visits" />
          <StatCard icon={BookOpen} value={memories.length} label="Recent Logs" />
          <StatCard icon={Heart} value="Active" label="Vitals / Monitoring" />
        </div>

        <div className="dashboard-grid">
          <section className="panel schedule-panel">
            <div className="panel-header">
              <div>
                <h2>{patient.name}'s Medication & Care Schedule</h2>
                <p>Real-time adherence overview (Read-only)</p>
              </div>
              <Clock3 size={18} />
            </div>

            {medicines.slice(0, 4).map((m) => (
              <ScheduleRow
                key={m.id}
                time={m.time}
                title={`Take ${m.name} (${m.dosage})`}
                icon="💊"
                action={
                  m.status === "taken" ? (
                    <span className="status-pill success">
                      <Check size={12} /> Taken at {m.takenAt || m.time}
                    </span>
                  ) : (
                    <span className="status-pill warning" style={{ background: "#fff6e6", color: "#b37400" }}>
                      Scheduled
                    </span>
                  )
                }
              />
            ))}

            {upcoming && (
              <ScheduleRow
                time={upcoming.time}
                title={`Appointment: ${upcoming.title} (${upcoming.doctorName || "Doctor"})`}
                icon="🩺"
                action={<span className="status-pill info">{upcoming.date}</span>}
              />
            )}
          </section>

          <section className="panel quick-panel">
            <div className="panel-header">
              <div>
                <h2>Emergency & Care Network</h2>
                <p>Direct contacts for {patient.name}</p>
              </div>
              <ShieldAlert size={18} style={{ color: "var(--danger)" }} />
            </div>

            <div className="emergency-contact-box">
              <div className="contact-line">
                <strong>Primary Doctor:</strong>
                <span>{patient.doctor || "Dr. Sharma (+91 98765 43210)"}</span>
              </div>
              <div className="contact-line">
                <strong>Primary Caregiver:</strong>
                <span>{patient.caregiver || "Priya Mehta (+91 98987 76655)"}</span>
              </div>
              <div className="contact-line">
                <strong>Emergency Helpline:</strong>
                <span style={{ color: "var(--danger)", fontWeight: "bold" }}>112 / 108 (National EMS)</span>
              </div>
            </div>

            <div className="assistant-card">
              <div className="assistant-card-icon">
                <Sparkles size={18} />
              </div>
              <div>
                <strong>Ask AI Assistant</strong>
                <p>Query {patient.name}'s latest logs or medication records.</p>
              </div>
              <Link to="/assistant" className="mini-round" title="Talk to AI Assistant">
                →
              </Link>
            </div>
          </section>
        </div>

        <section className="panel memory-strip">
          <div className="panel-header">
            <div>
              <h2>{patient.name}'s Recent Activity Timeline</h2>
              <p>Chronological memory and routine log</p>
            </div>
            <Link to="/timeline" className="text-link">
              Full timeline view →
            </Link>
          </div>
          {memories.length ? (
            <div className="memory-mini-grid">
              {memories
                .slice(-6)
                .reverse()
                .map((m) => (
                  <div className="memory-mini" key={m.id}>
                    <span className="memory-time">{m.time}</span>
                    <strong>{m.title}</strong>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">No activities recorded yet.</div>
          )}
        </section>
      </div>
    );
  }

  // If Young Professional role: render productivity & wellness dashboard
  if (isYoungProfessional) {
    const hasCaregiver = !!(user?.caregiver && user?.caregiver?.name);

    return (
      <div className="dashboard-page">
        <div className="welcome-row">
          <div>
            <div className="eyebrow">{today.toUpperCase()} · PROFESSIONAL DASHBOARD</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ margin: "4px 0" }}>Hello, {user?.name || "Alex"}! ⚡</h1>
              <RoleBadge role="young_professional" />
            </div>
            <p>Your daily routine, wellness schedule, and appointments at a glance.</p>
          </div>
          <Link to="/assistant" className="btn btn-primary" id="talk-to-assistant-btn">
            <Sparkles size={16} /> Talk to assistant
          </Link>
        </div>

        <div className="stats-grid">
          <StatCard icon={Pill} value={medicines.length} label="Supplements & Meds" />
          <StatCard icon={CalendarDays} value={appointments.length} label="Appointments & Calls" />
          <StatCard icon={BookOpen} value={memories.length} label="Logged Activities" />
          <StatCard
            icon={HeartHandshake}
            value={hasCaregiver ? "1" : "Optional"}
            label={hasCaregiver ? "Care Partner Connected" : "Care Partner (Optional)"}
          />
        </div>

        <div className="dashboard-grid">
          <section className="panel schedule-panel">
            <div className="panel-header">
              <div>
                <h2>Today's Routine & Schedule</h2>
                <p>Wellness habits and reminders</p>
              </div>
              <Clock3 size={18} />
            </div>

            {medicines.slice(0, 4).map((m) => (
              <ScheduleRow
                key={m.id}
                time={m.time}
                title={`${m.name} (${m.dosage})`}
                icon="💊"
                action={
                  m.status !== "taken" ? (
                    <button className="mini-btn" onClick={() => markMedicineTaken(m.id)}>
                      Mark as Done
                    </button>
                  ) : (
                    <span className="status-pill success">
                      <Check size={12} /> Completed
                    </span>
                  )
                }
              />
            ))}

            {upcoming && (
              <ScheduleRow
                time={upcoming.time}
                title={`${upcoming.title} · ${upcoming.doctorName || "Appointment"}`}
                icon="📅"
              />
            )}

            {!medicines.length && !upcoming && (
              <div className="empty-state">
                Your schedule is clean. Add wellness routines, hydration prompts, or appointments.
              </div>
            )}
          </section>

          <section className="panel quick-panel">
            <div className="panel-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Add routines & logs</p>
              </div>
            </div>

            <QuickAction to="/medicines" icon={Plus} label="Add Supplement / Medicine" />
            <QuickAction to="/appointments" icon={Plus} label="Add Appointment / Meeting" />
            <QuickAction to="/timeline" icon={Plus} label="Log Activity / Memory" />

            <div className="assistant-card">
              <div className="assistant-card-icon">
                <Sparkles size={18} />
              </div>
              <div>
                <strong>Ask AI Assistant</strong>
                <p>Query your schedule, vitamins, or daily timeline.</p>
              </div>
              <Link to="/assistant" className="mini-round" title="Talk to AI Assistant">
                →
              </Link>
            </div>

            {!hasCaregiver && (
              <div className="optional-caregiver-callout">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <HeartHandshake size={15} style={{ color: "var(--green-700)" }} />
                  <strong>Care Partner / Health Buddy</strong>
                </div>
                <p>Want a family member or health partner to stay in sync? Setup is optional.</p>
                <Link to="/settings" className="text-link">
                  Add optional partner in Settings →
                </Link>
              </div>
            )}
          </section>
        </div>

        <section className="panel memory-strip">
          <div className="panel-header">
            <div>
              <h2>Recent Memories & Focus Logs</h2>
              <p>Key moments and daily achievements recorded</p>
            </div>
            <Link to="/timeline" className="text-link">
              View timeline →
            </Link>
          </div>
          {memories.length ? (
            <div className="memory-mini-grid">
              {memories
                .slice(-6)
                .reverse()
                .map((m) => (
                  <div className="memory-mini" key={m.id}>
                    <span className="memory-time">{m.time}</span>
                    <strong>{m.title}</strong>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">No activities logged yet. Track your first activity from the timeline.</div>
          )}
        </section>
      </div>
    );
  }

  // Elderly Dashboard (Default / Standard Elderly Person Experience)
  const hasCaregiver = !!(user?.caregiver && user?.caregiver?.name);

  return (
    <div className="dashboard-page">
      <div className="welcome-row">
        <div>
          <div className="eyebrow">{today.toUpperCase()}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ margin: "4px 0" }}>Good morning, {user?.name || "there"}! 👋</h1>
            <RoleBadge role="elderly" />
          </div>
          <p>Here is your daily schedule, medication reminders, and memory summary.</p>
        </div>
        <Link to="/assistant" className="btn btn-primary" id="talk-to-assistant-btn">
          <Sparkles size={16} /> Talk to assistant
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard icon={Pill} value={medicines.length} label="Medicines today" />
        <StatCard icon={CalendarDays} value={appointments.length} label="Appointments" />
        <StatCard icon={BookOpen} value={memories.length} label="Memories recorded" />
        <StatCard
          icon={Users}
          value={hasCaregiver ? "1" : "0"}
          label={hasCaregiver ? "Caregiver connected" : "No caregiver linked"}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel schedule-panel">
          <div className="panel-header">
            <div>
              <h2>Today's Schedule</h2>
              <p>Your day at a glance</p>
            </div>
            <Clock3 size={18} />
          </div>

          {medicines.slice(0, 4).map((m) => (
            <ScheduleRow
              key={m.id}
              time={m.time}
              title={`Take ${m.name} (${m.dosage})`}
              icon="💊"
              action={
                m.status !== "taken" ? (
                  <button className="mini-btn" onClick={() => markMedicineTaken(m.id)}>
                    Mark as Taken
                  </button>
                ) : (
                  <span className="status-pill success">
                    <Check size={12} /> Taken at {m.takenAt || m.time}
                  </span>
                )
              }
            />
          ))}

          {upcoming && (
            <ScheduleRow
              time={upcoming.time}
              title={`${upcoming.title} with ${upcoming.doctorName || "Doctor"}`}
              icon="🩺"
            />
          )}

          {!medicines.length && !upcoming && (
            <div className="empty-state">
              Your schedule is empty. Add a medicine or appointment to get started.
            </div>
          )}
        </section>

        <section className="panel quick-panel">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Common tasks</p>
            </div>
          </div>

          <QuickAction to="/medicines" icon={Plus} label="Add Medicine" />
          <QuickAction to="/appointments" icon={Plus} label="Add Appointment" />
          <QuickAction to="/timeline" icon={Plus} label="Add Memory" />

          <div className="assistant-card">
            <div className="assistant-card-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <strong>Talk to your assistant</strong>
              <p>Ask about your records, medicines or routine.</p>
            </div>
            <Link to="/assistant" className="mini-round" title="Talk to AI Assistant">
              →
            </Link>
          </div>

          {hasCaregiver && (
            <div className="caregiver-quick-status">
              <HeartHandshake size={16} style={{ color: "var(--green-800)" }} />
              <div>
                <strong>Caregiver: {user.caregiver.name}</strong>
                <span>{user.caregiver.phone}</span>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="panel memory-strip">
        <div className="panel-header">
          <div>
            <h2>Recent Memories</h2>
            <p>Things MemoMind remembers from your day</p>
          </div>
          <Link to="/timeline" className="text-link">
            View timeline →
          </Link>
        </div>
        {memories.length ? (
          <div className="memory-mini-grid">
            {memories
              .slice(-6)
              .reverse()
              .map((m) => (
                <div className="memory-mini" key={m.id}>
                  <span className="memory-time">{m.time}</span>
                  <strong>{m.title}</strong>
                </div>
              ))}
          </div>
        ) : (
          <div className="empty-state">
            No memories yet. Add your first memory from the timeline.
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={18} />
      </div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ScheduleRow({ time, title, icon, action }) {
  return (
    <div className="schedule-row">
      <span className="schedule-time">{time}</span>
      <span className="schedule-icon">{icon}</span>
      <strong>{title}</strong>
      {action}
      <span className="schedule-check">
        <Check size={14} />
      </span>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link className="quick-action" to={to}>
      <span>
        <Icon size={15} />
      </span>
      {label}
      <b>+</b>
    </Link>
  );
}
