// FaceFind – Events
const EVENTS = [
  { id:1,  name:'Summer Wedding 2026',       date:'Jun 14, 2026', location:'Rose Garden Venue',  photos:892,  processed:892,  searches:312,  type:'wedding',    status:'active', emoji:'💍', color:'#4c1d95' },
  { id:2,  name:'TechConf Annual 2026',       date:'Mar 22, 2026', location:'Convention Center',  photos:1204, processed:1204, searches:680,  type:'conference', status:'live',   emoji:'🏢', color:'#1e3a5f' },
  { id:3,  name:'Birthday Bash — Amy',        date:'Mar 8, 2026',  location:'Rooftop Lounge',     photos:200,  processed:84,   searches:42,   type:'party',      status:'active', emoji:'🎉', color:'#3d1a5f' },
  { id:4,  name:'Marathon 2026',              date:'Feb 18, 2026', location:'Downtown Circuit',   photos:3210, processed:3210, searches:2100, type:'sport',      status:'past',   emoji:'🏃', color:'#1a2e4f' },
  { id:5,  name:'New Year Gala',              date:'Jan 1, 2026',  location:'Grand Ballroom',     photos:744,  processed:744,  searches:220,  type:'party',      status:'past',   emoji:'🎆', color:'#2a1a4e' },
  { id:6,  name:'Graduation Ceremony',        date:'Dec 20, 2025', location:'University Hall',    photos:1560, processed:1560, searches:890,  type:'conference', status:'past',   emoji:'🎓', color:'#1f3d2a' },
  { id:7,  name:'Annual Charity Dinner',      date:'Nov 30, 2025', location:'The Grand Hotel',    photos:330,  processed:330,  searches:140,  type:'party',      status:'past',   emoji:'🍽️', color:'#3d2a1a' },
  { id:8,  name:'Autumn Wedding — Kim & Lee', date:'Oct 12, 2025', location:'Forest Estate',      photos:980,  processed:980,  searches:560,  type:'wedding',    status:'past',   emoji:'🍂', color:'#3d2010' },
  { id:9,  name:'Corporate Summit',           date:'Sep 5, 2025',  location:'Tech Campus',        photos:420,  processed:420,  searches:210,  type:'conference', status:'past',   emoji:'💼', color:'#1a2e4f' },
  { id:10, name:'Summer Solstice Party',      date:'Jun 21, 2025', location:'Beachfront Arena',   photos:670,  processed:670,  searches:430,  type:'party',      status:'past',   emoji:'☀️', color:'#3d2a00' },
  { id:11, name:'Engagement Celebration',     date:'May 3, 2025',  location:'Garden Terrace',     photos:288,  processed:288,  searches:156,  type:'wedding',    status:'past',   emoji:'💖', color:'#4c1d4c' },
  { id:12, name:'Spring Conference',          date:'Apr 14, 2025', location:'Innovation Hub',     photos:502,  processed:502,  searches:310,  type:'conference', status:'past',   emoji:'🌸', color:'#1a3d1a' },
];
let currentFilter = 'all', currentSearch = '';
function statusBadge(status) {
  if (status === 'live')   return `<span class="event-badge badge-live"><span class="live-dot" style="margin-right:5px;"></span>Live</span>`;
  if (status === 'active') return `<span class="event-badge badge-active">Active</span>`;
  return `<span class="event-badge badge-past">Past</span>`;
}
function renderCatalog() {
  const q = currentSearch.toLowerCase();
  const filtered = EVENTS.filter(e => {
    const matchFilter = currentFilter === 'all' || e.status === currentFilter || e.type === currentFilter;
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
  document.getElementById('event-count').textContent = `${filtered.length} events`;
  const grid = document.getElementById('catalog-grid');
  if (filtered.length === 0) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">No events match your search.</div>`; return; }
  grid.innerHTML = filtered.map(e => `
    <div class="event-card" onclick="goPage('login')">
      <div class="event-thumb" style="background:linear-gradient(135deg,${e.color} 0%,#0f0f1a 100%);">
        <div class="event-thumb-bg">${e.emoji}</div>${statusBadge(e.status)}
      </div>
      <div class="event-info">
        <div class="event-name">${e.name}</div>
        <div class="event-meta"><span>📅 ${e.date}</span><span>📍 ${e.location}</span></div>
        <div class="event-stats">
          <span class="stat-pill">📸 ${e.photos.toLocaleString()} photos</span>
          <span class="stat-pill">🤳 ${e.searches.toLocaleString()} searches</span>
        </div>
        <div class="event-actions">
          <button class="btn-sm btn-sm-primary" onclick="event.stopPropagation();goPage('login')">Find My Photos</button>
          <button class="btn-sm btn-sm-ghost">Share</button>
        </div>
      </div>
    </div>`).join('');
}
function setFilter(f, el) { currentFilter = f; document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active')); el.classList.add('active'); renderCatalog(); }
function filterEvents() { currentSearch = document.getElementById('search-input').value; renderCatalog(); }
async function renderPhEvents() {
  const container = document.getElementById('ph-events-list');
  container.innerHTML = `<div style="color:var(--muted);padding:20px;">Loading events…</div>`;
  try {
    const res = await fetch(`${API}/events`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load events');
    const events = await res.json();
    if (events.length === 0) { container.innerHTML = `<div style="color:var(--muted);padding:20px;text-align:center;">No events yet — create your first one!</div>`; return; }
    container.innerHTML = events.map(e => `
      <div class="event-row">
        <div class="event-row-icon" style="background:linear-gradient(135deg,#3b1a6e,#0f0f1a);">📸</div>
        <div class="event-row-info">
          <div class="event-row-name">${e.name}</div>
          <div class="event-row-meta"><span>📅 ${e.date ? new Date(e.date).toLocaleDateString() : 'No date'}</span><span>📝 ${e.description || 'No description'}</span></div>
        </div>
        <div class="event-row-right"><div style="font-size:11px;color:var(--dimmer);">Created ${new Date(e.createdAt).toLocaleDateString()}</div></div>
      </div>`).join('');
  } catch (e) { container.innerHTML = `<div style="color:#f87171;padding:20px;">⚠️ ${e.message} — is your backend running on port 5000?</div>`; }
}
function openModal() { document.getElementById('new-event-modal').classList.add('open'); }
function closeModal() { document.getElementById('new-event-modal').classList.remove('open'); }
function closeModalOutside(e) { if (e.target === document.getElementById('new-event-modal')) closeModal(); }
async function createEventDemo() {
  const name = document.getElementById('modal-name').value.trim();
  if (!name) { alert('Please enter an event name.'); return; }
  try {
    const res = await fetch(`${API}/events`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, description: document.getElementById('modal-desc').value, date: document.getElementById('modal-date').value || new Date() }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create event');
    alert(`✅ Event "${name}" created!`); closeModal(); renderPhEvents();
  } catch (e) { alert('⚠️ ' + e.message); }
}
