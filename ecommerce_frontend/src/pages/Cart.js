import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function Cart() {
  /** Cart page showing items and totals. */
  const { user } = useAuth();
  const { cart, total, update, remove, clear } = useCart();
  const nav = useNavigate();

  const items = cart?.items || [];

  return (
    <div className="card">
      <div className="card-body">
        <div className="row wrap">
          <div className="section-title">Shopping Cart</div>
          <div className="nav-spacer" />
          {items.length > 0 && <button className="btn" onClick={clear}>Clear</button>}
        </div>

        {items.length === 0 ? (
          <div className="empty">Your cart is empty. <Link to="/products" className="nav-link">Browse products</Link></div>
        ) : (
          <>
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th style={{width: 140}}>Quantity</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.productId}>
                    <td>{it.name || `#${it.productId}`}</td>
                    <td>${Number(it.price || 0).toFixed(2)}</td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={e=>update(it.productId, Math.max(1, Number(e.target.value||1)))}
                        aria-label={`Quantity for ${it.name || it.productId}`}
                      />
                    </td>
                    <td>${Number((it.price || 0) * (it.quantity || 0)).toFixed(2)}</td>
                    <td><button className="btn" onClick={()=>remove(it.productId)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="row mt-4" style={{justifyContent:'flex-end'}}>
              <div className="card" style={{minWidth: 280}}>
                <div className="card-body">
                  <div className="row"><strong>Total</strong><div className="nav-spacer" /><div className="price">${Number(total).toFixed(2)}</div></div>
                  <div className="mt-3 row">
                    {user ? (
                      <button className="btn primary" onClick={()=>nav("/checkout")}>Proceed to Checkout</button>
                    ) : (
                      <Link to="/login" className="btn primary">Login to Checkout</Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
