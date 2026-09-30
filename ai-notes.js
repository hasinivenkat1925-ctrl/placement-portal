const { generateWithRetry } = require("./gemini-helper");
async function generateNotes(topic, company = "", role = "") {

    if (!topic) {
        throw new Error("Topic is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation teacher.

Create clear and useful study notes for:

Topic: ${topic}
Company: ${company || "General"}
Role: ${role || "General"}

Requirements:
1. Explain the topic in simple language.
2. Cover the important concepts needed for placements.
3. Include important definitions.
4. Include examples where useful.
5. Include important interview points.
6. Include common mistakes.
7. Do not include unrelated subjects.
8. Keep the content well structured.
9. Return ONLY valid JSON.

Use exactly this format:

{
  "topic": "${topic}",
  "title": "${topic} - Placement Notes",
  "introduction": "Short introduction",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Clear explanation"
    }
  ],
  "importantPoints": [
    "Important point 1",
    "Important point 2"
  ],
  "interviewTips": [
    "Interview tip 1",
    "Interview tip 2"
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
        throw new Error("Gemini returned an empty response");
    }

    text = text.trim();

    if (text.startsWith("```")) {
        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
    }

    const notes = JSON.parse(text);

    if (!notes.sections || !Array.isArray(notes.sections)) {
        throw new Error("Invalid notes format returned by Gemini");
    }

    return notes;
}

module.exports = {
    generateNotes
};