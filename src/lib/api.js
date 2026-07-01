// Set VITE_API_BASE_URL to the full URL of the Node API (e.g.
// https://your-node-app.hostingersite.com/api) when the frontend and API are
// deployed to different domains, as they are on Hostinger's static
// build/deploy product. Falls back to a same-origin relative path for local
// dev via the Vite proxy (see vite.config.js).
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const TOKEN_KEY = 'gw_admin_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function submitInquiry(payload) {
  return request('/inquiries', { method: 'POST', body: JSON.stringify(payload) });
}

export function fetchInquiries() {
  return request('/inquiries');
}

export async function searchCertificate(regNo) {
  return request(`/certificates/${encodeURIComponent(regNo)}`);
}

export function fetchCourses() {
  return request('/courses');
}

export function addCourse(title) {
  return request('/courses', { method: 'POST', body: JSON.stringify({ title }) });
}

export function updateCourse(id, title) {
  return request(`/courses/${id}`, { method: 'PATCH', body: JSON.stringify({ title }) });
}

export function deleteCourse(id) {
  return request(`/courses/${id}`, { method: 'DELETE' });
}

export async function checkSession() {
  if (!getToken()) return { authenticated: false };
  try {
    return await request('/auth/session');
  } catch {
    setToken(null);
    return { authenticated: false };
  }
}

export async function login(password) {
  const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ password }) });
  setToken(data.token);
  return { success: true };
}

export function logout() {
  setToken(null);
  return Promise.resolve({ success: true });
}
