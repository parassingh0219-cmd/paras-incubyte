import { buildEmployeeQuery } from './employeeQuery.js';

const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? '';

export { buildEmployeeQuery };

/** @param {Record<string, string | number | undefined>} params */
export async function fetchEmployees(params = {}) {
  const qs = buildEmployeeQuery(params);
  const response = await fetch(`${API_BASE}/api/employees${qs ? `?${qs}` : ''}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to load employees');
  }

  return response.json();
}

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || fallbackMessage);
  }
  return response.json();
}

/** @param {Record<string, unknown>} payload */
export async function createEmployee(payload) {
  const response = await fetch(`${API_BASE}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse(response, 'Failed to create employee');
}

/**
 * @param {string} id
 * @param {Record<string, unknown>} payload
 */
export async function updateEmployee(id, payload) {
  const response = await fetch(`${API_BASE}/api/employees/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse(response, 'Failed to update employee');
}

/** @param {string} id */
export async function deleteEmployee(id) {
  const response = await fetch(`${API_BASE}/api/employees/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to delete employee');
  }
}
