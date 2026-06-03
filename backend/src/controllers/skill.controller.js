let skills = [
  {
    id: 1,
    name: 'React Development',
    category: 'Frontend',
    mentors: 12,
    description: 'Build modern UI using React and components.',
  },
  {
    id: 2,
    name: 'Python Programming',
    category: 'Programming',
    mentors: 18,
    description: 'Learn Python for backend and AI.',
  },
  {
    id: 3,
    name: 'Machine Learning',
    category: 'AI',
    mentors: 8,
    description: 'Supervised learning and deep learning models.',
  },
];

// GET ALL
export const getSkills = (req, res) => {
  res.json(skills);
};

// GET BY ID
export const getSkillById = (req, res) => {
  const skill = skills.find((s) => s.id == req.params.id);

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }

  res.json(skill);
};

// CREATE
export const createSkill = (req, res) => {
  const newSkill = {
    id: skills.length + 1,
    ...req.body,
  };

  skills.push(newSkill);

  res.status(201).json(newSkill);
};