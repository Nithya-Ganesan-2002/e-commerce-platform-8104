# Environment and Configuration

- REACT_APP_API_BASE: Base URL for the backend REST API.
  Example:
  REACT_APP_API_BASE=http://localhost:3001

Place variables in a `.env` file at project root (same directory as package.json). CRA will expose variables prefixed with REACT_APP_ to the frontend at build time.

If deploying, map REACT_APP_API_BASE to your backend URL.
