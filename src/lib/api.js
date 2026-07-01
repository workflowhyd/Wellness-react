// Set VITE_API_BASE_URL to the full URL of your PHP backend (e.g.
// https://your-classic-hosting-domain.com/hostinger-api) when the frontend
// and API are deployed to different domains, as they are on Hostinger's
// static build/deploy product. Falls back to a same-origin relative path
// for local dev via the Vite proxy.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/hostinger-api';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    // 'include' sends the admin session cookie even on cross-origin requests,
    // which is required once the frontend and API live on different domains.
    credentials: 'include',
    ...options,
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
  return request('/submit-inquiry.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function fetchInquiries() {
  return request('/get-inquiries.php');
}

export function searchCertificate(regNo) {
  return request(`/search-certificate.php?reg_no=${encodeURIComponent(regNo)}`);
}

export function fetchCourses() {
  return request('/courses.php');
}

export function addCourse(title) {
  return request('/courses.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export function updateCourse(id, title) {
  return request(`/courses.php?id=${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}

export function deleteCourse(id) {
  return request(`/courses.php?id=${id}`, { method: 'DELETE' });
}

export function checkSession() {
  return request('/session.php');
}

export function login(password) {
  return request('/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
}

export function logout() {
  return request('/logout.php', { method: 'POST' });
}
