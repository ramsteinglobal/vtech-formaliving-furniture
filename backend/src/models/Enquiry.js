import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true },
    interest: { type: String, default: '' },
    message: { type: String, default: '', maxlength: 2000 },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new', index: true },
  },
  { timestamps: true }
);

enquirySchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; return ret; },
});

export default mongoose.model('Enquiry', enquirySchema);
