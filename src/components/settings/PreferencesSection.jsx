import { useState } from "react";
import { Bell, Volume2, Mic, Sparkles, ShieldAlert, Check, Moon, Sun, Type } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PreferencesSection() {
  const { user, updateUser } = useAuth();
  const [success, setSuccess] = useState("");

  const currentPrefs = user?.preferences || {
    notifications: true,
    medicineReminders: true,
    appointmentReminders: true,
    dailySummary: true,
    voiceAssistant: true,
    voiceAutoSpeak: true,
    memoryTracking: true,
    emergencyAlerts: true,
    fontSize: "normal",
    theme: "light",
  };

  const handleToggle = (key) => {
    const updated = {
      ...currentPrefs,
      [key]: !currentPrefs[key],
    };
    updateUser({ preferences: updated });
    setSuccess("Preference saved.");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleSelectChange = (key, value) => {
    const updated = {
      ...currentPrefs,
      [key]: value,
    };
    updateUser({ preferences: updated });
    setSuccess("Setting updated.");
    setTimeout(() => setSuccess(""), 2000);
  };

  const preferenceItems = [
    {
      key: "notifications",
      title: "Master Notifications",
      description: "Allow MemoMind to display alerts and reminder banners.",
      icon: Bell,
    },
    {
      key: "medicineReminders",
      title: "Medication Reminders",
      description: "Receive timely audio and visual prompts when it is time to take medicines.",
      icon: Bell,
    },
    {
      key: "appointmentReminders",
      title: "Doctor & Schedule Reminders",
      description: "Notify before upcoming doctor visits and scheduled activities.",
      icon: Bell,
    },
    {
      key: "dailySummary",
      title: "Daily Morning Briefing",
      description: "Display today's schedule and tasks prominently on the dashboard.",
      icon: Sparkles,
    },
    {
      key: "voiceAssistant",
      title: "Voice Assistant Dictation",
      description: "Enable speech-to-text mic for speaking directly to the AI Assistant.",
      icon: Mic,
    },
    {
      key: "voiceAutoSpeak",
      title: "Read AI Responses Aloud",
      description: "Automatically speak the AI Assistant's answer using text-to-speech.",
      icon: Volume2,
    },
    {
      key: "memoryTracking",
      title: "Automatic Memory Journaling",
      description: "Record medication events and check-ins onto your daily memory timeline.",
      icon: Sparkles,
    },
    {
      key: "emergencyAlerts",
      title: "Emergency Alert Broadcasting",
      description: "Instantly notify emergency contacts if an SOS or missed health event is triggered.",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="preferences-section-container">
      <div className="settings-section-title">
        <h2>App Preferences & Accessibility</h2>
        <p>Personalize how MemoMind reminds, speaks, and assists you. All changes are saved automatically.</p>
      </div>

      {success && (
        <div className="photo-upload-message success" style={{ marginBottom: "15px" }}>
          <Check size={14} />
          <span>{success}</span>
        </div>
      )}

      <div className="toggle-list">
        {preferenceItems.map(({ key, title, description, icon: Icon }) => {
          const isChecked = !!currentPrefs[key];
          return (
            <div className="toggle-row" key={key}>
              <div className="toggle-copy">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icon size={14} style={{ color: "var(--green-700)" }} />
                  <strong>{title}</strong>
                </div>
                <span>{description}</span>
              </div>
              <button
                type="button"
                className={`toggle ${isChecked ? "on" : ""}`}
                onClick={() => handleToggle(key)}
                aria-pressed={isChecked}
                title={`Toggle ${title}`}
              >
                <i />
              </button>
            </div>
          );
        })}
      </div>

      <div className="accessibility-box mt-20">
        <h3>Display & Readability Options</h3>
        <div className="form-grid" style={{ marginTop: "12px" }}>
          <label className="form-field">
            <span className="field-label">Font Size / Comfort</span>
            <select
              value={currentPrefs.fontSize || "normal"}
              onChange={(e) => handleSelectChange("fontSize", e.target.value)}
            >
              <option value="normal">Standard (Default)</option>
              <option value="large">Large (High Legibility)</option>
              <option value="xlarge">Extra Large (Maximum Readability)</option>
            </select>
          </label>

          <label className="form-field">
            <span className="field-label">Theme / Color Mode</span>
            <select
              value={currentPrefs.theme || "light"}
              onChange={(e) => handleSelectChange("theme", e.target.value)}
            >
              <option value="light">Fresh Emerald (Default)</option>
              <option value="contrast">High Contrast Green</option>
              <option value="soft">Soft Sage Warm</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
