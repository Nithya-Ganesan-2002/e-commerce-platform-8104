import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form. */
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from) || "/";

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setSubmitting(true);
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (e2) {
      setErr(e2.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{maxWidth: 480, margin: "0 auto"}}>
      <div className="card-body">
        <div className="section-title">Login</div>
        {err && <div className="alert error mt-3">{err}</div>}
        <form className="mt-3" onSubmit={submit}>
          <div className="form-field">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="form-field mt-3">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div className="mt-4 row">
            <button className="btn primary" type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Login"}</button>
            <div className="nav-spacer" />
            <Link to="/register" className="btn">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
