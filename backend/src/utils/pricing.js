import { HttpError } from '../middleware/common.js';

export const MAX_QTY_PER_PRODUCT = 20;

/**
 * Builds order lines from what the client asked for, using prices from the database only.
 * `requested`: [{ productId, qty }]   `products`: Mongo docs (or { _id, name, price })
 */
export function buildOrderItems(requested, products) {
  const byId = new Map(products.map((p) => [String(p._id), p]));
  const qtyById = new Map();
  for (const { productId, qty } of requested) qtyById.set(productId, (qtyById.get(productId) || 0) + qty);

  const items = [];
  for (const [id, qty] of qtyById) {
    const p = byId.get(id);
    if (!p) throw new HttpError(400, 'Some items in your cart are no longer available. Please refresh and try again.');
    if (qty > MAX_QTY_PER_PRODUCT) throw new HttpError(400, `You can order at most ${MAX_QTY_PER_PRODUCT} of "${p.name}". Contact us for bulk orders.`);
    items.push({ product: p._id, name: p.name, price: p.price, qty });
  }
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return { items, total };
}
