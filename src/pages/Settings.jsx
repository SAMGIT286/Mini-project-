import { useState } from "react";
import {
  Bell,
  Download,
  HeartHandshake,
  Lock,
  Save,
  Shield,
  Trash2,
  UserRound,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import ProfilePhotoUpload from "../components/common/ProfilePhotoUpload";
import CaregiverSection from "../components/settings/CaregiverSection";
import PreferencesSection from "../components/settings/PreferencesSection";
import NotificationsPanel from "../components/notifications/NotificationsPanel";
import RoleBadge from "../components/common/RoleBadge";

export default function Settings() {
  const { user, updateUser, logout, role, isEmergencyContact } = useAuth();
  const { medicines, appointments, memories, notifications, chat } = useApp();
  const [tab, setTab] = useState("Profile");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    age: user?.age || "",
    gender: user?.gender || "Male",
    location: user?.location || "",
    language: user?.language || "English",
    timezone: user?.timezone || "(UTC+05:30) India Standard Time",
  });
  const [saved, setSaved] = useState(false);

  const tabs = [
    ["Profile", UserRound],
    ["Caregiver", HeartHandshake],
    ["Preferences", Shield],
    ["Notifications", Bell],
    ["Security", Lock],
  ];

  const handleProfileSave = (e) => {
    e?.preventDefault();
    updateUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      dob: form.dob,
      age: form.age,
      gender: form.gender,
      location: form.location,
      language: form.language,
      timezone: form.timezone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      user,
      medicines,
      appointments,
      memories,
      notifications,
      chat,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `memomind-data-${user?.id || "user"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to reset this MemoMind account data? All local records for this profile will be cleared."
      )
    ) {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("memomind_"))
        .forEach((k) => localStorage.removeItem(k));
      logout();
    }
  };

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow">ACCOUNT & SETTINGS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>Settings</h1>
            <RoleBadge role={role} />
          </div>
          <p>Manage your profile details, caregiver connection, app preferences, and data privacy.</p>
        </div>

        {tab === "Profile" && (
          <button className="btn btn-primary" onClick={handleProfileSave}>
            <Save size={16} /> {saved ? "Saved!" : "Save Changes"}
          </button>
        )}
      </div>

      <div className="settings-layout">
        <div className="settings-nav">
          {tabs.map(([label, Icon]) => (
            <button
              key={label}
              className={tab === label ? "active" : ""}
              onClick={() => setTab(label)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="panel settings-panel">
          {tab === "Profile" && (
            <>
              <div className="settings-section-title">
                <h2>Personal Profile</h2>
                <p>Update your personal information and profile picture.</p>
              </div>

              <div className="profile-settings-head">
                <ProfilePhotoUpload
                  photoUrl={user?.photoUrl}
                  userName={form.name || user?.name}
                  size="xl"
                  autoSave={true}
                />
              </div>

              <form onSubmit={handleProfileSave} className="stack-form">
                <div className="form-grid">
                  <label className="form-field">
                    <span className="field-label">Full Name</span>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>

                  <label className="form-field">
                    <span className="field-label">Email Address</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </label>

                  <label className="form-field">
                    <span className="field-label">Phone Number</span>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </label>

                  <label className="form-field">
                    <span className="field-label">Date of Birth</span>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    />
                  </label>

                  <label className="form-field">
                    <span className="field-label">Age</span>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                    />
                  </label>

                  <label className="form-field">
                    <span className="field-label">Gender</span>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </label>

                  <label className="form-field">
                    <span className="field-label">Preferred Language</span>
                    <select
                      value={form.language}
                      onChange={(e) => setForm({ ...form, language: e.target.value })}
                    >
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                      <option>Tamil</option>
                      <option>Spanish</option>
                    </select>
                  </label>

                  <label className="form-field">
                    <span className="field-label">Location / City</span>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                    />
                  </label>

                  <label className="form-field full">
                    <span className="field-label">Time Zone</span>
                    <select
                      value={form.timezone}
                      onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    >
                      <option>(UTC+05:30) India Standard Time</option>
                      <option>(UTC+00:00) UTC</option>
                      <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                      <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                    </select>
                  </label>
                </div>

                <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" className="btn btn-primary">
                    <Save size={15} /> {saved ? "Saved!" : "Save Profile"}
                  </button>
                </div>
              </form>
            </>
          )}

          {tab === "Caregiver" && <CaregiverSection />}

          {tab === "Preferences" && <PreferencesSection />}

          {tab === "Notifications" && (
            <div>
              <div className="settings-section-title">
                <h2>Notifications Log</h2>
                <p>View and manage all notifications received on your account.</p>
              </div>
              <NotificationsPanel showTestGenerator={true} />
            </div>
          )}

          {tab === "Security" && (
            <>
              <div className="settings-section-title">
                <h2>Security & Data Privacy</h2>
                <p>Export your personal memory journal or manage your local session.</p>
              </div>

              <div className="security-actions">
                <button className="settings-action" onClick={handleExportData}>
                  <Download size={17} />
                  <span>
                    <strong>Download My Data (JSON)</strong>
                    <small>Export all medicines, appointments, memories and chat logs.</small>
                  </span>
                  <b>→</b>
                </button>

                <button className="settings-action danger" onClick={handleDeleteAccount}>
                  <Trash2 size={17} />
                  <span>
                    <strong>Reset Account / Clear Local Storage</strong>
                    <small>Permanently reset this demo session and clear stored records.</small>
                  </span>
                  <b>→</b>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
