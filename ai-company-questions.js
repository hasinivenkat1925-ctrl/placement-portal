const { generateWithRetry } = require("./gemini-helper");

const fallbackCompanyQuestions = {
    "Java Developer": [
        { question: "What is the difference between Comparable and Comparator in Java?", answer: "Comparable provides single natural ordering with compareTo(); Comparator provides multiple custom sort orders with compare().", explanation: "Comparable is implemented by the domain class itself; Comparator is implemented in a separate class or lambda." },
        { question: "How does HashMap work internally in Java?", answer: "It uses an array of buckets, hashing the key to determine bucket index, and uses linked lists or red-black trees for collision resolution.", explanation: "Java 8 converts linked list chains to balanced trees once threshold exceeds 8 elements." },
        { question: "What is the difference between String, StringBuilder, and StringBuffer?", answer: "String is immutable; StringBuilder is mutable and not thread-safe (fastest); StringBuffer is mutable and thread-safe (synchronized).", explanation: "For frequent string modifications in single-threaded contexts, StringBuilder is preferred." },
        { question: "Explain the purpose of the final, finally, and finalize keywords in Java.", answer: "final is an access modifier; finally is a block associated with try-catch that always executes; finalize is a deprecated garbage collection method.", explanation: "final applies to variables, methods, and classes; finally is for resource cleanup." },
        { question: "What is Dependency Injection in Spring?", answer: "A design pattern where an object receives its dependencies from an external container (IoC) rather than creating them itself.", explanation: "DI decouples object creation from business logic, promoting modularity and unit testability." }
    ],
    "default": [
        { question: "Explain the difference between process and thread.", answer: "A process is an independent execution unit with its own address space, while a thread is a lightweight execution unit sharing the process memory.", explanation: "Threads share code, data, and OS resources of the parent process, minimizing context switching overhead." },
        { question: "What is an index in a database and what are its pros and cons?", answer: "An index is a data structure (commonly B-tree) that speeds up data retrieval operations at the cost of additional storage and slower writes.", explanation: "Indexes optimize SELECT queries but add overhead to INSERT, UPDATE, and DELETE operations." },
        { question: "What is the difference between TCP and UDP?", answer: "TCP is connection-oriented, reliable, and guarantees in-order delivery; UDP is connectionless, faster, with no delivery guarantee.", explanation: "TCP is used for web traffic and files; UDP is used for live streaming and gaming." },
        { question: "What are ACID properties in database transactions?", answer: "Atomicity (all or nothing), Consistency (valid state transitions), Isolation (independent transactions), Durability (persisted changes).", explanation: "ACID guarantees that database transactions are processed reliably." },
        { question: "What is the difference between BFS and DFS?", answer: "BFS explores level by level using a Queue; DFS explores as deep as possible along each branch using a Stack or recursion.", explanation: "BFS finds the shortest path in unweighted graphs; DFS is useful for cycle detection and topological sorting." }
    ]
};

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

    try {
        const response = await generateWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        let text = response.text ? response.text.trim() : "";

        if (text.startsWith("```")) {
            text = text
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();
        }

        text = text.replace(/[\u0000-\u001F\u007F]/g, " ");

        const data = JSON.parse(text);

        if (data && Array.isArray(data.questions) && data.questions.length > 0) {
            return {
                company: company,
                role: role,
                questions: data.questions,
                source: "ai"
            };
        }

        throw new Error("Invalid questions structure");
    } catch (error) {
        console.warn("AI company questions fallback active:", error.message);
        const questions = fallbackCompanyQuestions[role] || fallbackCompanyQuestions["default"];
        return {
            company: company,
            role: role,
            questions: questions,
            source: "fallback"
        };
    }
}

module.exports = {
    generateCompanyQuestions
};
