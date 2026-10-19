import mongoose from 'mongoose';

export const CATEGORIES = ['living', 'bedroom', 'dining', 'office'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: 0, min: 0 },            // 0 = no discount shown
    image: { type: String, required: true },               // image key or full URL
    pos: { type: String, default: 'center' },              // CSS object-position
    bestSeller: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// The React app reads `id`, not `_id`.
productSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; return ret; },
});

export default mongoose.model('Product', productSchema);
