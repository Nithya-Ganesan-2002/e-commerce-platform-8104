import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

// PUBLIC_INTERFACE
export default function Products() {
  /** Product catalog list with search. */
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { add } = useCart();

  const load = async (query) => {
    setLoading(true);
    try {
      const data = await api.listProducts({ q: query });
      const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      setProducts(items);
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(""); }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  return (
    <>
      <div className="hero row wrap">
        <div>
          <h1>Shop the latest</h1>
          <p>Discover curated products across categories.</p>
        </div>
        <div className="nav-spacer" />
        <form onSubmit={onSearch} className="search" role="search" aria-label="Product search">
          <input className="input" placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn primary" type="submit">Search</button>
        </form>
      </div>

      <div className="mt-4 grid">
        {loading ? (
          Array.from({length: 8}).map((_,i)=><div key={i} className="card"><div className="skeleton" /><div className="card-body"><div className="skeleton" style={{height:16}} /></div></div>)
        ) : products.length === 0 ? (
          <div className="empty card" style={{gridColumn: '1 / -1'}}>No products found.</div>
        ) : (
          products.map(p => (
            <div key={p.id} className="card">
              <img src={p.image || `https://picsum.photos/seed/${p.id}/600/400`} alt={p.name} className="product-image" />
              <div className="card-body">
                <div className="title">{p.name}</div>
                <div className="row">
                  <div className="price">${Number(p.price || 0).toFixed(2)}</div>
                  {p.category && <span className="badge-pill">{p.category}</span>}
                </div>
                <div className="mt-3 row">
                  <a className="btn" href={`/products/${p.id}`}>Details</a>
                  <button className="btn primary" onClick={() => add(p.id, 1)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
