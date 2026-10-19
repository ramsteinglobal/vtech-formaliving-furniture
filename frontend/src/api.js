import { products as localProducts, bestSellers as localBest } from './data/products';

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
  try { return await request('/api/products'); } catch { return localProducts; }
}
export async function getBestSellers() {
  try { return await request('/api/products?bestSeller=true'); } catch { return localBest; }
}
export const sendEnquiry = (data) => request('/api/enquiries', { method: 'POST', body: JSON.stringify(data) });
