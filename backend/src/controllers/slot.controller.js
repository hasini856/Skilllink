import Slot from '../models/Slot.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatSlot } from '../utils/formatSession.js';

const assertMentor = (user, res) => {
  if (user.role !== 'mentor') {
    res.status(403);
    throw new Error('Only mentors can manage slots');
  }
};

const assertLearner = (user, res) => {
  if (user.role !== 'learner') {
    res.status(403);
    throw new Error('Only learners can book slots');
  }
};

const validateSlotTimes = (startTime, endTime, res) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    res.status(400);
    throw new Error('Invalid date format');
  }

  if (end <= start) {
    res.status(400);
    throw new Error('End time must be after start time');
  }

  if (start <= new Date()) {
    res.status(400);
    throw new Error('Slot must start in the future');
  }

  return { start, end };
};

export const createSlot = asyncHandler(async (req, res) => {
  assertMentor(req.user, res);

  const { topic, startTime, endTime } = req.body;
  if (!topic?.trim() || !startTime || !endTime) {
    res.status(400);
    throw new Error('Topic, start time, and end time are required');
  }

  const { start, end } = validateSlotTimes(startTime, endTime, res);

  const slot = await Slot.create({
    mentor: req.user._id,
    topic: topic.trim(),
    startTime: start,
    endTime: end,
    status: 'available',
  });

  res.status(201).json({ slot: formatSlot(slot) });
});

export const getMySlots = asyncHandler(async (req, res) => {
  assertMentor(req.user, res);

  const slots = await Slot.find({ mentor: req.user._id }).sort({ startTime: 1 });
  res.json({ slots: slots.map(formatSlot) });
});

export const getAvailableSlots = asyncHandler(async (req, res) => {
  assertLearner(req.user, res);

  const slots = await Slot.find({
    status: 'available',
    startTime: { $gt: new Date() },
  })
    .populate('mentor', 'name mentorProfile')
    .sort({ startTime: 1 });

  res.json({ slots: slots.map(formatSlot) });
});

export const deleteSlot = asyncHandler(async (req, res) => {
  assertMentor(req.user, res);

  const slot = await Slot.findOne({ _id: req.params.id, mentor: req.user._id });
  if (!slot) {
    res.status(404);
    throw new Error('Slot not found');
  }

  if (slot.status === 'booked') {
    res.status(400);
    throw new Error('Cannot delete a booked slot');
  }

  await slot.deleteOne();
  res.json({ message: 'Slot deleted' });
});
