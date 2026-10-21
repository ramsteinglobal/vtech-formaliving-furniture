import mongoose from 'mongoose';

export const ORDER_STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
    },
    // Name and price are copied at order time so later catalogue edits never change past orders.
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: String,
      price: Number,
      qty: { type: Number, min: 1 },
      _id: false,
    }],
    code: { type: String, index: true },   // short customer-facing order number
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'new', index: true },
  },
  { timestamps: true }
);

orderSchema.pre('validate', function (next) {
  if (!this.code) this.code = this._id.toString().slice(-8).toUpperCase();
  next();
});

orderSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; return ret; },
});

export default mongoose.model('Order', orderSchema);
