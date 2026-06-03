import Groq from "groq-sdk";

export const generateQuiz = async (req, res) => {
try {

// ✅ CREATE GROQ INSIDE FUNCTION
const groq = new Groq({
apiKey: process.env.GROQ_API_KEY,
});

const { skill } = req.body;

if (!skill) {
return res.status(400).json({
success: false,
message: "Skill is required",
});
}

const prompt = `
Generate 5 multiple choice quiz questions about ${skill}.

Return ONLY valid JSON in this format:

[
{
"question": "",
"options": ["", "", "", ""],
"answer": ""
}
]
`;

const response =
await groq.chat.completions.create({
model: "llama-3.1-8b-instant",

messages: [
{
role: "user",
content: prompt,
},
],

temperature: 0.7,
});

const text =
response.choices[0].message.content;

let quiz = [];

try {
quiz = JSON.parse(text);
} catch (err) {
console.error("JSON ERROR:", err);

return res.status(500).json({
success: false,
message: "AI returned invalid JSON",
});
}

res.json({
success: true,
quiz,
});

} catch (err) {
console.error(err);

res.status(500).json({
success: false,
message: err.message,
});
}
};