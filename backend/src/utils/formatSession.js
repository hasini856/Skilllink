export const formatSession = (session) => ({
  _id: session._id,
  topic: session.topic,
  startTime: session.startTime,
  endTime: session.endTime,
  status: session.status,
  reminderMinutes: session.reminderMinutes,
  reminderSent: session.reminderSent,
  mentor: session.mentor
    ? {
        _id: session.mentor._id,
        name: session.mentor.name,
      }
    : undefined,
  learner: session.learner
    ? {
        _id: session.learner._id,
        name: session.learner.name,
      }
    : undefined,
});

export const formatSlot = (slot) => ({
  _id: slot._id,
  topic: slot.topic,
  startTime: slot.startTime,
  endTime: slot.endTime,
  status: slot.status,
  mentor: slot.mentor
    ? {
        _id: slot.mentor._id,
        name: slot.mentor.name,
        profile: slot.mentor.mentorProfile
          ? {
              expertise: slot.mentor.mentorProfile.expertise ?? [],
            }
          : undefined,
      }
    : undefined,
});
