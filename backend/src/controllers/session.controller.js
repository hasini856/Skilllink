import Slot from '../models/Slot.model.js';
import Session from '../models/Session.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatSession } from '../utils/formatSession.js';

const VALID_REMINDER_MINUTES = [0, 15, 30, 60, 1440];

export const bookSlot = asyncHandler(async (req, res) => {
  if (req.user.role !== 'learner') {
    res.status(403);
    throw new Error('Only learners can book slots');
  }

  const { reminderMinutes = 60 } = req.body;
  const slot = await Slot.findById(req.params.id).populate('mentor', 'name');

  if (!slot) {
    res.status(404);
    throw new Error('Slot not found');
  }

  if (slot.status !== 'available') {
    res.status(400);
    throw new Error('This slot is no longer available');
  }

  if (slot.startTime <= new Date()) {
    res.status(400);
    throw new Error('This slot has already started');
  }

  const minutes = Number(reminderMinutes);
  if (!VALID_REMINDER_MINUTES.includes(minutes)) {
    res.status(400);
    throw new Error('Invalid reminder option');
  }

  const session = await Session.create({
    slot: slot._id,
    mentor: slot.mentor._id,
    learner: req.user._id,
    topic: slot.topic,
    startTime: slot.startTime,
    endTime: slot.endTime,
    reminderMinutes: minutes,
    status: 'scheduled',
  });

  slot.status = 'booked';
  await slot.save();

  await session.populate([
    { path: 'mentor', select: 'name' },
    { path: 'learner', select: 'name' },
  ]);

  res.status(201).json({ session: formatSession(session) });
});

export const getUpcomingSessions = asyncHandler(async (req, res) => {
  const filter = {
    status: 'scheduled',
    startTime: { $gte: new Date() },
  };

  if (req.user.role === 'mentor') {
    filter.mentor = req.user._id;
  } else {
    filter.learner = req.user._id;
  }

  const sessions = await Session.find(filter)
    .populate('mentor', 'name')
    .populate('learner', 'name')
    .sort({ startTime: 1 });

  res.json({ sessions: sessions.map(formatSession) });
});

export const updateReminder = asyncHandler(async (req, res) => {
  const { reminderMinutes } = req.body;
  const minutes = Number(reminderMinutes);

  if (!VALID_REMINDER_MINUTES.includes(minutes)) {
    res.status(400);
    throw new Error('Invalid reminder option');
  }

  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  const isParticipant =
    session.mentor.toString() === req.user._id.toString() ||
    session.learner.toString() === req.user._id.toString();

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to update this session');
  }

  session.reminderMinutes = minutes;
  session.reminderSent = false;
  await session.save();

  await session.populate([
    { path: 'mentor', select: 'name' },
    { path: 'learner', select: 'name' },
  ]);

  res.json({ session: formatSession(session) });
});

export const cancelSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  const isParticipant =
    session.mentor.toString() === req.user._id.toString() ||
    session.learner.toString() === req.user._id.toString();

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized to cancel this session');
  }

  session.status = 'cancelled';
  await session.save();

  await Slot.findByIdAndUpdate(session.slot, { status: 'available' });

  await session.populate([
    { path: 'mentor', select: 'name' },
    { path: 'learner', select: 'name' },
  ]);

  res.json({ session: formatSession(session) });
});

export const markReminderSent = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  const isParticipant =
    session.mentor.toString() === req.user._id.toString() ||
    session.learner.toString() === req.user._id.toString();

  if (!isParticipant) {
    res.status(403);
    throw new Error('Not authorized');
  }

  session.reminderSent = true;
  await session.save();

  res.json({ message: 'Reminder marked as sent' });
});
