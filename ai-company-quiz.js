const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateCompanyQuiz(company, role) {

    const prompt = `
Generate exactly 10 multiple-choice placement quiz questions.

Company: ${company}
Role: ${role}

Requirements:
- Questions must be relevant to the company and role.
- Focus on technical placement preparation.
- Include programming, role-related concepts, problem solving and interview-level knowledge.
- Each question must have exactly 4 different options.
- Only one option must be correct.
- Do not repeat questions.
- Keep questions clear and suitable for a B.Tech student.

Return ONLY valid JSON in this format:

{
  "company": "${company}",
  "role": "${role}",
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Correct option",
      "explanation": "Short explanation"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt
    });

    let text = response.text;

    text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .trim();

    const data = JSON.parse(text);

    if (!data.questions || data.questions.length !== 10) {
        throw new Error("AI did not generate exactly 10 quiz questions");
    }

    data.questions.forEach((item, index) => {

        if (!item.question) {
            throw new Error(`Question ${index + 1} is missing`);
        }

        if (!Array.isArray(item.options) || item.options.length !== 4) {
            throw new Error(`Question ${index + 1} must have 4 options`);
        }

        if (!item.answer) {
            throw new Error(`Question ${index + 1} is missing an answer`);
        }

        if (!item.explanation) {
            item.explanation = "No explanation provided.";
        }
    });

    return data;
}

module.exports = {
    generateCompanyQuiz
};