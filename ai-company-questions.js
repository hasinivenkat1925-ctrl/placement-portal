const { generateWithRetry } = require("./gemini-helper");
async function generateCompanyQuestions(
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

Generate exactly 5 placement preparation questions.

Company: ${company}
Role: ${role}

Requirements:

1. Questions must be relevant to the selected company and role.
2. Focus on concepts commonly useful for placement preparation for this role.
3. Include technical and coding-related questions where appropriate.
4. Questions should have different difficulty levels.
5. Do not generate unrelated questions.
6. Do not repeat questions.
7. Give a clear answer for every question.
8. Give a short explanation for every answer.
9. Return ONLY valid JSON.

Use exactly this format:

{
    "company": "${company}",
    "role": "${role}",
    "questions": [
        {
            "question": "Question text",
            "answer": "Correct answer",
            "explanation": "Short explanation"
        }
    ]
}
`;

    // =========================================
    // GEMINI REQUEST WITH AUTOMATIC RETRY
    // =========================================

    let response;
    let lastError;

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            console.log(
                `Gemini company questions attempt ${attempt}/3`
            );

           response =
    await generateWithRetry({

                    model: "gemini-3.1-flash-lite",

                    contents: prompt,

                    config: {
                        responseMimeType: "application/json"
                    }

                });

            // Success
            break;

        } catch (error) {

            lastError = error;

            const errorText =
                String(error.message || error);

            const is503 =
                errorText.includes("503") ||
                errorText.includes("UNAVAILABLE") ||
                errorText.includes("high demand") ||
                errorText.includes("overloaded");

            console.log(
                "Gemini error:",
                errorText
            );

            // If it is not a temporary overload error,
            // stop immediately.
            if (!is503) {
                throw error;
            }

            // If this was the last attempt,
            // return the final error.
            if (attempt === 3) {
                break;
            }

            // Wait before trying again.
            const delay =
                attempt === 1
                    ? 2000
                    : 5000;

            console.log(
                `Gemini temporarily unavailable. Retrying in ${delay / 1000} seconds...`
            );

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }

    // If all 3 attempts failed
    if (!response) {

        throw new Error(
            "Gemini service is temporarily unavailable after 3 attempts. Please try again."
        );
    }

    // =========================================
    // READ GEMINI RESPONSE
    // =========================================

    let text = response.text;

    if (!text) {
        throw new Error(
            "Gemini returned an empty response"
        );
    }

    text = text.trim();

    // Remove markdown code fences if Gemini adds them
    if (text.startsWith("```")) {

        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

    }

    // Remove invalid control characters
    text = text.replace(
        /[\u0000-\u001F\u007F]/g,
        " "
    );

    // Convert JSON text into JavaScript object
    const data =
        JSON.parse(text);

    // =========================================
    // VALIDATE RESPONSE
    // =========================================

    if (
        !data.questions ||
        !Array.isArray(data.questions)
    ) {

        throw new Error(
            "Invalid company questions format"
        );
    }

    if (data.questions.length !== 5) {

        throw new Error(
            "Gemini generated " +
            data.questions.length +
            " questions instead of 5"
        );
    }

    return data;
}

module.exports = {
    generateCompanyQuestions
};