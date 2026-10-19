import { Router } from 'express';
import { z } from 'zod';
import Product, { CATEGORIES } from '../models/Product.js';
import { requireAdmin, validate, validId } from '../middleware/common.js';

const router = Router();

const base = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.enum(CATEGORIES),
  price: z.number().nonnegative(),
  mrp: z.number().nonnegative().default(0),
  image: z.string().min(1),
  pos: z.string().default('center'),
  bestSeller: z.boolean().default(false),
});
const createSchema = base.refine((d) => d.mrp === 0 || d.mrp >= d.price, { message: 'mrp must be ≥ price', path: ['mrp'] });
const updateSchema = base.partial();

// GET /api/products?category=living&bestSeller=true
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    if (req.query.bestSeller === 'true') filter.bestSeller = true;
    res.json(await Product.find(filter).sort({ createdAt: 1, _id: 1 }));
  } catch (e) { next(e); }
});

router.get('/:id', validId, async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: 'Product not found' });
  } catch (e) { next(e); }
});

router.post('/', requireAdmin, validate(createSchema), async (req, res, next) => {
  try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); }
});

router.patch('/:id', requireAdmin, validId, validate(updateSchema), async (req, res, next) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    p ? res.json(p) : res.status(404).json({ error: 'Product not found' });
  } catch (e) { next(e); }
});

router.delete('/:id', requireAdmin, validId, async (req, res, next) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    p ? res.status(204).end() : res.status(404).json({ error: 'Product not found' });
  } catch (e) { next(e); }
});

export default router;
