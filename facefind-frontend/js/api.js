// ============================================================
// FACEFIND - API Config & Auth Helpers
// ============================================================

const API = 'http://localhost:5000/api';

let authToken = localStorage.getItem('ff_token') || null;
let currentUser = JSON.parse(localStorage.getItem('ff_user') || 'null');

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` };
}

function saveSession(token, user) {
  authToken = token;
  currentUser = user;
  localStorage.setItem('ff_token', token);
  localStorage.setItem('ff_user', JSON.stringify(user));
}

function clearSession() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('ff_token');
  localStorage.removeItem('ff_user');
}

function isLoggedIn() {
  return !!authToken && !!currentUser;
}
