// ============================================================
//  FaceFind – Navigation
// ============================================================

function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);

  // Hide nav on auth page
  if (id === 'login') {
    document.body.classList.add('auth-page');
  } else {
    document.body.classList.remove('auth-page');
  }

  const navActions = document.getElementById('nav-actions');
  if (id === 'photographer-home') {
    const name = currentUser ? currentUser.name : 'User';
    navActions.innerHTML = `
      <span style="font-size:13px;color:var(--muted)">${name}</span>
      <div class="avatar" onclick="doSignOut()" title="Sign out">${name[0].toUpperCase()}</div>
    `;
  } else {
    navActions.innerHTML = `
      <button class="btn-ghost btn-sm" style="padding:9px 20px;border-radius:10px;" onclick="goPage('login')">Photographer Login</button>
      <button class="btn-primary btn-sm" style="padding:9px 20px;border-radius:10px;" onclick="switchTab('register');goPage('login')">Get Started</button>
    `;
  }

  if (id === 'catalog')           renderCatalog();
  if (id === 'photographer-home') renderPhEvents();
}

function goToDashboard(name) {
  const greetEl = document.querySelector('#photographer-home .ph-welcome h1');
  if (greetEl) greetEl.innerHTML = `Welcome back, <span class="gradient-text">${name}</span> 👋`;
  const avatarEl = document.getElementById('nav-avatar');
  if (avatarEl) avatarEl.textContent = name[0].toUpperCase();
  goPage('photographer-home');
}

// ---- Init on page load ----
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  if (authToken && currentUser) {
    goToDashboard(currentUser.name);
  } else {
    renderPhEvents();
  }
});
