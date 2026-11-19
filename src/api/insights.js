const API_BASE = import.meta.env?.VITE_API_BASE_URL ?? '';

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || fallbackMessage);
  }
  return response.json();
}

export async function fetchCountryMetrics() {
  const response = await fetch(`${API_BASE}/api/insights/countries`);
  return parseResponse(response, 'Failed to fetch country metrics');
}

/** @param {string} country */
export async function fetchJobTitleAverages(country) {
  if (!country) return { telemetry: {}, data: [] };
  const response = await fetch(`${API_BASE}/api/insights/countries/${encodeURIComponent(country)}/job-titles`);
  return parseResponse(response, `Failed to fetch job title averages for ${country}`);
}

/**
 * @param {string} country
 * @param {number} [bucketCount]
 */
export async function fetchSalaryHistogram(country, bucketCount) {
  if (!country) return { telemetry: {}, data: [] };
  const qs = bucketCount ? `?bucketCount=${bucketCount}` : '';
  const response = await fetch(`${API_BASE}/api/insights/countries/${encodeURIComponent(country)}/histogram${qs}`);
  return parseResponse(response, `Failed to fetch salary histogram for ${country}`);
}
