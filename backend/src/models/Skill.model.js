import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['offered', 'wanted'], required: true },
  },
  { timestamps: true }
);

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
