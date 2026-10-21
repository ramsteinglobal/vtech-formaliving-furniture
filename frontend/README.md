# Forma Living — React frontend

```bash
npm install
npm run dev      # http://localhost:5173  (proxies /api to http://localhost:5000)
npm test         # 16 tests: catalogue, search, sort, cart, checkout, 404s
npm run build
```

## Routes
`/` · `/shop` · `/shop/all` · `/shop/:living|bedroom|dining|office` · `/product/:id` · `/cart` (with checkout) · `/featured` · `/reviews` · `/contact`

## Features
Search and sort on every product list · product pages with quantity and related items · cart saved in localStorage · checkout that places a real order · contact form · 404 page · per-page titles · keyboard-accessible controls.

## Working with the backend
The site works on its own with bundled data (`src/data/products.js`). When the API is running it is used instead (`src/api.js`). Product `image` may be a bundled key (`liv`, `i7`…) or a full URL.
Checkout sends only product ids and quantities; **prices are calculated by the server**. Orders only work against the real API, because bundled products have no database ids.
Set `VITE_API_URL` when the API is on a different host.
