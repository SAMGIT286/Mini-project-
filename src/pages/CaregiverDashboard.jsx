import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Pill,
  ShieldCheck,
  UserRound,
  Phone,
  HeartHandshake,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import RoleBadge from "../components/common/RoleBadge";

export default function CaregiverDashboard() {
  const { user, role } = useAuth();
  const { medicines = [], appointments = [], memories = [], markMedicineTaken } = useApp();

  const patient = user?.associatedPatient || {
    id: "patient-john",
    name: "John Doe",
    relationship: "Father-in-law",
    age: "66",
    phone: "+91 98765 43210",
    address: "Bandra West, Mumbai",
    doctor: "Dr. Sharma (+91 98765 43210)",
    condition: "Hypertension & Diabetes management",
    emergencyContact: "Anita Sharma (+91 98765 43210)",
  };

  const takenMeds = (medicines || []).filter((m) => m.status === "taken").length;
  const adherenceRate = medicines.length
    ? Math.round((takenMeds / medicines.length) * 100)
    : 100;

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow">AUTHORIZED CAREGIVER PORTAL</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>Caregiver Dashboard</h1>
            <RoleBadge role="caregiver" />
          </div>
          <p>
            Monitor and support <strong>{patient.name}</strong>'s medication schedule, appointments, and wellbeing.
          </p>
        </div>

        <div className="patient-selector-wrap" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>Active Patient:</span>
          <select className="patient-select" style={{ fontWeight: 600 }}>
            <option>{patient.name} ({patient.relationship})</option>
            <option>Other Connected Patient...</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <CareStat
          icon={Pill}
          value={`${adherenceRate}%`}
          label="Today's Medicine Adherence"
          badge={`${takenMeds}/${medicines.length} taken`}
        />
        <CareStat
          icon={CalendarDays}
          value={appointments.length}
          label="Scheduled Doctor Visits"
          badge="Upcoming"
        />
        <CareStat
          icon={Activity}
          value={`${memories.length} logs`}
          label="Daily Activity & Routine"
          badge="Active Today"
        />
        <CareStat
          icon={ShieldCheck}
          value="Normal"
          label="Health & Alert Status"
          badge="No Alerts"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{patient.name}'s Medication Routine</h2>
              <p>Adherence and scheduled doses</p>
            </div>
            <Pill size={18} />
          </div>

          <div className="summary-list">
            {medicines.map((m) => (
              <div
                key={m.id}
                className="schedule-row"
                style={{ gridTemplateColumns: "60px 24px 1fr auto" }}
              >
                <span className="schedule-time">{m.time}</span>
                <span className="schedule-icon">💊</span>
                <div>
                  <strong>{m.name}</strong>
                  <div style={{ fontSize: "9px", color: "var(--muted)" }}>
                    {m.dosage} · {m.frequency}
                  </div>
                </div>
                {m.status === "taken" ? (
                  <span className="status-pill success">
                    <Check size={12} /> Taken {m.takenAt ? `at ${m.takenAt}` : ""}
                  </span>
                ) : (
                  <button
                    className="mini-btn"
                    onClick={() => markMedicineTaken(m.id)}
                    title="Mark taken on behalf of patient"
                  >
                    Confirm Taken
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent Alerts & Care Actions</h2>
              <p>Items requiring attention</p>
            </div>
            <ShieldCheck size={18} />
          </div>

          <div className="alert-card good">
            <CheckCircle2 size={17} />
            <div>
              <strong>Morning Blood Pressure Medicine Verified</strong>
              <span>Logged at 10:04 AM by patient.</span>
            </div>
          </div>

          <div className="alert-card good">
            <CheckCircle2 size={17} />
            <div>
              <strong>No Missed Appointments</strong>
              <span>Next visit with Dr. Sharma on Oct 9.</span>
            </div>
          </div>

          <div className="caregiver-quick-actions" style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <a
              href={`tel:${patient.phone}`}
              className="settings-action"
              style={{ padding: "10px 12px" }}
            >
              <Phone size={16} />
              <span>
                <strong>Call Patient ({patient.name})</strong>
                <small>{patient.phone}</small>
              </span>
              <b>📞</b>
            </a>

            <Link
              to="/assistant"
              className="settings-action"
              style={{ padding: "10px 12px" }}
            >
              <Sparkles size={16} />
              <span>
                <strong>Ask AI Assistant</strong>
                <small>Query patient records and medication history</small>
              </span>
              <b>✦</b>
            </Link>
          </div>
        </section>
      </div>

      <section className="panel caregiver-profile-strip">
        <div className="avatar avatar-md">
          {patient.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <strong>{patient.name}</strong>
          <span>
            {patient.relationship} · Age: {patient.age} · Medical condition: {patient.condition}
          </span>
        </div>
        <Link to="/timeline" className="btn btn-outline btn-sm">
          View Patient Timeline →
        </Link>
      </section>
    </div>
  );
}

function CareStat({ icon: Icon, value, label, badge }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={18} />
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <strong>{value}</strong>
          {badge && <span className="pill green" style={{ fontSize: "8px" }}>{badge}</span>}
        </div>
        <span>{label}</span>
      </div>
    </div>
  );
}
