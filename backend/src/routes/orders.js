import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import Order, { ORDER_STATUSES } from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAdmin, validate, validId } from '../middleware/common.js';
import { buildOrderItems } from '../utils/pricing.js';

const router = Router();
const digits = (p) => p.replace(/\D/g, '').slice(-10); // +91 and spaces ignored

export const orderSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number'),
  address: z.string().trim().min(10, 'Enter your full delivery address').max(300),
  city: z.string().trim().min(2, 'City is required').max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a 6-digit pincode'),
  items: z.array(z.object({
    productId: z.string().regex(/^[a-f\d]{24}$/i, 'Some items in your cart can’t be ordered online right now. Please refresh the page, or contact us to order.'),
    qty: z.number().int().min(1).max(20),
  })).min(1, 'Your cart is empty').max(30),
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many orders from this device. Please try again later.' } });

// POST /api/orders — prices are always taken from the database, never from the client.
router.post('/', limiter, validate(orderSchema), async (req, res, next) => {
  try {
    const { items: requested, ...customer } = req.body;
    const products = await Product.find({ _id: { $in: requested.map((r) => r.productId) } });
    const { items, total } = buildOrderItems(requested, products);
    const order = await Order.create({ customer: { ...customer, phone: digits(customer.phone) }, items, total });
    res.status(201).json({ id: order.id, code: order.code, total, message: 'Order received. We will call you to confirm.' });
  } catch (e) { next(e); }
});

const trackSchema = z.object({
  code: z.string().trim().regex(/^[A-Za-z0-9]{6,24}$/, 'Enter your order number'),
  phone: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, 'Enter the 10-digit phone number used for the order'),
});
const trackLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many lookups. Please try again later.' } });

// POST /api/orders/track — customer lookup by order number + phone (one generic error so nothing leaks).
router.post('/track', trackLimiter, validate(trackSchema), async (req, res, next) => {
  try {
    const code = req.body.code.toUpperCase();
    const filter = /^[A-F\d]{24}$/.test(code) ? { _id: code } : { code };
    const o = await Order.findOne({ ...filter, 'customer.phone': digits(req.body.phone) });
    if (!o) return res.status(404).json({ error: 'We couldn’t find an order with those details. Check the order number and phone number.' });
    res.json({
      code: o.code || o.id.slice(-8).toUpperCase(), status: o.status, total: o.total, createdAt: o.createdAt, city: o.customer.city,
      items: o.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    });
  } catch (e) { next(e); }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const filter = ORDER_STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
    res.json(await Order.find(filter).sort({ createdAt: -1 }).limit(200));
  } catch (e) { next(e); }
});

router.patch('/:id', requireAdmin, validId, validate(z.object({ status: z.enum(ORDER_STATUSES) })), async (req, res, next) => {
  try {
    const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    o ? res.json(o) : res.status(404).json({ error: 'Order not found' });
  } catch (e) { next(e); }
});

export default router;
