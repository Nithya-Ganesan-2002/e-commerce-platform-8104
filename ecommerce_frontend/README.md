# KaviaShop React Frontend

Modern, responsive e-commerce UI for authentication, product catalog, cart, checkout, and orders.

## Features

- Authentication: Register, Login, Logout, Profile
- Product catalog: Search, Grid/List view, Product details
- Cart: Add/Update/Remove items, totals
- Checkout: Shipping + payment form, order creation
- Orders: Order history page
- Routing via react-router v6; Context-based state for auth and cart
- Light, modern theme with responsive layout

## Getting Started

1) Install dependencies:
   npm install

2) Configure environment (optional, defaults to localhost:3001):
   cp .env.example .env

3) Start development server:
   npm start

App runs at http://localhost:3000

## Environment Variables

See .env.example

- REACT_APP_API_BASE: Base URL of the backend REST API (default http://localhost:3001)

## Project Structure

- src/services/api.js — API wrapper for backend endpoints
- src/context/AuthContext.js — Auth state (token, user, login/register/logout)
- src/context/CartContext.js — Cart state synced to backend when logged in
- src/pages/* — UI pages (Home, Products, ProductDetail, Cart, Checkout, Orders, Profile, Login, Register)
- src/App.js — Router and layout (Header, Footer)
- src/App.css — Theme and components styling

## Backend Integration

This app communicates with ecommerce_backend via REST on REACT_APP_API_BASE (defaults to http://localhost:3001) and expects:
- Auth: POST /auth/login, /auth/register; GET /auth/me (JWT bearer)
- Products: GET /products, GET /products/:id
- Cart: GET /cart, POST /cart, PUT /cart, DELETE /cart/:productId, POST /cart/clear
- Checkout & Orders: POST /checkout, GET /orders

Ensure CORS is enabled on the backend.

## Notes

- Tokens stored in localStorage under "auth_token"
- Protected routes: /checkout, /orders, /profile
- Minimal dependencies for performance

## Scripts

- npm start — dev server
- npm run build — production build
- npm test — run tests
