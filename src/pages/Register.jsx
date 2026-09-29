import { useState } from "react";
import { Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = (e) => {
    e.preventDefault();
    register(form);
    navigate("/onboarding/user-type");
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-quote">
          <span>✦</span>
          <h2>Build your personal memory space.</h2>
          <p>Set up reminders, memories, people and your AI assistant in one place.</p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <div className="logo-center">
            <div className="logo-circle"><Leaf size={30} /></div>
            <h1>Create your account</h1>
            <p>Start your MemoMind setup.</p>
          </div>
          <form onSubmit={submit} className="stack-form">
            <label className="form-field">
              <span className="field-label">Full name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="form-field">
              <span className="field-label">Email</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label className="form-field">
              <span className="field-label">Password</span>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </label>
            <button className="btn btn-primary btn-full" type="submit">Create account</button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
