import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function ProductDetail() {
  /** Product details page with add to cart. */
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    api.getProduct(id).then(setProduct).catch(e => setErr(e.message || "Failed to load")).finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div className="skeleton" style={{height: 260}} />;
  if (err) return <div className="alert error">{err}</div>;
  if (!product) return <div className="empty">Product not found.</div>;

  return (
    <div className="card" style={{overflow: 'hidden'}}>
      <div className="row wrap" style={{gap: 0}}>
        <img src={product.image || `https://picsum.photos/seed/${product.id}/900/600`} alt={product.name} className="product-image" style={{maxWidth: '50%', flex: '1 1 300px'}} />
        <div className="card-body" style={{flex: '1 1 300px'}}>
          <div className="title">{product.name}</div>
          <div className="row mt-2"><div className="price">${Number(product.price || 0).toFixed(2)}</div>{product.category && <span className="badge-pill">{product.category}</span>}</div>
          <p className="mt-3" style={{color:'#374151'}}>{product.description || 'No description provided.'}</p>

          <div className="row mt-4">
            <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value||1)))} className="input" style={{width: 100}} aria-label="Quantity" />
            <button className="btn primary" onClick={() => add(product.id, qty)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
