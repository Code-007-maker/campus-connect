// src/lib/api.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("cc_token");
}

async function request(path, { method = "GET", body = null, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  const h = { ...headers };

  if (token) h["Authorization"] = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) {
    h["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    method,
    headers: h,
    body,
  });

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { raw: text }; }

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export default {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
  API_BASE,
};
