// Run with: npm test  (no database needed — covers auth, validation and pricing)
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
process.env.ADMIN_API_KEY = 'test-key';
const { createApp } = await import('../src/app.js');
const { buildOrderItems } = await import('../src/utils/pricing.js');

const server = createApp().listen(0);
const base = `http://localhost:${server.address().port}`;
test.after(() => server.close());

const call = async (path, { method = 'GET', body, headers = {} } = {}) => {
  const res = await fetch(base + path, { method, headers: { 'content-type': 'application/json', ...headers }, body: body && JSON.stringify(body) });
  const text = await res.text();
  return { status: res.status, json: text ? JSON.parse(text) : null };
};

test('health check', async () => assert.equal((await call('/api/health')).status, 200));
test('unknown route is 404 JSON', async () => assert.equal((await call('/api/nope')).status, 404));
test('malformed JSON is 400', async () => {
  const res = await fetch(base + '/api/enquiries', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{oops' });
  assert.equal(res.status, 400);
});

test('admin routes reject missing or wrong key', async () => {
  for (const path of ['/api/enquiries', '/api/orders']) {
    assert.equal((await call(path)).status, 401);
    assert.equal((await call(path, { headers: { 'x-api-key': 'wrong' } })).status, 401);
  }
  assert.equal((await call('/api/products', { method: 'POST', body: {} })).status, 401);
});

test('product creation validates body for admins', async () => {
  const r = await call('/api/products', { method: 'POST', headers: { 'x-api-key': 'test-key' }, body: { name: 'x', category: 'garden', price: -1 } });
  assert.equal(r.status, 400);
  assert.ok(r.json.details.length >= 2);
});

test('enquiry validation reports each bad field', async () => {
  const r = await call('/api/enquiries', { method: 'POST', body: { name: '', email: 'x', phone: '123' } });
  assert.equal(r.status, 400);
  assert.deepEqual(r.json.details.map((d) => d.field).sort(), ['email', 'name', 'phone']);
});

test('order validation', async () => {
  const r = await call('/api/orders', { method: 'POST', body: { name: 'A', email: 'a@b.co', phone: '9555882573', address: 'short', city: 'L', pincode: '12', items: [{ productId: 'nope', qty: 0 }] } });
  assert.equal(r.status, 400);
  const fields = r.json.details.map((d) => d.field);
  for (const f of ['address', 'city', 'pincode', 'items.0.productId', 'items.0.qty']) assert.ok(fields.includes(f), f);
  assert.equal((await call('/api/orders', { method: 'POST', body: { name: 'A', email: 'a@b.co', phone: '9555882573', address: '12 Park Road, Lucknow', city: 'Lucknow', pincode: '226001', items: [] } })).status, 400);
});

test('pricing uses database prices and merges duplicate lines', () => {
  const id1 = 'a'.repeat(24), id2 = 'b'.repeat(24);
  const db = [{ _id: id1, name: 'Sofa', price: 1000 }, { _id: id2, name: 'Chair', price: 250 }];
  const { items, total } = buildOrderItems([{ productId: id1, qty: 1 }, { productId: id2, qty: 2 }, { productId: id1, qty: 2 }], db);
  assert.equal(items.length, 2);
  assert.equal(total, 3 * 1000 + 2 * 250);
});

test('pricing rejects unknown products and oversized quantities', () => {
  const id = 'a'.repeat(24);
  assert.throws(() => buildOrderItems([{ productId: 'c'.repeat(24), qty: 1 }], []), /no longer available/);
  assert.throws(() => buildOrderItems([{ productId: id, qty: 15 }, { productId: id, qty: 10 }], [{ _id: id, name: 'Sofa', price: 1 }]), /at most 20/);
});
