export const formatMatch = (user, matchType, sharedSkills, connectionStatus) => {
  const base = {
    _id: user._id,
    name: user.name,
    role: user.role,
    matchType,
    sharedSkills,
    matchScore: sharedSkills.length,
    connectionStatus: connectionStatus || null,
  };

  if (matchType === 'peer') {
    base.profile = {
      skills: user.learnerProfile?.skills ?? [],
      interests: user.learnerProfile?.interests ?? [],
      goals: user.learnerProfile?.goals ?? '',
    };
  } else {
    base.profile = {
      expertise: user.mentorProfile?.expertise ?? [],
      experience: user.mentorProfile?.experience ?? '',
      availability: user.mentorProfile?.availability ?? '',
    };
  }

  return base;
};
