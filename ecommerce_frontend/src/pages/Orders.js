import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Orders() {
  /** Orders history page. */
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listOrders(token);
      setOrders(Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="card">
      <div className="card-body">
        <div className="section-title">Your Orders</div>
        {loading ? (
          <div className="skeleton mt-3" style={{height: 160}} />
        ) : orders.length === 0 ? (
          <div className="empty">No orders yet.</div>
        ) : (
          <table className="table mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>${Number(o.total || 0).toFixed(2)}</td>
                  <td><span className="badge-pill">{o.status || "created"}</span></td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
