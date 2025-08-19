import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function ProductCard({ product, onAdd }) {
  /** Card UI for product listing. */
  return (
    <div className="card">
      <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}>
        <img className="product-image" src={product.image || `https://picsum.photos/seed/${product.id}/600/400`} alt={product.name} />
      </Link>
      <div className="card-body">
        <div className="title">{product.name}</div>
        <div className="row">
          <div className="price">${Number(product.price || 0).toFixed(2)}</div>
          {product.category && <span className="badge-pill">{product.category}</span>}
        </div>
        <div className="mt-3 row">
          <Link to={`/products/${product.id}`} className="btn">Details</Link>
          <button className="btn primary" onClick={() => onAdd?.(product)} aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
