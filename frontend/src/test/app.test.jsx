import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, test, vi } from 'vitest';
import App from '../App';
import { CartProvider, CatalogueProvider } from '../store';
import { imageUrl } from '../data/images';

let orderResponse;
let trackResponse;
const fetchMock = vi.fn((url) => String(url).includes('/api/orders/track') ? Promise.resolve(trackResponse) : (String(url).includes('/api/orders')
  ? (typeof orderResponse === 'function' ? orderResponse() : Promise.resolve(orderResponse))
  : Promise.reject(new Error('offline')))); // catalogue falls back to bundled data

beforeEach(() => {
  fetchMock.mockClear();
  vi.stubGlobal('fetch', fetchMock);
  orderResponse = { ok: true, status: 201, json: async () => ({ id: 'abc123def456', code: 'ABC12345', total: 48900 }) };
  trackResponse = { ok: true, status: 200, json: async () => ({ code: 'ABC12345', status: 'shipped', total: 48900, createdAt: '2026-10-21T08:00:00Z', city: 'Basti', items: [{ name: 'Kalpa 3-Seater Sofa', qty: 1, price: 48900 }] }) };
});

const show = (path) => {
  const user = userEvent.setup();
  const utils = render(
    <MemoryRouter initialEntries={[path]}><CatalogueProvider><CartProvider><App /></CartProvider></CatalogueProvider></MemoryRouter>
  );
  return { user, ...utils };
};
const cards = (c) => [...c.querySelectorAll('.pc')];
const price = (card) => Number(card.querySelector('.pp').firstChild.textContent.replace(/\D/g, ''));

test('home page renders the hero', () => {
  show('/');
  expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/home\./i);
});

test('"All" lists the full catalogue, including best sellers', async () => {
  const { container } = show('/shop/all');
  await waitFor(() => expect(cards(container)).toHaveLength(41));
});

test('an empty API response (unseeded database) keeps the bundled catalogue', async () => {
  fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: true, status: 200, json: async () => [] }));
  const { container } = show('/shop/living');
  await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  await waitFor(() => expect(cards(container).length).toBeGreaterThan(8));
});

test('cart items are re-pointed at the real catalogue once the API loads', async () => {
  const realId = 'a'.repeat(24);
  localStorage.setItem('forma-cart', JSON.stringify([{ id: '1', name: 'Aranya Lounge Sofa', price: 1, mrp: 0, image: 'i7', pos: 'center', qty: 2 }]));
  fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: true, status: 200, json: async () => [{ id: realId, name: 'Aranya Lounge Sofa', category: 'living', price: 52900, mrp: 0, image: 'i7', pos: 'center' }] }));
  show('/cart');
  await waitFor(() => expect(JSON.parse(localStorage.getItem('forma-cart'))[0]).toMatchObject({ id: realId, price: 52900, qty: 2 }));
});

test('category pages include best sellers of that category', async () => {
  const { container } = show('/shop/living');
  await waitFor(() => expect(cards(container).length).toBeGreaterThan(8));
  expect(container.textContent).toContain('Kalpa 3-Seater Sofa');
});

test('search narrows results and shows an empty state', async () => {
  const { user, container } = show('/shop/all');
  await user.type(screen.getByRole('searchbox', { name: /search/i }), 'sofa');
  const found = cards(container);
  expect(found.length).toBeGreaterThan(0);
  expect(found.length).toBeLessThan(41);
  found.forEach((c) => expect(c.querySelector('h3').textContent.toLowerCase()).toContain('sofa'));
  await user.clear(screen.getByRole('searchbox'));
  await user.type(screen.getByRole('searchbox'), 'zzzz');
  expect(screen.getByText(/No products match/)).toBeInTheDocument();
});

test('sorting by price works', async () => {
  const { user, container } = show('/shop/all');
  await user.selectOptions(screen.getByRole('combobox', { name: /sort/i }), 'low');
  const prices = cards(container).map(price);
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
  await user.selectOptions(screen.getByRole('combobox', { name: /sort/i }), 'high');
  const desc = cards(container).map(price);
  expect(desc).toEqual([...desc].sort((a, b) => b - a));
});

test('product detail page, quantity and add to cart', async () => {
  const { user } = show('/product/33');
  expect(await screen.findByRole('heading', { level: 1, name: 'Kalpa 3-Seater Sofa' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /increase quantity/i }));
  await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);
  expect(screen.getByRole('link', { name: /Cart, 2 items/ })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('forma-cart'))[0]).toMatchObject({ id: '33', qty: 2, price: 48900 });
});

test('cart: totals, quantity changes, remove, empty state', async () => {
  const { user } = show('/shop/all');
  await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0]);
  await user.click(screen.getByRole('link', { name: /^Cart, 1 item/ }));
  expect(screen.getByRole('heading', { name: 'Delivery details' })).toBeInTheDocument();
  const row = document.querySelector('.crow');
  const unit = Number(row.querySelector('.cinfo span').textContent.replace(/\D/g, ''));
  await user.click(within(row).getByRole('button', { name: /increase/i }));
  expect(document.querySelector('.sum b').textContent.replace(/\D/g, '')).toBe(String(unit * 2));
  await user.click(screen.getByRole('button', { name: /remove/i }));
  expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
});

async function fillCheckout(user) {
  await user.type(screen.getByLabelText('Name'), 'Asha Verma');
  await user.type(screen.getByLabelText('Phone'), '9555882573');
  await user.type(screen.getByLabelText('Email'), 'asha@example.com');
  await user.type(screen.getByLabelText('Address'), '12 Park Road, Gomti Nagar');
  await user.type(screen.getByLabelText('City'), 'Lucknow');
  await user.type(screen.getByLabelText('Pincode'), '226010');
}

test('checkout sends only ids and quantities, then confirms and clears the cart', async () => {
  const { user } = show('/product/33');
  await user.click((await screen.findAllByRole('button', { name: /add to cart/i }))[0]);
  await user.click(screen.getByRole('link', { name: /view cart/i }));
  await fillCheckout(user);
  await user.click(screen.getByRole('button', { name: /place order/i }));
  expect(await screen.findByRole('heading', { name: 'Thank you!' })).toBeInTheDocument();
  const [, opts] = fetchMock.mock.calls.find(([u]) => String(u).includes('/api/orders'));
  const body = JSON.parse(opts.body);
  expect(body.items).toEqual([{ productId: '33', qty: 1 }]);
  expect(body).not.toHaveProperty('total');
  expect(screen.getByText('#ABC12345')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('forma-orders'))[0]).toEqual({ code: 'ABC12345', phone: '9555882573' });
  expect(localStorage.getItem('forma-cart')).toBe('[]');
});

test('checkout shows the server validation message and keeps the cart', async () => {
  orderResponse = { ok: false, status: 400, json: async () => ({ error: 'Validation failed', details: [{ field: 'pincode', message: 'Enter a 6-digit pincode' }] }) };
  const { user } = show('/product/33');
  await user.click((await screen.findAllByRole('button', { name: /add to cart/i }))[0]);
  await user.click(screen.getByRole('link', { name: /view cart/i }));
  await fillCheckout(user);
  await user.click(screen.getByRole('button', { name: /place order/i }));
  expect(await screen.findByText('Enter a 6-digit pincode')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('forma-cart'))).toHaveLength(1);
});

test('checkout failure (server down) shows a friendly message', async () => {
  orderResponse = () => Promise.reject(new TypeError('network'));
  const { user } = show('/product/33');
  await user.click((await screen.findAllByRole('button', { name: /add to cart/i }))[0]);
  await user.click(screen.getByRole('link', { name: /view cart/i }));
  await fillCheckout(user);
  await user.click(screen.getByRole('button', { name: /place order/i }));
  expect(await screen.findByText(/couldn’t place your order/)).toBeInTheDocument();
});

test('featured page adds the Kalpa sofa to the cart', async () => {
  const { user } = show('/featured');
  await user.click((await screen.findAllByRole('button', { name: /add to cart/i }))[0]);
  expect(screen.getByRole('link', { name: /Cart, 1 item/ })).toBeInTheDocument();
});

test('unknown pages and categories show a 404', () => {
  const a = show('/nope');
  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  a.unmount();
  show('/shop/garden');
  expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
});

test('unknown product id shows a 404 once the catalogue has loaded', async () => {
  show('/product/99999');
  expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
});

test('contact form posts the enquiry and shows server messages', async () => {
  fetchMock.mockImplementationOnce(() => Promise.reject(new Error('offline'))); // catalogue
  fetchMock.mockImplementationOnce(() => Promise.resolve({ ok: false, status: 400, json: async () => ({ details: [{ message: 'Enter a 10-digit Indian mobile number' }] }) }));
  const { user } = show('/contact');
  await user.type(screen.getByLabelText('Name'), 'Asha');
  await user.type(screen.getByLabelText('Email'), 'asha@example.com');
  await user.type(screen.getByLabelText('Phone'), '123');
  await user.click(screen.getByRole('button', { name: /send enquiry/i }));
  expect(await screen.findByText('Enter a 10-digit Indian mobile number')).toBeInTheDocument();
});

test('image helper passes full URLs through and resolves bundled keys', () => {
  expect(imageUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg');
  expect(imageUrl('/uploads/a.jpg')).toBe('/uploads/a.jpg');
  expect(imageUrl('liv')).toMatch(/liv.*\.jpg$/);
});

test('page title updates per route', async () => {
  show('/reviews');
  await waitFor(() => expect(document.title).toBe('Reviews · Forma Living'));
});

test('my orders lists orders saved on this device with live status', async () => {
  localStorage.setItem('forma-orders', JSON.stringify([{ code: 'ABC12345', phone: '9555882573' }]));
  show('/orders');
  expect(await screen.findByText('#ABC12345')).toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'Status: Shipped' })).toBeInTheDocument();
  expect(screen.getByText(/1 × Kalpa 3-Seater Sofa/)).toBeInTheDocument();
});

test('track an order by number and phone, and show the not-found message', async () => {
  const { user } = show('/orders');
  await user.type(screen.getByLabelText('Order number'), 'abc12345');
  await user.type(screen.getByLabelText('Phone number'), '9555882573');
  await user.click(screen.getByRole('button', { name: /track order/i }));
  expect(await screen.findByText('#ABC12345')).toBeInTheDocument();
  expect(JSON.parse(fetchMock.mock.calls.find(([u]) => String(u).includes('/track'))[1].body)).toEqual({ code: 'abc12345', phone: '9555882573' });

  trackResponse = { ok: false, status: 404, json: async () => ({ error: 'We couldn’t find an order with those details.' }) };
  await user.clear(screen.getByLabelText('Order number'));
  await user.type(screen.getByLabelText('Order number'), 'ZZZZ9999');
  await user.click(screen.getByRole('button', { name: /track order/i }));
  expect(await screen.findByText(/couldn’t find an order/)).toBeInTheDocument();
});
