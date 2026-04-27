const BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return res.json();
}

export const getMachines = () => request('/machines');
export const getMachine = (id) => request(`/machines/${id}`);
export const getLastSession = (id) => request(`/machines/${id}/last-session`);
export const getMachineQR = (id) => request(`/machines/${id}/qr`);
export const createMachine = (data) => request('/machines', { method: 'POST', body: data });
export const updateMachine = (id, data) => request(`/machines/${id}`, { method: 'PUT', body: data });
export const deleteMachine = (id) => request(`/machines/${id}`, { method: 'DELETE' });

export const getSessions = (machineId, limit = 20) => {
  const params = new URLSearchParams({ limit });
  if (machineId) params.set('machine_id', machineId);
  return request(`/sessions?${params}`);
};
export const createSession = (data) => request('/sessions', { method: 'POST', body: data });
export const deleteSession = (id) => request(`/sessions/${id}`, { method: 'DELETE' });
