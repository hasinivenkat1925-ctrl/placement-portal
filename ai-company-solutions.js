const { generateWithRetry } = require("./gemini-helper");
async function generateCompanySolutions(
    company,
    role
) {

    if (!company) {
        throw new Error("Company is required");
    }

    if (!role) {
        throw new Error("Role is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation assistant.

Generate exactly 5 placement questions with answers and detailed solutions.

Company: ${company}
Role: ${role}

Requirements:

1. Questions must be relevant to the selected company and role.
2. Focus on technical placement preparation.
3. Include programming, database, data structures,
   computer science or other role-relevant concepts.
4. Use a mixture of easy, medium and difficult questions.
5. Do not generate unrelated questions.
6. Do not repeat questions.
7. Give the correct answer.
8. Give a clear step-by-step solution or explanation.
9. Keep solutions understandable for a B.Tech student.
10. Return ONLY valid JSON.

Use exactly this format:

{
    "company": "${company}",
    "role": "${role}",
    "solutions": [
        {
            "question": "Question text",
            "answer": "Correct answer",
            "solution": "Detailed but easy-to-understand solution"
        }
    ]
}
`;

    const response =
    await generateWithRetry({
            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
                responseMimeType: "application/json"
            }

        });

    let text = response.text;

    if (!text) {
        throw new Error(
            "Gemini returned an empty response"
        );
    }

    text = text.trim();

    if (text.startsWith("```")) {

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

    }

    text = text.replace(
        /[\u0000-\u001F\u007F]/g,
        " "
    );

    const data =
        JSON.parse(text);

    if (
        !data.solutions ||
        !Array.isArray(data.solutions)
    ) {
        throw new Error(
            "Invalid company solutions format"
        );
    }

    if (data.solutions.length !== 5) {
        throw new Error(
            "Gemini generated " +
            data.solutions.length +
            " solutions instead of 5"
        );
    }

    return data;
}

module.exports = {
    generateCompanySolutions
};