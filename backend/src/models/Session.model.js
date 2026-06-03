import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'cancelled'], default: 'scheduled' },
    reminderMinutes: { type: Number, default: 60 },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

sessionSchema.index({ mentor: 1, startTime: 1 });
sessionSchema.index({ learner: 1, startTime: 1 });
sessionSchema.index({ status: 1, startTime: 1 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;
