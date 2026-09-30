const { generateWithRetry } = require("./gemini-helper");

const fallbackQuestionsMap = {
    "Java Developer": [
        { question: "Which collection in Java does not allow duplicate elements?", options: ["HashSet", "ArrayList", "LinkedList", "Vector"], answer: "HashSet", explanation: "HashSet implements the Set interface, which stores only unique elements." },
        { question: "Which keyword is used to prevent method overriding in Java?", options: ["final", "static", "private", "abstract"], answer: "final", explanation: "A final method cannot be overridden by subclasses." },
        { question: "What is the default initial capacity of an ArrayList in Java?", options: ["10", "16", "0", "8"], answer: "10", explanation: "When created without arguments, ArrayList has a default capacity of 10." },
        { question: "Which feature of OOP promotes code reusability?", options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"], answer: "Inheritance", explanation: "Inheritance allows subclasses to reuse properties and methods of the superclass." },
        { question: "Which memory area stores Java objects?", options: ["Heap memory", "Stack memory", "Method area", "Native method stack"], answer: "Heap memory", explanation: "All class instances and arrays in Java are allocated in the heap." }
    ],
    "default": [
        { question: "Which data structure operates on a Last In First Out (LIFO) basis?", options: ["Stack", "Queue", "Array", "Linked List"], answer: "Stack", explanation: "A stack removes elements in the reverse order of insertion (LIFO)." },
        { question: "What is the average time complexity of searching in a Hash Table?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: "O(1)", explanation: "Hash tables offer constant time complexity O(1) for average lookups." },
        { question: "Which SQL clause is used to filter records after aggregation?", options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"], answer: "HAVING", explanation: "HAVING filters groups created by GROUP BY, while WHERE filters individual rows." },
        { question: "Which concept allows an entity to take on multiple forms?", options: ["Polymorphism", "Encapsulation", "Inheritance", "Abstraction"], answer: "Polymorphism", explanation: "Polymorphism means 'many forms', enabling the same interface to handle different underlying data types." },
        { question: "Which sorting algorithm has a worst-case time complexity of O(n log n)?", options: ["Merge Sort", "Bubble Sort", "Quick Sort", "Insertion Sort"], answer: "Merge Sort", explanation: "Merge Sort consistently divides the input in half and merges, guaranteeing O(n log n) time." }
    ]
};

async function generateCompanyQuiz(company, role) {

    const prompt = `
Generate exactly 5 multiple-choice placement quiz questions.

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

    try {
        const response = await generateWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        let text = response.text;

        text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .replace(/[\u0000-\u001F\u007F]/g, " ")
            .trim();

        const data = JSON.parse(text);

        if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error("AI did not generate quiz questions");
        }

        return data;
    } catch (error) {
        console.warn("AI company quiz fallback active:", error.message);
        const questions = fallbackQuestionsMap[role] || fallbackQuestionsMap["default"];
        return {
            company: company,
            role: role,
            questions: questions,
            source: "fallback"
        };
    }
}

module.exports = {
    generateCompanyQuiz
};
