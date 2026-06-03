export const formatUser = (user) => {
  const formatted = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
  };

  if (user.role === 'learner') {
    formatted.profile = {
      skills: user.learnerProfile?.skills ?? [],
      interests: user.learnerProfile?.interests ?? [],
      goals: user.learnerProfile?.goals ?? '',
    };
  } else {
    formatted.profile = {
      expertise: user.mentorProfile?.expertise ?? [],
      experience: user.mentorProfile?.experience ?? '',
      availability: user.mentorProfile?.availability ?? '',
    };
  }

  return formatted;
};
