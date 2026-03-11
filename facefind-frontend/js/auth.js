// FaceFind – Auth
function switchTab(tab) {
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  ['login-error', 'register-error', 'register-success'].forEach(id => document.getElementById(id).classList.remove('show'));
}
function togglePassword(inputId, btnId) {
  const inp = document.getElementById(inputId), btn = document.getElementById(btnId);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');
  if (!email || !pw) { err.textContent = '⚠️ Please fill in all fields.'; err.classList.add('show'); return; }
  err.textContent = '⏳ Signing in…'; err.classList.add('show');
  try {
    const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pw }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    saveSession(data.token, data.user);
    err.classList.remove('show');
    goToDashboard(data.user.name);
  } catch (e) { err.textContent = '⚠️ ' + e.message; err.classList.add('show'); }
}
async function doRegister() {
  const firstName = document.getElementById('reg-firstname').value.trim();
  const lastName = document.getElementById('reg-lastname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pw = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const terms = document.getElementById('reg-terms').checked;
  const err = document.getElementById('register-error'), ok = document.getElementById('register-success');
  err.classList.remove('show'); ok.classList.remove('show');
  if (!firstName || !lastName || !email || !pw) { err.textContent = '⚠️ Please fill in all required fields.'; err.classList.add('show'); return; }
  if (pw.length < 8) { err.textContent = '⚠️ Password must be at least 8 characters.'; err.classList.add('show'); return; }
  if (pw !== confirm) { err.textContent = '⚠️ Passwords do not match.'; err.classList.add('show'); return; }
  if (!terms) { err.textContent = '⚠️ Please accept the Terms of Service.'; err.classList.add('show'); return; }
  err.textContent = '⏳ Creating account…'; err.classList.add('show');
  try {
    const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `${firstName} ${lastName}`, email, password: pw }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    saveSession(data.token, data.user);
    err.classList.remove('show'); ok.textContent = '✅ Account created! Redirecting…'; ok.classList.add('show');
    setTimeout(() => goToDashboard(firstName), 1200);
  } catch (e) { err.textContent = '⚠️ ' + e.message; err.classList.add('show'); }
}
function doSignOut() { clearSession(); goPage('catalog'); }
