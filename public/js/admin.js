async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function checkAuth() {
  try {
    await api('/api/admin/me');
    document.getElementById('loginView').classList.add('hidden');
    document.getElementById('appView').classList.remove('hidden');
    await loadAll();
  } catch (_e) {
    document.getElementById('loginView').classList.remove('hidden');
  }
}

async function loadAll() {
  const [leads, projects, team, posts, settings] = await Promise.all([
    api('/api/admin/leads'),
    api('/api/admin/projects'),
    api('/api/admin/team'),
    api('/api/admin/posts'),
    api('/api/admin/settings')
  ]);

  document.getElementById('leadsList').innerHTML = leads
    .map((l) => `<div class="list-item"><b>${l.name}</b> (${l.email})<br/>${l.service || ''} - ${l.budget || ''}<br/>${l.message}</div>`)
    .join('');

  document.getElementById('projectsList').innerHTML = projects
    .map((p) => `<div class="list-item">${p.title} <button onclick="removeItem('projects',${p.id})">Delete</button></div>`)
    .join('');

  document.getElementById('teamList').innerHTML = team
    .map((m) => `<div class="list-item">${m.name} - ${m.role} <button onclick="removeItem('team',${m.id})">Delete</button></div>`)
    .join('');

  document.getElementById('postsList').innerHTML = posts
    .map((p) => `<div class="list-item">[${p.language}] ${p.title} <button onclick="removeItem('posts',${p.id})">Delete</button></div>`)
    .join('');

  const form = document.getElementById('settingsForm');
  Object.keys(settings).forEach((key) => {
    if (form.elements[key]) form.elements[key].value = settings[key];
  });
}

async function removeItem(type, id) {
  await api(`/api/admin/${type}/${id}`, { method: 'DELETE' });
  await loadAll();
}
window.removeItem = removeItem;

window.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(formDataToObject(e.target))
      });
      document.getElementById('loginResult').textContent = 'Logged in';
      await checkAuth();
    } catch (err) {
      document.getElementById('loginResult').textContent = err.message;
    }
  });

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await api('/api/admin/logout', { method: 'POST' });
    location.reload();
  });

  document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api('/api/admin/projects', { method: 'POST', body: JSON.stringify(formDataToObject(e.target)) });
    e.target.reset();
    await loadAll();
  });

  document.getElementById('teamForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api('/api/admin/team', { method: 'POST', body: JSON.stringify(formDataToObject(e.target)) });
    e.target.reset();
    await loadAll();
  });

  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api('/api/admin/posts', { method: 'POST', body: JSON.stringify(formDataToObject(e.target)) });
    e.target.reset();
    await loadAll();
  });

  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await api('/api/admin/settings', { method: 'POST', body: JSON.stringify(formDataToObject(e.target)) });
    await loadAll();
  });

  document.querySelector('[data-load="leads"]').addEventListener('click', loadAll);
});
