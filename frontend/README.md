# Forma Living — React (MERN) frontend

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Routes: `/`, `/shop`, `/shop/:living|bedroom|dining|office`, `/featured`, `/reviews`, `/contact`

## Connecting your Express/Mongo backend
The UI works standalone with bundled data (`src/data/products.js`). When an API is up, it is used instead (`src/api.js`):

| Method | Path | Returns / expects |
|---|---|---|
| GET | `/api/products` | `[{ _id/id, name, category, price, mrp, image, pos }]` |
| GET | `/api/products?bestSeller=true` | same shape, best sellers only |
| POST | `/api/enquiries` | `{ name, phone, email, interest, message }` |

`category` is one of `living | bedroom | dining | office`. `image` is a key from `src/assets/img` (swap `imageUrl()` in `src/data/images.js` for full URLs once images are hosted). Vite proxies `/api` to `http://localhost:5000`; set `VITE_API_URL` to override.
