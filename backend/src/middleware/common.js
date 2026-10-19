import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

// Admin routes: constant-time compare of x-api-key against ADMIN_API_KEY.
export function requireAdmin(req, res, next) {
  const key = process.env.ADMIN_API_KEY || '';
  const sent = Buffer.from(String(req.get('x-api-key') || ''));
  const want = Buffer.from(key);
  if (!key || sent.length !== want.length || !crypto.timingSafeEqual(sent, want)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

export const validate = (schema) => (req, _res, next) => { req.body = schema.parse(req.body); next(); };

export const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ error: 'Invalid id' });

export const notFound = (_req, res) => res.status(404).json({ error: 'Not found' });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}
