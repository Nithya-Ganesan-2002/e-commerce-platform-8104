import React from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Profile() {
  /** Profile page shows current user info. */
  const { user } = useAuth();

  if (!user) return <div className="empty">No user info.</div>;

  return (
    <div className="card">
      <div className="card-body">
        <div className="section-title">My Account</div>
        <div className="mt-3">
          <div className="form-field">
            <label className="label">Name</label>
            <input className="input" value={user.name || ""} readOnly />
          </div>
          <div className="form-field mt-3">
            <label className="label">Email</label>
            <input className="input" value={user.email || ""} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
