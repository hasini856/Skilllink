import User from '../models/User.model.js';
import Session from '../models/Session.model.js';
import Connection from '../models/Connection.model.js';
import Slot from '../models/Slot.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getLastNDays, toDateKey, formatShortDate } from '../utils/dateRanges.js';

const DAYS = 7;

const countByDate = (items, dateField = 'createdAt') => {
  const map = new Map();
  for (const item of items) {
    const key = toDateKey(item[dateField]);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
};

const buildDailySeries = (days, countMap, valueKey = 'count') =>
  days.map((day) => {
    const dateKey = toDateKey(day);
    return {
      date: dateKey,
      label: formatShortDate(dateKey),
      [valueKey]: countMap.get(dateKey) || 0,
    };
  });

const normalizeSkill = (s) => s.toLowerCase().trim();

const aggregateSkills = async () => {
  const skillCounts = new Map();

  const addSkill = (raw) => {
    if (!raw) return;
    const key = normalizeSkill(raw);
    if (!key) return;
    const display = raw.trim();
    const existing = skillCounts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      skillCounts.set(key, { skill: display, count: 1 });
    }
  };

  const users = await User.find({}, 'role learnerProfile mentorProfile').lean();
  for (const user of users) {
    user.learnerProfile?.skills?.forEach(addSkill);
    user.learnerProfile?.interests?.forEach(addSkill);
    user.mentorProfile?.expertise?.forEach(addSkill);
  }

  const sessions = await Session.find({}, 'topic').lean();
  sessions.forEach((s) => addSkill(s.topic));

  const connections = await Connection.find({}, 'sharedSkills').lean();
  connections.forEach((c) => c.sharedSkills?.forEach(addSkill));

  return [...skillCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

export const getAnalytics = asyncHandler(async (_req, res) => {
  const days = getLastNDays(DAYS);
  const rangeStart = days[0];

  const [users, sessions, connections, slots] = await Promise.all([
    User.find().lean(),
    Session.find().lean(),
    Connection.find().lean(),
    Slot.find().lean(),
  ]);

  const totalUsers = users.length;
  const learners = users.filter((u) => u.role === 'learner').length;
  const mentors = users.filter((u) => u.role === 'mentor').length;

  const activeUserIds = new Set();
  const registerByDay = countByDate(users.filter((u) => new Date(u.createdAt) >= rangeStart));

  for (const u of users) {
    if (new Date(u.createdAt) >= rangeStart || new Date(u.updatedAt) >= rangeStart) {
      activeUserIds.add(u._id.toString());
    }
  }

  const recentConnections = connections.filter((c) => new Date(c.createdAt) >= rangeStart);
  const recentSessions = sessions.filter((c) => new Date(c.createdAt) >= rangeStart);
  const recentSlots = slots.filter((s) => new Date(s.createdAt) >= rangeStart);

  for (const c of recentConnections) {
    activeUserIds.add(c.from.toString());
  }
  for (const s of recentSessions) {
    activeUserIds.add(s.learner.toString());
    activeUserIds.add(s.mentor.toString());
  }

  const activeUsersDaily = buildDailySeries(days, registerByDay);
  const activeUsers7d = activeUserIds.size;

  const connectionsByDay = countByDate(recentConnections);
  const sessionsByDay = countByDate(recentSessions);
  const slotsByDay = countByDate(recentSlots);

  const engagementDaily = days.map((day) => {
    const dateKey = toDateKey(day);
    return {
      date: dateKey,
      label: formatShortDate(dateKey),
      connections: connectionsByDay.get(dateKey) || 0,
      sessions: sessionsByDay.get(dateKey) || 0,
      slots: slotsByDay.get(dateKey) || 0,
      total:
        (connectionsByDay.get(dateKey) || 0) +
        (sessionsByDay.get(dateKey) || 0) +
        (slotsByDay.get(dateKey) || 0),
    };
  });

  const now = new Date();
  const scheduled = sessions.filter((s) => s.status === 'scheduled').length;
  const cancelled = sessions.filter((s) => s.status === 'cancelled').length;
  const completed = sessions.filter(
    (s) => s.status === 'scheduled' && new Date(s.endTime) < now
  ).length;
  const upcoming = sessions.filter(
    (s) => s.status === 'scheduled' && new Date(s.startTime) >= now
  ).length;

  const completedByDay = countByDate(
    sessions.filter(
      (s) => s.status === 'scheduled' && new Date(s.endTime) < now && new Date(s.endTime) >= rangeStart
    ),
    'endTime'
  );

  const sessionAttendance = {
    byStatus: [
      { name: 'Completed', value: completed, fill: '#4f46e5' },
      { name: 'Upcoming', value: upcoming, fill: '#6366f1' },
      { name: 'Cancelled', value: cancelled, fill: '#94a3b8' },
    ].filter((s) => s.value > 0),
    weekly: days.map((day) => {
      const dateKey = toDateKey(day);
      return {
        date: dateKey,
        label: formatShortDate(dateKey),
        booked: sessionsByDay.get(dateKey) || 0,
        attended: completedByDay.get(dateKey) || 0,
      };
    }),
  };

  const peerConnections = connections.filter((c) => c.matchType === 'peer').length;
  const mentorConnections = connections.filter((c) => c.matchType === 'mentor').length;

  const peerByDay = countByDate(connections.filter((c) => c.matchType === 'peer' && new Date(c.createdAt) >= rangeStart));
  const mentorConnByDay = countByDate(
    connections.filter((c) => c.matchType === 'mentor' && new Date(c.createdAt) >= rangeStart)
  );

  const collaborationDaily = days.map((day) => {
    const dateKey = toDateKey(day);
    return {
      date: dateKey,
      label: formatShortDate(dateKey),
      peer: peerByDay.get(dateKey) || 0,
      mentor: mentorConnByDay.get(dateKey) || 0,
    };
  });

  const trendingSkills = await aggregateSkills();

  res.json({
    summary: {
      totalUsers,
      activeUsers7d,
      learners,
      mentors,
      totalConnections: connections.length,
      totalSessions: sessions.length,
      engagementScore: recentConnections.length + recentSessions.length + recentSlots.length,
    },
    activeUsers: {
      daily: activeUsersDaily,
    },
    engagement: {
      daily: engagementDaily,
      breakdown: [
        { name: 'Connections', value: connections.length, fill: '#4f46e5' },
        { name: 'Sessions', value: sessions.length, fill: '#818cf8' },
        { name: 'Slots created', value: slots.length, fill: '#c7d2fe' },
      ].filter((b) => b.value > 0),
    },
    trendingSkills,
    sessionAttendance,
    collaborationTrends: {
      daily: collaborationDaily,
      byType: [
        { name: 'Peer', value: peerConnections, fill: '#10b981' },
        { name: 'Mentor', value: mentorConnections, fill: '#8b5cf6' },
      ].filter((t) => t.value > 0),
    },
  });
});
