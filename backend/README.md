# Forma Living — Express + MongoDB API

```bash
cp .env.example .env     # set MONGODB_URI and ADMIN_API_KEY
npm install
npm run seed             # loads the 41 products the frontend ships with
npm run dev              # http://localhost:5000
npm test                 # 9 tests, no database needed
```

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/health` | – | liveness check |
| GET | `/api/products` | – | `?category=living\|bedroom\|dining\|office`, `?bestSeller=true` |
| GET | `/api/products/:id` | – | |
| POST / PATCH / DELETE | `/api/products[/:id]` | `x-api-key` | manage catalogue |
| POST | `/api/enquiries` | – | contact form; 5 per IP / 15 min |
| POST | `/api/orders` | – | `{ name, email, phone, address, city, pincode, items:[{productId, qty}] }`; price is taken from the database; 10 per IP / 15 min |
| GET | `/api/orders` | `x-api-key` | `?status=new\|confirmed\|shipped\|delivered\|cancelled` |
| PATCH | `/api/orders/:id` | `x-api-key` | body `{ "status": "confirmed" }` |
| GET | `/api/enquiries` | `x-api-key` | `?status=new` |
| PATCH | `/api/enquiries/:id` | `x-api-key` | body `{ "status": "contacted" }` |

Validation errors return `400 { error, details: [{ field, message }] }`.

## Frontend
Run the React app with its Vite proxy (`/api → localhost:5000`) and it uses this API automatically. In production, set `VITE_API_URL` in the frontend to this server's URL and `CLIENT_ORIGIN` here to the site's URL.
