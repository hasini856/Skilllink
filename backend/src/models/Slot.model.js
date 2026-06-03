import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
  },
  { timestamps: true }
);

slotSchema.index({ mentor: 1, startTime: 1 });
slotSchema.index({ status: 1, startTime: 1 });

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
