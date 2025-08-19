/**
 * Determine API base URL.
 * Priority:
 * 1) REACT_APP_API_BASE (explicit)
 * 2) Same host as current page but with backend port 3001 (preserves protocol/host)
 * 3) Fallback to http://localhost:3001
 */
function resolveApiBase() {
  const envBase = process.env.REACT_APP_API_BASE && process.env.REACT_APP_API_BASE.trim();
  if (envBase) return envBase.replace(/\/+$/, "");

  // Try to derive from current location, keeping protocol and host but using backend port 3001.
  try {
    if (typeof window !== "undefined" && window.location && window.location.origin) {
      const url = new URL(window.location.origin);
      // If already on port 3001, keep as is; otherwise set to 3001.
      const port = "3001";
      url.port = port;

      const derived = url.toString().replace(/\/+$/, "");
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`[api] Using derived API base from current origin on port ${port}: ${derived}`);
      }
      return derived;
    }
  } catch {
    // ignore and fall back
  }

  return "http://localhost:3001";
}

const API_BASE = resolveApiBase();

// Lightweight API helper with JSON defaults and auth token support
async function http(path, { method = "GET", body, token, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
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

  let res;
  try {
    res = await fetch(url, init);
  } catch (networkErr) {
    const msg = networkErr && networkErr.message ? networkErr.message : "Network request failed";
    const err = new Error(`Failed to fetch ${url}: ${msg}. Check API base URL and CORS.`);
    err.cause = networkErr;
    throw err;
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || "Request failed";
    const err = new Error(`${message} (${res.status})`);
    err.status = res.status;
    err.payload = data;
    err.url = url;
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
