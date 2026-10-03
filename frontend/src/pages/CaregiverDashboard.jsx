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
  const { user, role, t } = useAuth();
  const { medicines = [], appointments = [], memories = [], markMedicineTaken } = useApp();

  const patient = user?.associatedPatient || {
    id: user?.id || "patient-main",
    name: user?.patientName || "Connected Loved One",
    relationship: user?.patientRelationship || "Patient",
    age: user?.patientAge || "60",
    phone: user?.patientPhone || "",
    address: user?.patientAddress || "",
    doctor: user?.doctor?.name || "Doctor",
    condition: "Routine Care & Wellness",
    emergencyContact: user?.emergencyContacts?.[0]?.name || "Emergency Contact",
  };

  const takenMeds = (medicines || []).filter((m) => m.status === "taken").length;
  const adherenceRate = medicines.length
    ? Math.round((takenMeds / medicines.length) * 100)
    : 100;

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow">{t?.caregiverPortalEyebrow || "AUTHORIZED CAREGIVER PORTAL"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>{t?.caregiverDashboardTitle || "Caregiver Dashboard"}</h1>
            <RoleBadge role="caregiver" />
          </div>
          <p>
            {t?.caregiverMonitorSub
              ? t.caregiverMonitorSub(patient.name)
              : `Monitor and support ${patient.name}'s medication schedule, appointments, and wellbeing.`}
          </p>
        </div>

        <div className="patient-selector-wrap" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>{t?.activePatientLabel || "Active Patient:"}</span>
          <select className="patient-select" style={{ fontWeight: 600 }}>
            <option>{patient.name} ({patient.relationship})</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <CareStat
          icon={Pill}
          value={`${adherenceRate}%`}
          label={t?.todaysMedAdherence || "Today's Medicine Adherence"}
          badge={t?.takenMedsBadge ? t.takenMedsBadge(takenMeds, medicines.length) : `${takenMeds}/${medicines.length} taken`}
        />
        <CareStat
          icon={CalendarDays}
          value={appointments.length}
          label={t?.scheduledDoctorVisits || "Scheduled Doctor Visits"}
          badge={t?.upcomingBadge || "Upcoming"}
        />
        <CareStat
          icon={Activity}
          value={`${memories.length} logs`}
          label={t?.dailyActivityRoutine || "Daily Activity & Routine"}
          badge={t?.activeTodayBadge || "Active Today"}
        />
        <CareStat
          icon={ShieldCheck}
          value={t?.normalBadge || "Normal"}
          label={t?.healthAlertStatus || "Health & Alert Status"}
          badge={t?.noAlertsBadge || "No Alerts"}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{patient.name} · {t?.medicationRoutine || "Medication Routine"}</h2>
              <p>{t?.adherenceScheduledDoses || "Adherence and scheduled doses"}</p>
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
                    <Check size={12} /> {t?.takenAtPrefix || "Taken at"} {m.takenAt || m.time}
                  </span>
                ) : (
                  <button
                    className="mini-btn"
                    onClick={() => markMedicineTaken(m.id)}
                    title={t?.markAsTaken || "Confirm Taken"}
                  >
                    {t?.markAsTaken || "Confirm Taken"}
                  </button>
                )}
              </div>
            ))}

            {!medicines.length && (
              <div className="empty-state">{t?.noMedicinesYet || "No medications registered for this patient."}</div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>{t?.quickActions || "Care Actions"}</h2>
              <p>{t?.safetyContacts || "Items requiring attention"}</p>
            </div>
            <ShieldCheck size={18} />
          </div>

          <div className="alert-card good">
            <CheckCircle2 size={17} />
            <div>
              <strong>{t?.activeAndProtected || "Adherence Tracking Active"}</strong>
              <span>{t?.securityTip || "Care updates and medication records synced in real-time."}</span>
            </div>
          </div>

          <div className="caregiver-quick-actions" style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {patient.phone ? (
              <a
                href={`tel:${patient.phone}`}
                className="settings-action"
                style={{ padding: "10px 12px" }}
              >
                <Phone size={16} />
                <span>
                  <strong>{t?.callPatient || "Call Patient"} ({patient.name})</strong>
                  <small>{patient.phone}</small>
                </span>
                <b>📞</b>
              </a>
            ) : null}

            <Link
              to="/assistant"
              className="settings-action"
              style={{ padding: "10px 12px" }}
            >
              <Sparkles size={16} />
              <span>
                <strong>{t?.askAiAssistant || "Ask AI Assistant"}</strong>
                <small>{t?.queryLatestLogs || "Query patient records and medication history"}</small>
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
            {patient.relationship} · {t?.age || "Age"}: {patient.age} · {patient.condition}
          </span>
        </div>
        <Link to="/timeline" className="btn btn-outline btn-sm">
          {t?.viewFullTimelineLink || "View Patient Timeline →"}
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
