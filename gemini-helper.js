const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function generateWithRetry(options) {

    let lastError;

    for (let attempt = 1; attempt <= 3; attempt++) {

        try {

            console.log(
                `Gemini request attempt ${attempt}/3`
            );

            const response =
                await ai.models.generateContent(options);

            console.log(
                "Gemini request successful"
            );

            return response;

        } catch (error) {

            lastError = error;

            const errorText =
                String(error.message || error);

            console.log(
                "Gemini request error:",
                errorText
            );

            const temporaryError =
                errorText.includes("503") ||
                errorText.includes("UNAVAILABLE") ||
                errorText.includes("overloaded") ||
                errorText.includes("high demand") ||
                errorText.includes("500") ||
                errorText.includes("502") ||
                errorText.includes("504");

            if (!temporaryError) {
                throw error;
            }

            if (attempt === 3) {
                break;
            }

            const delay =
                attempt === 1
                    ? 2000
                    : 5000;

            console.log(
                `Retrying Gemini in ${delay / 1000} seconds...`
            );

            await wait(delay);
        }
    }

    throw new Error(
        "Gemini service is temporarily unavailable after 3 attempts. " +
        (lastError?.message || "")
    );
}

module.exports = {
    generateWithRetry
};