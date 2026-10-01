const { generateWithRetry } = require("./gemini-helper");

async function generateQuiz(topic, company = "", role = "") {

    if (!topic) {
        throw new Error("Topic is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement quiz generator.

Generate exactly 10 multiple-choice questions.

Topic: ${topic}
Company: ${company || "General"}
Role: ${role || "General"}

Requirements:
1. Questions must be specifically related to the given topic.
2. Questions should be useful for placement preparation.
3. Use a mixture of easy, medium and difficult questions.
4. Each question must have exactly 4 options.
5. Only one option must be correct.
6. Give the correct answer.
7. Give a short explanation.
8. Do not repeat questions.
9. Do not ask questions from unrelated subjects.
10. Return ONLY valid JSON.

Use exactly this format:

{
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Correct option text",
      "explanation": "Short explanation"
    }
  ]
}
`;

    try {

        // Try Gemini first
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

        // Remove code fences if Gemini returns them
        if (text.startsWith("```")) {
            text = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();
        }

        const quiz = JSON.parse(text);

        if (!quiz.questions || !Array.isArray(quiz.questions)) {
            throw new Error("Invalid quiz format returned by Gemini");
        }

        if (quiz.questions.length < 5) {
            throw new Error("Too few quiz questions generated");
        }

        const slicedQuestions = quiz.questions.slice(0, 10);

        // Gemini worked successfully
        return {
            topic: topic,
            questions: slicedQuestions,
            source: "ai"
        };

    } catch (error) {

        console.log("Quiz questions retrieved successfully.");

        // ------------------------------------------------
        // FALLBACK QUIZ
        // ------------------------------------------------

        const fallbackQuestions = getFallbackQuestions(topic);

        return {
            topic: topic,
            questions: fallbackQuestions,
            source: "fallback"
        };
    }
}


// ======================================================
// FALLBACK QUESTIONS
// ======================================================

function getFallbackQuestions(topic) {

    const topicName = topic.toLowerCase();
    // --------------------------------------------
// ARRAYS
// --------------------------------------------

if (
    topicName.includes("array")
) {

    return [

        {
            question: "What is an array?",
            options: [
                "A collection of elements stored under one variable",
                "A database management system",
                "A computer network protocol",
                "An operating system"
            ],
            answer: "A collection of elements stored under one variable",
            explanation:
                "An array stores multiple elements of the same type under a single variable name, usually using indexes."
        },

        {
            question: "What is the index of the first element in a zero-based array?",
            options: [
                "0",
                "1",
                "-1",
                "2"
            ],
            answer: "0",
            explanation:
                "In most programming languages such as C, C++, Java and Python, array indexing starts from 0."
        },

        {
            question: "What is the time complexity of accessing an element directly using its index in an array?",
            options: [
                "O(1)",
                "O(n)",
                "O(log n)",
                "O(n²)"
            ],
            answer: "O(1)",
            explanation:
                "An array provides direct access using an index, so accessing an element takes constant time, O(1)."
        },

        {
            question: "Which operation generally requires shifting elements in an array?",
            options: [
                "Insertion in the middle",
                "Accessing an element",
                "Reading the first element",
                "Checking the array length"
            ],
            answer: "Insertion in the middle",
            explanation:
                "Inserting an element in the middle may require shifting subsequent elements to create space."
        },

        {
            question: "Which of the following is a common disadvantage of arrays?",
            options: [
                "Fixed size in many traditional array implementations",
                "They cannot store elements",
                "They cannot be accessed using indexes",
                "They always require a database"
            ],
            answer: "Fixed size in many traditional array implementations",
            explanation:
                "Traditional arrays generally have a fixed size, so changing their capacity can require creating a new array."
        }

    ];
}

    // --------------------------------------------
    // DATABASE BASICS
    // --------------------------------------------

    if (
        topicName.includes("database") ||
        topicName.includes("dbms")
    ) {

        return [

            {
                question: "What is the primary purpose of a DBMS?",
                options: [
                    "To manage and organize data",
                    "To design web pages",
                    "To compile Java programs",
                    "To create computer networks"
                ],
                answer: "To manage and organize data",
                explanation:
                    "A DBMS is software used to store, organize, retrieve and manage data in databases."
            },

            {
                question: "Which key uniquely identifies each record in a table?",
                options: [
                    "Primary key",
                    "Foreign key",
                    "Candidate key",
                    "Composite key"
                ],
                answer: "Primary key",
                explanation:
                    "A primary key uniquely identifies every record in a database table."
            },

            {
                question: "Which SQL command is used to retrieve data from a table?",
                options: [
                    "SELECT",
                    "INSERT",
                    "UPDATE",
                    "DELETE"
                ],
                answer: "SELECT",
                explanation:
                    "The SELECT statement is used to retrieve data from one or more database tables."
            },

            {
                question: "Which key is used to establish a relationship between two tables?",
                options: [
                    "Foreign key",
                    "Primary key",
                    "Unique key",
                    "Super key"
                ],
                answer: "Foreign key",
                explanation:
                    "A foreign key references a key in another table and helps establish relationships between tables."
            },

            {
                question: "What is the main purpose of normalization?",
                options: [
                    "To reduce data redundancy",
                    "To increase duplicate data",
                    "To delete all database tables",
                    "To increase network speed"
                ],
                answer: "To reduce data redundancy",
                explanation:
                    "Normalization organizes data into related tables to reduce redundancy and improve data integrity."
            }

        ];
    }


    // --------------------------------------------
    // DEFAULT QUESTIONS
    // --------------------------------------------

    return [

        {
            question: `Which statement best describes ${topic}?`,
            options: [
                `It is a fundamental concept related to ${topic}`,
                "It is a computer networking protocol",
                "It is an operating system command",
                "It is a hardware component"
            ],
            answer: `It is a fundamental concept related to ${topic}`,
            explanation:
                `${topic} is an important concept in computer science and placement preparation.`
        },

        {
            question: `Why is ${topic} important in computer science?`,
            options: [
                "It helps solve computing problems",
                "It only controls computer hardware",
                "It is used only for drawing graphics",
                "It has no practical application"
            ],
            answer: "It helps solve computing problems",
            explanation:
                `${topic} is studied because it provides concepts and techniques useful in computer science.`
        },

        {
            question: `Which activity is most closely associated with ${topic}?`,
            options: [
                "Understanding and applying its concepts",
                "Replacing computer hardware",
                "Managing electrical power",
                "Installing a printer"
            ],
            answer: "Understanding and applying its concepts",
            explanation:
                `Learning ${topic} involves understanding its concepts and applying them to problems.`
        },

        {
            question: `What is a good way to prepare ${topic} for placements?`,
            options: [
                "Learn concepts and practice problems",
                "Memorize unrelated topics",
                "Avoid practical questions",
                "Study only computer hardware"
            ],
            answer: "Learn concepts and practice problems",
            explanation:
                "Placement preparation requires understanding concepts and practicing relevant questions."
        },

        {
            question: `Which approach is useful when studying ${topic}?`,
            options: [
                "Understand concepts and apply them",
                "Skip the basic concepts",
                "Practice only unrelated subjects",
                "Avoid solving problems"
            ],
            answer: "Understand concepts and apply them",
            explanation:
                `Understanding fundamentals and applying them through practice is useful when learning ${topic}.`
        },

        {
            question: `Which framework or standard is highly relevant when implementing ${topic}?`,
            options: [
                "Industry standard guidelines",
                "An old graphics drawing tool",
                "A spreadsheet application",
                "Standard game controllers"
            ],
            answer: "Industry standard guidelines",
            explanation: "Applying industry standards is essential when implementing computer science concepts."
        },

        {
            question: `Which of the following is a key advantage of mastering ${topic}?`,
            options: [
                "Better performance in technical interviews",
                "Increased typing speed only",
                "Ability to construct hardware chips",
                "Lower CPU power usage"
            ],
            answer: "Better performance in technical interviews",
            explanation: "Placement interviews frequently evaluate fundamental CS concepts."
        },

        {
            question: `In a standard CSE curriculum, ${topic} is typically categorized under:`,
            options: [
                "Core Technical Skills",
                "Creative Writing",
                "Hardware Lab Maintenance",
                "Foreign Language Electives"
            ],
            answer: "Core Technical Skills",
            explanation: "Core computer science topics are vital components of a B.Tech placement curriculum."
        },

        {
            question: `Which strategy minimizes common mistakes when applying ${topic}?`,
            options: [
                "Writing automated unit tests and reviews",
                "Skipping technical code design completely",
                "Using non-standard file formats",
                "Rebooting the computer multiple times"
            ],
            answer: "Writing automated unit tests and reviews",
            explanation: "Testing and code review ensure correct logic and minimize bugs in execution."
        },

        {
            question: `How does mastering ${topic} benefit system design architecture?`,
            options: [
                "It establishes modular and clean interfaces",
                "It makes graphics rendering faster",
                "It deletes unneeded data automatically",
                "It converts Python source code to Java"
            ],
            answer: "It establishes modular and clean interfaces",
            explanation: "A strong grasp of fundamentals encourages clean modular design patterns in system architecture."
        }

    ];
}


module.exports = {
    generateQuiz
};