import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchType: { type: String, enum: ['peer', 'mentor'], required: true },
    sharedSkills: { type: [String], default: [] },
    status: { type: String, enum: ['connected'], default: 'connected' },
  },
  { timestamps: true }
);

connectionSchema.index({ from: 1, to: 1 }, { unique: true });

const Connection = mongoose.model('Connection', connectionSchema);

export default Connection;
