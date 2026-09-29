import { useState } from "react";
import { Bell, Download, Lock, Save, Shield, Trash2, UserRound } from "lucide-react";

export default function Settings() {
  const [tab, setTab] = useState("Profile");
  const [form, setForm] = useState({ name: "John Doe", email: "john@example.com", phone: "+91 98765 43210", dob: "1990-01-10", language: "English", timezone: "(UTC+05:30) India Standard Time" });
  const [prefs, setPrefs] = useState({ voice: true, daily: true, email: false, memory: true });

  const tabs = [
    ["Profile", UserRound],
    ["Notifications", Bell],
    ["Preferences", Shield],
    ["Security", Lock],
  ];

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading"><div className="eyebrow">ACCOUNT</div><h1>Settings</h1><p>Manage your account and preferences.</p></div>
        <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
      </div>

      <div className="settings-layout">
        <div className="settings-nav">
          {tabs.map(([label, Icon]) => <button key={label} className={tab === label ? "active" : ""} onClick={() => setTab(label)}><Icon size={16} />{label}</button>)}
        </div>

        <div className="panel settings-panel">
          {tab === "Profile" && <ProfileTab form={form} setForm={setForm} />}
          {tab === "Notifications" && <PreferenceTab prefs={prefs} setPrefs={setPrefs} />}
          {tab === "Preferences" && <PreferenceTab prefs={prefs} setPrefs={setPrefs} />}
          {tab === "Security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ form, setForm }) {
  return <>
    <div className="settings-section-title"><h2>Profile</h2><p>Your personal information.</p></div>
    <div className="profile-settings-head"><div className="avatar avatar-xl">JD</div><button className="btn btn-outline">Change Photo</button></div>
    <div className="form-grid">
      {Object.entries(form).map(([key, value]) => (
        <label className="form-field" key={key}><span className="field-label">{formatLabel(key)}</span><input value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>
      ))}
    </div>
  </>;
}

function PreferenceTab({ prefs, setPrefs }) {
  return <>
    <div className="settings-section-title"><h2>Preferences</h2><p>Control how MemoMind assists you.</p></div>
    <div className="toggle-list">
      {[
        ["voice", "Voice Assistant", "Enable voice interactions."],
        ["daily", "Daily Reminders", "Receive reminders for your schedule."],
        ["email", "Email Notifications", "Receive important notifications by email."],
        ["memory", "Memory Tracking", "Allow MemoMind to organize your memories."],
      ].map(([key, title, text]) => (
        <div className="toggle-row" key={key}><div><strong>{title}</strong><span>{text}</span></div><button className={`toggle ${prefs[key] ? "on" : ""}`} onClick={() => setPrefs({ ...prefs, [key]: !prefs[key] })}><i /></button></div>
      ))}
    </div>
  </>;
}

function SecurityTab() {
  return <>
    <div className="settings-section-title"><h2>Security & Privacy</h2><p>Manage your data and account security.</p></div>
    <div className="security-actions">
      <button className="settings-action"><Download size={17} /><span><strong>Download My Data</strong><small>Export your MemoMind data.</small></span><b>→</b></button>
      <button className="settings-action danger"><Trash2 size={17} /><span><strong>Delete Account</strong><small>Permanently delete your account and data.</small></span><b>→</b></button>
    </div>
  </>;
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}
