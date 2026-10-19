import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import Enquiry from '../models/Enquiry.js';
import { requireAdmin, validate, validId } from '../middleware/common.js';

const router = Router();

const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a 10-digit Indian mobile number').or(z.literal('')).default(''),
  interest: z.string().trim().max(100).default(''),
  message: z.string().trim().max(2000).default(''),
});

// 5 enquiries per IP per 15 minutes — stops form spam.
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many enquiries. Please try again later.' } });

// POST /api/enquiries  (public — the contact form)
router.post('/', limiter, validate(enquirySchema), async (req, res, next) => {
  try {
    const e = await Enquiry.create(req.body);
    res.status(201).json({ id: e.id, message: 'Enquiry received' });
  } catch (err) { next(err); }
});

// Admin: list (optionally ?status=new) and update status
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const filter = ['new', 'contacted', 'closed'].includes(req.query.status) ? { status: req.query.status } : {};
    res.json(await Enquiry.find(filter).sort({ createdAt: -1 }).limit(200));
  } catch (err) { next(err); }
});

router.patch('/:id', requireAdmin, validId, validate(z.object({ status: z.enum(['new', 'contacted', 'closed']) })), async (req, res, next) => {
  try {
    const e = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    e ? res.json(e) : res.status(404).json({ error: 'Enquiry not found' });
  } catch (err) { next(err); }
});

export default router;
