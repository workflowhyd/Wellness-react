// Set VITE_CONVEX_URL to this project's Convex deployment URL (e.g.
// https://happy-animal-123.convex.cloud). `npx convex dev` writes this to a
// local .env.local automatically for local development; for the Hostinger
// build it needs to be set explicitly to the production deployment URL.
import { ConvexHttpClient } from 'convex/browser';
import { ConvexError } from 'convex/values';
import { api } from '../../convex/_generated/api';

const client = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);

const TOKEN_KEY = 'gw_admin_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function call(fn) {
  try {
    return await fn();
  } catch (err) {
    throw new Error(err instanceof ConvexError ? err.data : err.message);
  }
}

export function submitInquiry(payload) {
  const { firstName, lastName = '', phone, email = '', course = '', message = '' } = payload || {};
  return call(() => client.mutation(api.inquiries.submit, { firstName, lastName, phone, email, course, message }));
}

export function fetchInquiries() {
  return call(() => client.query(api.inquiries.list, { token: getToken() }));
}

export function updateInquiryStatus(id, status) {
  return call(() => client.mutation(api.inquiries.setStatus, { token: getToken(), id, status }));
}

export async function searchCertificate(regNo) {
  return call(() => client.query(api.certificates.getByRegistrationNo, { registrationNo: regNo }));
}

export function fetchStudents() {
  return call(() => client.query(api.certificates.list, { token: getToken() }));
}

export function addStudent(student) {
  return call(() => client.mutation(api.certificates.add, { token: getToken(), ...student }));
}

export function updateStudent(id, student) {
  return call(() => client.mutation(api.certificates.update, { token: getToken(), id, ...student }));
}

export function deleteStudent(id) {
  return call(() => client.mutation(api.certificates.remove, { token: getToken(), id }));
}

export function fetchCourses() {
  return call(() => client.query(api.courses.list, { token: getToken() }));
}

export function addCourse(title) {
  return call(() => client.mutation(api.courses.add, { token: getToken(), title }));
}

export function updateCourse(id, title) {
  return call(() => client.mutation(api.courses.update, { token: getToken(), id, title }));
}

export function deleteCourse(id) {
  return call(() => client.mutation(api.courses.remove, { token: getToken(), id }));
}

export async function checkSession() {
  if (!getToken()) return { authenticated: false };
  try {
    return await call(() => client.query(api.auth.checkSession, { token: getToken() }));
  } catch {
    setToken(null);
    return { authenticated: false };
  }
}

export async function login(password) {
  const data = await call(() => client.mutation(api.auth.login, { password }));
  setToken(data.token);
  return { success: true };
}

export function logout() {
  setToken(null);
  return Promise.resolve({ success: true });
}

export function changePassword(oldPassword, newPassword) {
  return call(() =>
    client.mutation(api.auth.changePassword, { token: getToken(), oldPassword, newPassword })
  );
}
