import { useState } from "react";
import { api } from "../services/api.js";

function AIQuizPage() {
const [skill, setSkill] = useState("");
const [quiz, setQuiz] = useState([]);
const [loading, setLoading] = useState(false);
const [score, setScore] = useState(null);
const [answers, setAnswers] = useState({});

const generateQuiz = async () => {
try {
setLoading(true);

const data =
await api.generateQuiz(skill);

setQuiz(data.quiz || []);
setScore(null);

} catch (err) {
console.error(err);
} finally {
setLoading(false);
}
};

const handleSelect = (
questionIndex,
option
) => {
setAnswers((prev) => ({
...prev,
[questionIndex]: option,
}));
};

const submitQuiz = () => {
let total = 0;

quiz.forEach((q, index) => {
if (answers[index] === q.answer) {
total++;
}
});

setScore(total);
};

return (
<section className="mx-auto max-w-4xl">
<h1 className="text-3xl font-bold text-slate-900">
AI Quiz Generator
</h1>

<p className="mt-2 text-slate-600">
Generate AI-powered quizzes for any
skill
</p>

{/* INPUT */}
<div className="mt-6 flex gap-3">
<input
value={skill}
onChange={(e) =>
setSkill(e.target.value)
}
placeholder="Enter skill like React"
className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
/>

<button
onClick={generateQuiz}
className="rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white"
>
{loading
? "Generating..."
: "Generate"}
</button>
</div>

{/* QUIZ */}
<div className="mt-8 space-y-6">
{quiz.map((q, index) => (
<div
key={index}
className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
>
<h2 className="font-semibold text-slate-900">
{index + 1}. {q.question}
</h2>

<div className="mt-4 space-y-2">
{q.options.map((option, i) => (
<button
key={i}
onClick={() =>
handleSelect(
index,
option
)
}
className={`block w-full rounded-lg border px-4 py-2 text-left transition ${
answers[index] === option
? "border-primary-500 bg-primary-50"
: "border-slate-200 hover:bg-slate-50"
}`}
>
{option}
</button>
))}
</div>
</div>
))}
</div>

{/* SUBMIT */}
{quiz.length > 0 && (
<button
onClick={submitQuiz}
className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white"
>
Submit Quiz
</button>
)}

{/* SCORE */}
{score !== null && (
<div className="mt-6 rounded-xl bg-primary-50 p-5 text-center">
<h2 className="text-2xl font-bold text-primary-700">
Your Score: {score}/{quiz.length}
</h2>
</div>
)}
</section>
);
}

export default AIQuizPage;
