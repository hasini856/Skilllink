export const normalize = (s) => (s || '').toLowerCase().trim();

export const calculateMatchScore = (userSkills = [], targetSkills = []) => {
  const a = userSkills.map(normalize).filter(Boolean);
  const b = targetSkills.map(normalize).filter(Boolean);

  const setA = new Set(a);
  const setB = new Set(b);

  let common = [];

  for (const skill of setA) {
    if (setB.has(skill)) {
      common.push(skill);
    }
  }

  const totalUnique = new Set([...a, ...b]).size || 1;

  const score = Math.round((common.length / totalUnique) * 100);

  return {
    score,
    commonSkills: common,
  };
};