import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

// PUBLIC_INTERFACE
export default function Checkout() {
  /** Checkout flow - collects shipping and payment data, calls backend, shows result. */
  const { token } = useAuth();
  const { total, refresh } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentToken, setPaymentToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const res = await api.checkout(token, { shippingAddress, paymentMethod, paymentToken });
      setSuccess("Order placed successfully!");
      await refresh();
      setTimeout(()=>nav("/orders"), 1000);
      return res;
    } catch (e2) {
      setError(e2.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="section-title">Checkout</div>
        <div className="mt-2" style={{color:'#6b7280'}}>Order total: <strong>${Number(total).toFixed(2)}</strong></div>

        {error && <div className="alert error mt-3">{error}</div>}
        {success && <div className="alert success mt-3">{success}</div>}

        <form className="mt-4" onSubmit={submit}>
          <div className="form-field">
            <label className="label" htmlFor="ship">Shipping Address</label>
            <textarea id="ship" className="textarea" rows={3} value={shippingAddress} onChange={e=>setShippingAddress(e.target.value)} required />
          </div>

          <div className="row mt-3">
            <div className="form-field" style={{flex:1}}>
              <label className="label" htmlFor="method">Payment Method</label>
              <select id="method" className="select" value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
                <option value="card">Card</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            <div className="form-field" style={{flex:1}}>
              <label className="label" htmlFor="token">Payment Token</label>
              <input id="token" className="input" placeholder="tok_..." value={paymentToken} onChange={e=>setPaymentToken(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 row">
            <button className="btn" type="button" onClick={()=>nav("/cart")}>Back to Cart</button>
            <div className="nav-spacer" />
            <button className="btn primary" type="submit" disabled={submitting}>{submitting ? "Processing..." : "Place Order"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
