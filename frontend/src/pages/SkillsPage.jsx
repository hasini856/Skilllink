import { useEffect, useState } from "react";

const SKILLS = [
{
name: "React Development",
blogs: [
{
title: "Official React Docs",
link: "https://react.dev",
},
{
title: "React Tutorial",
link: "https://www.freecodecamp.org/news/learn-react-js-in-this-crash-course/",
},
],
},

{
name: "Python Programming",
blogs: [
{
title: "Python Docs",
link: "https://docs.python.org/3/",
},
{
title: "Python Beginner Guide",
link: "https://www.w3schools.com/python/",
},
],
},

{
name: "Machine Learning",
blogs: [
{
title: "ML Crash Course",
link: "https://developers.google.com/machine-learning/crash-course",
},
],
},

{
name: "DevOps",
blogs: [
{
title: "DevOps Roadmap",
link: "https://roadmap.sh/devops",
},
],
},

{
name: "UI UX Design",
blogs: [
{
title: "UI UX Beginner Guide",
link: "https://careerfoundry.com/en/blog/ui-design/the-difference-between-ux-and-ui-design-a-laymans-guide/",
},
],
},

{
name: "Node.js",
blogs: [
{
title: "Node.js Docs",
link: "https://nodejs.org/en/docs",
},
],
},
];

function SkillsPage() {
const [query, setQuery] = useState("");
const [completed, setCompleted] = useState([]);

// ================= LOAD COMPLETED =================
useEffect(() => {
const saved =
JSON.parse(
localStorage.getItem("completedSkills")
) || [];

setCompleted(saved);
}, []);

// ================= SAVE COMPLETED =================
const markCompleted = (skill) => {
if (completed.includes(skill)) return;

const updated = [...completed, skill];

setCompleted(updated);

localStorage.setItem(
"completedSkills",
JSON.stringify(updated)
);
};

// ================= OPEN YOUTUBE =================
const openYouTube = (skill) => {
const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
skill + " tutorial full course"
)}`;

window.open(url, "_blank");
};

// ================= FILTER =================
const filtered = SKILLS.filter((skill) =>
skill.name
.toLowerCase()
.includes(query.toLowerCase())
);

// ================= PROGRESS =================
const progress = Math.min(
100,
(completed.length / SKILLS.length) * 100
);

return (
<section className="mx-auto max-w-5xl">
{/* HEADER */}
<div className="rounded-2xl bg-gradient-to-r from-primary-600 to-blue-600 p-6 text-white shadow-lg">
<h1 className="text-3xl font-bold">
Explore Skills
</h1>

<p className="mt-2 text-sm text-blue-100">
Learn trending technologies and grow
your career
</p>

{/* PROGRESS */}
<div className="mt-5">
<div className="flex items-center justify-between text-sm">
<span>Learning Progress</span>

<span>{Math.round(progress)}%</span>
</div>

<div className="mt-2 h-3 w-full rounded-full bg-white/20">
<div
className="h-3 rounded-full bg-white transition-all"
style={{
width: `${progress}%`,
}}
/>
</div>
</div>
</div>

{/* BADGES */}
<div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
<h2 className="text-lg font-bold text-slate-900">
Achievements
</h2>

<div className="mt-4 flex flex-wrap gap-3">
<span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
🤖 AI Explorer
</span>

{completed.length >= 1 && (
<span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
🚀 Fast Learner
</span>
)}

{completed.length >= 3 && (
<span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
🏆 Skill Master
</span>
)}
</div>
</div>

{/* SEARCH */}
<input
value={query}
onChange={(e) =>
setQuery(e.target.value)
}
placeholder="Search skills like React, Python, ML..."
className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
/>

{/* SKILLS */}
<div className="mt-8 grid gap-5 md:grid-cols-2">
{filtered.map((skill, index) => {
const isCompleted =
completed.includes(skill.name);

return (
<div
key={index}
className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:scale-[1.02] hover:shadow-xl"
>
{/* TITLE */}
<div className="flex items-center justify-between">
<h2 className="text-lg font-bold text-slate-900">
{skill.name}
</h2>

{isCompleted && (
<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
Completed
</span>
)}
</div>

<p className="mt-2 text-sm text-slate-500">
Learn with videos and curated
resources
</p>

{/* BUTTONS */}
<div className="mt-4 flex flex-wrap gap-2">
<button
onClick={() =>
openYouTube(skill.name)
}
className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
>
🎥 Videos
</button>

<button
onClick={() =>
markCompleted(skill.name)
}
className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
>
✅ Complete
</button>
</div>

{/* BLOGS */}
<div className="mt-5">
<p className="text-sm font-semibold text-slate-700">
📘 Learning Resources
</p>

<div className="mt-2 space-y-2">
{skill.blogs.map(
(blog, blogIndex) => (
<a
key={blogIndex}
href={blog.link}
target="_blank"
rel="noreferrer"
className="block rounded-lg border border-slate-200 px-3 py-2 text-sm text-primary-700 transition hover:bg-slate-50"
>
{blog.title}
</a>
)
)}
</div>
</div>
</div>
);
})}
</div>
</section>
);
}

export default SkillsPage;