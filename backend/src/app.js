import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import products from './routes/products.js';
import orders from './routes/orders.js';
import enquiries from './routes/enquiries.js';
import { errorHandler, notFound } from './middleware/common.js';

export function createApp() {
  const app = express();
  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim());

  app.set('trust proxy', 1); // correct client IP behind a proxy/load balancer (needed for rate limiting)
  app.use(helmet());
  app.use(cors({ origin: origins }));
  app.use(express.json({ limit: '20kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.use('/api/products', products);
  app.use('/api/enquiries', enquiries);
  app.use('/api/orders', orders);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

// Vercel needs the Express app itself as the default export.
const app = createApp();
export default app;
