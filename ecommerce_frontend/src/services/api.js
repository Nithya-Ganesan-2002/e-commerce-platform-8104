const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

// Lightweight API helper with JSON defaults and auth token support
async function http(path, { method = "GET", body, token, headers = {} } = {}) {
  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }
  if (token) {
    init.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, init);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText;
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Auth endpoints */
  register: (payload) => http("/auth/register", { method: "POST", body: payload }),
  login: (payload) => http("/auth/login", { method: "POST", body: payload }),
  me: (token) => http("/auth/me", { token }),

  /** Products */
  listProducts: ({ q, category, page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (page) params.set("page", String(page));
    if (pageSize) params.set("pageSize", String(pageSize));
    const query = params.toString() ? `?${params.toString()}` : "";
    return http(`/products${query}`);
  },
  getProduct: (id) => http(`/products/${id}`),

  /** Cart */
  getCart: (token) => http("/cart", { token }),
  addToCart: (token, { productId, quantity = 1 }) =>
    http("/cart", { method: "POST", body: { productId, quantity }, token }),
  updateCartItem: (token, { productId, quantity }) =>
    http("/cart", { method: "PUT", body: { productId, quantity }, token }),
  removeFromCart: (token, productId) =>
    http(`/cart/${productId}`, { method: "DELETE", token }),
  clearCart: (token) => http("/cart/clear", { method: "POST", token }),

  /** Checkout & Orders */
  checkout: (token, payload) => http("/checkout", { method: "POST", body: payload, token }),
  listOrders: (token) => http("/orders", { token }),
  getOrder: (token, id) => http(`/orders/${id}`, { token }),
};
