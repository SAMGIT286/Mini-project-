import { useState } from "react";
import { Eye, EyeOff, Leaf, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
    navigate("/onboarding/user-type");
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-leaf auth-leaf-1">✦</div>
        <div className="auth-leaf auth-leaf-2">✦</div>
        <div className="auth-quote">
          <span>“</span>
          <h2>Remember the moments that matter.</h2>
          <p>A personal memory and care assistant designed around your life.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="logo-center">
            <div className="logo-circle"><Leaf size={30} /></div>
            <h1>MemoMind</h1>
            <p>Your memory, always with you.</p>
          </div>

          <form onSubmit={submit} className="stack-form">
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
                <button type="button" className="input-action" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <div className="form-row-between">
              <span />
              <button type="button" className="text-btn">Forgot password?</button>
            </div>

            <button className="btn btn-primary btn-full" type="submit">Sign In</button>
          </form>

          <div className="divider"><span>or</span></div>
          <button className="btn btn-google btn-full">G&nbsp;&nbsp; Continue with Google</button>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
