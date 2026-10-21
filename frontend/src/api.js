import { products as localProducts } from './data/products';

const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options) {
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = body.details || [];
    throw err;
  }
  return res.json();
}

// Catalogue: try the Express API first, fall back to bundled data so the UI works without a backend.
export async function getProducts() {
  try {
    const data = await request('/api/products');
    // An empty or invalid response (e.g. database not seeded yet) must not wipe the catalogue.
    return Array.isArray(data) && data.length ? data : localProducts;
  } catch { return localProducts; }
}
export const sendEnquiry = (data) => request('/api/enquiries', { method: 'POST', body: JSON.stringify(data) });
export const trackOrder = (data) => request('/api/orders/track', { method: 'POST', body: JSON.stringify(data) });
export const createOrder = (data) => request('/api/orders', { method: 'POST', body: JSON.stringify(data) });

// Turns a failed request into a message for the visitor.
export function errorText(err, fallback) {
  if (err.status === 400 && err.details?.length) return err.details.map((d) => d.message).join(' ');
  if ([400, 404, 429].includes(err.status)) return err.message;
  return fallback;
}
