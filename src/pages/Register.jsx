import { useState } from "react";
import { Leaf, UserRound, BriefcaseBusiness, HeartHandshake, ShieldAlert, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roles = [
  { id: "elderly", title: "Elderly Person", icon: UserRound },
  { id: "young_professional", title: "Young Professional", icon: BriefcaseBusiness },
  { id: "caregiver", title: "Caregiver", icon: HeartHandshake },
  { id: "emergency_contact", title: "Emergency Contact", icon: ShieldAlert },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("elderly");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Please enter your name.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: role,
      userType: role,
    });

    navigate("/onboarding/personal-details", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-quote">
          <span>✦</span>
          <h2>Build your personal memory space.</h2>
          <p>Set up reminders, memories, trusted contacts, and your AI assistant all in one place.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card" style={{ width: "min(460px, 100%)" }}>
          <div className="logo-center">
            <div className="logo-circle">
              <Leaf size={28} />
            </div>
            <h1>Create your account</h1>
            <p>Select your account type and start your setup.</p>
          </div>

          <div className="field-label" style={{ marginBottom: "8px" }}>
            I am signing up as:
          </div>
          <div className="login-role-grid" style={{ marginBottom: "14px" }}>
            {roles.map(({ id, title, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`login-role-chip ${role === id ? "selected" : ""}`}
                onClick={() => setRole(id)}
              >
                <Icon size={14} />
                <span>{title}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="stack-form">
            <label className="form-field">
              <span className="field-label">Full name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </label>

            <label className="form-field">
              <span className="field-label">Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </label>

            <div className="form-grid">
              <label className="form-field">
                <span className="field-label">Password</span>
                <input
                  type="password"
                  minLength="6"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 chars"
                  required
                />
              </label>

              <label className="form-field">
                <span className="field-label">Confirm password</span>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Re-type password"
                  required
                />
              </label>
            </div>

            {error && <div className="error-note">{error}</div>}

            <button className="btn btn-primary btn-full" type="submit">
              <span>Continue Setup</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
