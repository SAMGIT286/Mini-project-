import { useState } from "react";
import {
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  UserRound,
  BriefcaseBusiness,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, DEMO_PROFILES } from "../context/AuthContext";

const rolesList = [
  {
    id: "elderly",
    title: "Elderly Person",
    subtitle: "Personalized memory assistant & reminders",
    icon: UserRound,
    demoEmail: DEMO_PROFILES.elderly.email,
  },
  {
    id: "young_professional",
    title: "Young Professional",
    subtitle: "Daily organization, routine & wellness",
    icon: BriefcaseBusiness,
    demoEmail: DEMO_PROFILES.young_professional.email,
  },
  {
    id: "caregiver",
    title: "Caregiver",
    subtitle: "Monitor & support patient health",
    icon: HeartHandshake,
    demoEmail: DEMO_PROFILES.caregiver.email,
  },
  {
    id: "emergency_contact",
    title: "Emergency Contact",
    subtitle: "Read-only patient timeline & alerts",
    icon: ShieldAlert,
    demoEmail: DEMO_PROFILES.emergency_contact.email,
  },
];

export default function Login() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("elderly");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: DEMO_PROFILES.elderly.email,
    password: "password123",
  });
  const [error, setError] = useState("");

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    const demo = DEMO_PROFILES[roleId];
    if (demo) {
      setForm((prev) => ({
        ...prev,
        email: demo.email,
      }));
    }
  };

  const handleDemoQuickLogin = (roleId) => {
    loginAsDemo(roleId);
    if (roleId === "caregiver") {
      navigate("/caregiver", { replace: true });
    } else if (roleId === "emergency_contact") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      return setError("Please enter both email and password.");
    }

    const success = login(form.email, form.password, selectedRole);
    if (!success) {
      return setError("Login failed. Please check credentials.");
    }

    const saved = localStorage.getItem(`memomind_account_${form.email.toLowerCase()}`);
    const account = saved ? JSON.parse(saved) : null;
    
    // Check role destination
    if (selectedRole === "caregiver") {
      navigate("/caregiver", { replace: true });
    } else {
      navigate(account?.user?.setupComplete ? "/dashboard" : "/onboarding/user-type", {
        replace: true,
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-leaf auth-leaf-1">✦</div>
        <div className="auth-leaf auth-leaf-2">✦</div>
        <div className="auth-quote">
          <span>“</span>
          <h2>Remember the moments that matter.</h2>
          <p>
            A personal memory, daily routine, and health care companion tailored for seniors, young professionals, caregivers, and family emergency contacts.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card" style={{ width: "min(460px, 100%)" }}>
          <div className="logo-center">
            <div className="logo-circle">
              <Leaf size={28} />
            </div>
            <h1>MemoMind</h1>
            <p>Select your role to sign in to your dashboard</p>
          </div>

          <div className="login-role-selector-section">
            <div className="field-label" style={{ marginBottom: "8px" }}>
              Select Login Role:
            </div>
            <div className="login-role-grid">
              {rolesList.map(({ id, title, icon: Icon }) => {
                const isSelected = selectedRole === id;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`login-role-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => handleRoleChange(id)}
                  >
                    <Icon size={15} />
                    <span>{title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={submit} className="stack-form" style={{ marginTop: "14px" }}>
            <label className="form-field">
              <span className="field-label">Email address</span>
              <div className="input-with-icon">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </label>

            <label className="form-field">
              <span className="field-label">Password</span>
              <div className="input-with-icon">
                <LockKeyhole size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && <div className="error-note">{error}</div>}

            <button className="btn btn-primary btn-full" type="submit">
              <span>Sign In as {rolesList.find((r) => r.id === selectedRole)?.title}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <div className="divider">
            <span>or instant 1-click demo</span>
          </div>

          <div className="demo-quick-logins">
            <button
              type="button"
              className="demo-btn demo-btn-elderly"
              onClick={() => handleDemoQuickLogin("elderly")}
            >
              👴 Demo Elderly
            </button>
            <button
              type="button"
              className="demo-btn demo-btn-yp"
              onClick={() => handleDemoQuickLogin("young_professional")}
            >
              💼 Demo Pro
            </button>
            <button
              type="button"
              className="demo-btn demo-btn-caregiver"
              onClick={() => handleDemoQuickLogin("caregiver")}
            >
              🤝 Demo Caregiver
            </button>
            <button
              type="button"
              className="demo-btn demo-btn-emergency"
              onClick={() => handleDemoQuickLogin("emergency_contact")}
            >
              🚨 Demo Contact
            </button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create new account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
