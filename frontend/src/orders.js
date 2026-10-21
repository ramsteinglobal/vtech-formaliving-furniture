// Orders placed on this device, so customers can see their status without an account.
const KEY = 'forma-orders';

export function savedOrders() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch { return []; }
}
export function rememberOrder(order) {
  const rest = savedOrders().filter((o) => o.code !== order.code);
  try { localStorage.setItem(KEY, JSON.stringify([order, ...rest].slice(0, 10))); } catch { /* storage unavailable */ }
}
