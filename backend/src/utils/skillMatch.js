export const normalizeSkill = (skill) => skill.toLowerCase().trim();

export const normalizeSkills = (skills = []) =>
  [...new Set(skills.map(normalizeSkill).filter(Boolean))];

export const getSharedSkills = (sourceSkills, targetSkills) => {
  const normalizedTarget = normalizeSkills(targetSkills);
  const targetSet = new Set(normalizedTarget);

  const shared = [];
  const seen = new Set();

  for (const skill of sourceSkills) {
    const normalized = normalizeSkill(skill);
    if (!normalized || !targetSet.has(normalized) || seen.has(normalized)) continue;
    seen.add(normalized);
    const display =
      targetSkills.find((t) => normalizeSkill(t) === normalized) ||
      skill;
    shared.push(display);
  }

  return shared;
};

export const getLearnerMatchTargets = (user) => {
  const skills = user.learnerProfile?.skills ?? [];
  const interests = user.learnerProfile?.interests ?? [];
  return { skills, targets: normalizeSkills([...skills, ...interests]) };
};
