const { generateWithRetry } = require("./gemini-helper");
async function generateSolutions(
    topic,
    company = "",
    role = ""
) {

    if (!topic) {
        throw new Error("Topic is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation teacher.

Generate exactly 5 practice questions with their detailed solutions.

Topic: ${topic}
Company: ${company || "General"}
Role: ${role || "General"}

Requirements:

1. Questions must be directly related to the given topic.
2. Questions should be useful for placement preparation.
3. Use simple and clear language.
4. Include a mixture of easy, medium and difficult questions.
5. Include theory, coding or practical questions when appropriate.
6. Give the correct answer for every question.
7. Give a clear step-by-step solution or explanation.
8. Do not repeat questions.
9. Do not ask unrelated questions.
10. Return ONLY valid JSON.

Use exactly this format:

{
  "topic": "${topic}",
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

            model: "gemini-2.5-flash",

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
            .replace(
                /^```json\s*/i,
                ""
            )
            .replace(
                /^```\s*/i,
                ""
            )
            .replace(
                /\s*```$/i,
                ""
            )
            .trim();

    }


    const data =
        JSON.parse(text);


    if (
        !data.solutions ||
        !Array.isArray(
            data.solutions
        )
    ) {

        throw new Error(
            "Invalid solution format returned by Gemini"
        );

    }


    if (
        data.solutions.length !== 5
    ) {

        throw new Error(
            "Gemini generated " +
            data.solutions.length +
            " solutions instead of 5"
        );

    }


    return data;

}


module.exports = {
    generateSolutions
};