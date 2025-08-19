import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form creates a new account. */
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      setOk("Registration successful. You can login now.");
      setTimeout(()=>nav("/login"), 800);
    } catch (e2) {
      setErr(e2.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{maxWidth: 520, margin: "0 auto"}}>
      <div className="card-body">
        <div className="section-title">Create Account</div>
        {err && <div className="alert error mt-3">{err}</div>}
        {ok && <div className="alert success mt-3">{ok}</div>}
        <form className="mt-3" onSubmit={submit}>
          <div className="form-field">
            <label className="label" htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="form-field mt-3">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="form-field mt-3">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div className="mt-4 row">
            <button className="btn primary" type="submit" disabled={submitting}>{submitting ? "Creating..." : "Register"}</button>
            <div className="nav-spacer" />
            <Link to="/login" className="btn">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
