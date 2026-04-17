const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchWheels() {
  const res = await fetch(`${API_BASE}/api/wheels`);
  return res.json();
}

export async function fetchWheel(id) {
  const res = await fetch(`${API_BASE}/api/wheels/${id}`);
  return res.json();
}

export async function createWheel(data) {
  const res = await fetch(`${API_BASE}/api/wheels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateWheel(id, data) {
  const res = await fetch(`${API_BASE}/api/wheels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteWheel(id) {
  await fetch(`${API_BASE}/api/wheels/${id}`, { method: 'DELETE' });
}

export async function fetchThemes() {
  const res = await fetch(`${API_BASE}/api/themes`);
  return res.json();
}
