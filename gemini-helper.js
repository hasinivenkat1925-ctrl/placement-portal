const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

let ai = null;

function getAI() {
    if (!ai) {
        const apiKey = process.env.GEMINI_API_KEY;
        const config = {
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build'
                }
            }
        };
        if (apiKey) {
            config.apiKey = apiKey;
        }
        ai = new GoogleGenAI(config);
    }
    return ai;
}

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function generateWithRetry(options) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return null;
    }

    const client = getAI();
    const model = options.model || "gemini-2.5-flash";

    const requestOptions = {
        ...options,
        model: model
    };

    let lastError;

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await client.models.generateContent(requestOptions);
            return response;
        } catch (error) {
            lastError = error;
            const errorText = String(error.message || error);

            if (
                errorText.includes("API_KEY_INVALID") ||
                errorText.includes("API key not valid") ||
                errorText.includes("INVALID_ARGUMENT") ||
                errorText.includes("400")
            ) {
                return null;
            }

            const temporaryError =
                errorText.includes("503") ||
                errorText.includes("UNAVAILABLE") ||
                errorText.includes("overloaded") ||
                errorText.includes("high demand") ||
                errorText.includes("429") ||
                errorText.includes("500") ||
                errorText.includes("502") ||
                errorText.includes("504");

            if (!temporaryError) {
                return null;
            }

            if (attempt === 3) {
                break;
            }

            const delay = attempt === 1 ? 1000 : 2000;
            await wait(delay);
        }
    }

    return null;
}

module.exports = {
    generateWithRetry
};
