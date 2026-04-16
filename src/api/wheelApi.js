export async function fetchWheels() {
  const res = await fetch('/api/wheels');
  return res.json();
}

export async function fetchWheel(id) {
  const res = await fetch(`/api/wheels/${id}`);
  return res.json();
}

export async function updateWheel(id, data) {
  const res = await fetch(`/api/wheels/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchThemes() {
  const res = await fetch('/api/themes');
  return res.json();
}
