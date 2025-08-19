import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Home() {
  /** Landing hero with CTA to browse products. */
  return (
    <>
      <div className="hero">
        <div>
          <h1>Welcome to KaviaShop</h1>
          <p>Modern, fast, and delightful shopping experience.</p>
        </div>
      </div>
      <div className="mt-4 row">
        <Link to="/products" className="btn primary">Browse Products</Link>
        <a href="#learn" className="btn">Learn more</a>
      </div>
    </>
  );
}
