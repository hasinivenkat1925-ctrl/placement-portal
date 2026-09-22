const { generateWithRetry } = require("./gemini-helper");

async function generatePracticeQuestions(
    topic,
    company = "",
    role = ""
) {

    if (!topic) {
        throw new Error("Topic is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation teacher.

Generate exactly 5 practice questions.

Topic: ${topic}
Company: ${company || "General"}
Role: ${role || "General"}

Requirements:

1. Questions must be directly related to the given topic.
2. Questions should be useful for placement preparation.
3. Use simple and clear language.
4. Include a mixture of easy, medium and difficult questions.
5. Questions can include theory, coding or practical concepts when appropriate.
6. Do not repeat questions.
7. Do not ask unrelated questions.
8. Give a correct answer.
9. Give a short explanation for every answer.
10. Return ONLY valid JSON.

Use exactly this format:

{
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question text",
      "answer": "Correct answer",
      "explanation": "Short explanation"
    }
  ]
}
`;

    const response =
    await generateWithRetry({

            model: "gemini-3.5-flash-lite",

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


    const questions =
        JSON.parse(text);


    if (
        !questions.questions ||
        !Array.isArray(
            questions.questions
        )
    ) {

        throw new Error(
            "Invalid practice question format returned by Gemini"
        );

    }


    if (
        questions.questions.length !== 5
    ) {

        throw new Error(
            "Gemini generated " +
            questions.questions.length +
            " questions instead of 5"
        );

    }


    return questions;

}


module.exports = {
    generatePracticeQuestions
};