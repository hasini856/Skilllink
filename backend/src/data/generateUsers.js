const skillsPool = [
  "React",
  "Node",
  "MongoDB",
  "Java",
  "Python",
  "AI",
  "Machine Learning",
  "JavaScript",
  "Express",
  "UI UX",
  "Figma",
  "SQL",
  "Spring Boot",
  "Data Science",
  "Cyber Security",
];

const names = [
  "Aarav",
  "Priya",
  "Rahul",
  "Sneha",
  "Kiran",
  "Megha",
  "Varun",
  "Ananya",
  "Rohit",
  "Pooja",
  "Arjun",
  "Neha",
  "Vikram",
  "Ishita",
  "Nikhil",
  "Divya",
];

const getRandomSkills = () => {
  const shuffled = [...skillsPool].sort(
    () => 0.5 - Math.random()
  );

  return shuffled.slice(0, 3);
};

export const generateUsers = (count = 100) => {
  const users = [];

  for (let i = 1; i <= count; i++) {
    const randomName =
      names[
        Math.floor(Math.random() * names.length)
      ];

    users.push({
      name: `${randomName}${i}`,

      email: `user${i}@gmail.com`,

      role:
        i % 2 === 0
          ? "mentor"
          : "learner",

      skills: getRandomSkills(),
    });
  }

  return users;
};