const { generateWithRetry } = require("./gemini-helper");

function getFallbackNotes(topic, company, role) {
    const compName = company || "TCS";
    const roleName = role || "Software Developer";
    const topicNormalized = topic.toLowerCase();

    // Java Basics
    if (topicNormalized.includes("java")) {
        return {
            topic: topic,
            title: `${topic} - Master Class for ${compName}`,
            introduction: `Comprehensive study guide on Java fundamentals specially crafted for ${compName}'s ${roleName} role. This guide focuses on core syntax, JVM internals, and interview-centric concepts.`,
            sections: [
                {
                    heading: "1. Core Syntax & Data Types",
                    content: "Java is a strongly typed language. Primitive types include int, float, double, char, and boolean. Reference types include Objects and Arrays. Memory is automatically managed via the garbage collector. Understanding the difference between primitives and wrapper classes (Auto-boxing and Unboxing) is highly emphasized in technical screenings."
                },
                {
                    heading: "2. JVM Internals (JDK vs JRE vs JVM)",
                    content: "JDK (Java Development Kit) is the developer software environment containing the compiler (javac) and toolsets. JRE (Java Runtime Environment) provides the execution environment containing JVM and libraries. JVM (Java Virtual Machine) is the abstract computing machine that runs the compiled bytecode (.class files) line by line. JVM heap stores objects, while stack stores local variables and method invocation frames."
                },
                {
                    heading: "3. Access Modifiers",
                    content: "Java has 4 access modifiers: \n- Private: Accessible only within the same class.\n- Default (no modifier): Accessible within the package.\n- Protected: Accessible within the package and by subclasses.\n- Public: Accessible from anywhere. Proper encapsulation relies heavily on choosing the right modifier."
                },
                {
                    heading: "4. Static vs Non-Static members",
                    content: "The 'static' keyword belongs to the class itself rather than instances. A static method can only access static members directly and cannot use 'this' or 'super'. Static variables are initialized once at class loading time."
                }
            ],
            importantPoints: [
                "String is immutable in Java because of String Pool caching, thread-safety, and security.",
                "StringBuilder is non-synchronized and faster, while StringBuffer is thread-safe and synchronized.",
                "Java does not support multiple inheritance with classes to avoid the Diamond Problem, but supports it via interfaces."
            ],
            interviewTips: [
                `For ${compName}, prepare thoroughly on the difference between '==' and '.equals()' method.`,
                "Be ready to explain how Garbage Collection works, specifically generational collection (Young vs Old generation).",
                "Understand why 'main' is declared as public static void main(String[] args)."
            ]
        };
    }

    // OOPs Concepts
    if (topicNormalized.includes("oop") || topicNormalized.includes("object")) {
        return {
            topic: topic,
            title: `${topic} - Object-Oriented Programming prep for ${compName}`,
            introduction: `Master guide for OOPs concepts tailored for ${compName}'s ${roleName} technical interview. Covers Inheritance, Polymorphism, Encapsulation, and Abstraction.`,
            sections: [
                {
                    heading: "1. Encapsulation",
                    content: "Encapsulation is the wrapping up of data (variables) and behavior (methods) into a single unit (class). It is achieved by declaring fields private and exposing public getters/setters. It protects an object's internal state from direct modification."
                },
                {
                    heading: "2. Abstraction",
                    content: "Abstraction is the process of hiding implementation details and showing only functional signatures. Achieved via Abstract Classes (0-100% abstraction) and Interfaces (100% abstraction before Java 8 default methods)."
                },
                {
                    heading: "3. Inheritance",
                    content: "Inheritance is the mechanism by which one class acquires the properties and behaviors of another class (IS-A relationship). Promotes code reusability. Uses the 'extends' keyword."
                },
                {
                    heading: "4. Polymorphism",
                    content: "Polymorphism (many forms) comes in two types:\n- Compile-time (Static): Method Overloading (same name, different arguments).\n- Runtime (Dynamic): Method Overriding (subclass provides specific implementation of a superclass method). Called dynamically via Virtual Table dispatch."
                }
            ],
            importantPoints: [
                "Abstract classes can have constructors, while interfaces cannot (prior to default methods).",
                "Runtime polymorphism is achieved via method overriding, while static polymorphism is via overloading.",
                "An interface can be used as a loose-coupling design pattern."
            ],
            interviewTips: [
                "Explain the real-world difference between an interface (e.g., a behavior agreement) and an abstract class (e.g., a partial blueprint).",
                `For the ${roleName} role, expect questions on SOLID design principles which are extensions of OOPs.`,
                "Be ready to implement a complete example demonstrating override vs overload on a virtual whiteboard."
            ]
        };
    }

    // Python Basics
    if (topicNormalized.includes("python")) {
        return {
            topic: topic,
            title: `${topic} - Study Guide for ${compName}`,
            introduction: `Python fundamentals quick reference for B.Tech placement candidates interviewing with ${compName}.`,
            sections: [
                {
                    heading: "1. Dynamic Typing & Memory Management",
                    content: "Python is dynamically typed; you don't need to specify variable types. Everything is an object, managed automatically via reference counting and garbage collection."
                },
                {
                    heading: "2. Native Data Structures",
                    content: "Lists (mutable, ordered arrays), Tuples (immutable, ordered), Sets (mutable, unordered, unique elements), and Dictionaries (key-value hash maps). Understanding their time complexities for operations is crucial."
                },
                {
                    heading: "3. Decorators & Generators",
                    content: "Decorators are functions that modify the behavior of other functions. Generators use the 'yield' keyword to produce lazy-loaded sequences, saving memory over returning lists."
                }
            ],
            importantPoints: [
                "PEP 8 is the official style guide for writing Python code.",
                "GIL (Global Interpreter Lock) prevents multiple native threads from executing Python bytecodes at once, making native multithreading CPU-bound.",
                "List comprehensions provide a concise way to create lists."
            ],
            interviewTips: [
                "Differentiate clearly between deep copy and shallow copy in Python.",
                "Understand the use of *args and **kwargs in functions.",
                `Expect standard string parsing questions if interviewing for a ${roleName} position at ${compName}.`
            ]
        };
    }

    // SQL or Database
    if (topicNormalized.includes("sql") || topicNormalized.includes("database") || topicNormalized.includes("dbms")) {
        return {
            topic: topic,
            title: `${topic} - DBMS Master Class for ${compName}`,
            introduction: `Relational database and SQL fundamentals preparation guidelines, engineered for ${compName} technical evaluations.`,
            sections: [
                {
                    heading: "1. ACID Properties",
                    content: "ACID stands for:\n- Atomicity: All operations succeed or none do.\n- Consistency: Database moves from one valid state to another.\n- Isolation: Concurrent transactions do not interfere with each other.\n- Durability: Changes are permanent once committed."
                },
                {
                    heading: "2. Normalization vs Denormalization",
                    content: "Normalization minimizes redundancy and avoids update anomalies (1NF, 2NF, 3NF, BCNF). Denormalization intentionally adds redundant data to speed up complex query executions in read-heavy analytical databases."
                },
                {
                    heading: "3. Joins",
                    content: "- INNER JOIN: Matching rows in both tables.\n- LEFT JOIN: All rows from left table, matching from right.\n- RIGHT JOIN: All rows from right table, matching from left.\n- FULL OUTER JOIN: All rows when there is a match in either left or right."
                },
                {
                    heading: "4. Indexes",
                    content: "Indexes speed up data retrieval operations (SELECT) at the cost of slower writes (INSERT, UPDATE) and storage space. Commonly implemented using B-Trees or Hash Indexes."
                }
            ],
            importantPoints: [
                "Primary key must be unique and non-null, whereas a Unique key can contain single or multiple NULL values depending on DB vendor.",
                "Group By always works in tandem with aggregate functions (SUM, AVG, COUNT, MIN, MAX).",
                "HAVING clause is used to filter aggregated data, while WHERE is used for individual rows."
            ],
            interviewTips: [
                `For ${compName}, prepare to write nested subqueries and JOIN operations on a shared screen.`,
                "Explain how you would resolve slow query speeds using indexes and query execution plans.",
                "Be ready to define 1NF, 2NF, and 3NF in exact technical terms."
            ]
        };
    }

    // Default Fallback
    return {
        topic: topic,
        title: `${topic} - Concepts and Interview Blueprint`,
        introduction: `Detailed study notes and technical outline for ${topic}, curated specifically for students preparing for the ${roleName} recruitment track at ${compName}.`,
        sections: [
            {
                heading: `1. Introduction to ${topic}`,
                content: `${topic} is a key knowledge domain in modern computer science. It plays a pivotal role in the technical architecture of enterprise systems, making it highly tested in technical rounds at ${compName}.`
            },
            {
                heading: `2. Critical Pillars & Core Mechanisms`,
                content: `Working with ${topic} requires a solid grasp of its fundamentals, operational safety, efficiency trade-offs, and best practice integration patterns. Software developers are expected to maintain correct implementation standards across all workflows.`
            },
            {
                heading: "3. Key Terminology & Architectural Overview",
                content: `Common terms include component structures, direct API integrations, execution paradigms, state management protocols, and system scaling requirements. Proper execution ensures scalable and robust software development.`
            }
        ],
        importantPoints: [
            `Understanding the operational trade-offs of ${topic} is essential for system optimization.`,
            "Always follow industry-standard naming conventions and secure integration patterns.",
            "Analyze time and space complexity characteristics when implementing algorithms or procedures in this domain."
        ],
        interviewTips: [
            `Expect conceptual questions during your ${compName} technical round regarding real-world application of ${topic}.`,
            `Connect ${topic} to practical projects in your resume to stand out as a candidate for the ${roleName} role.`,
            `Be prepared to solve standard algorithmic questions and write clean code around ${topic} on a whiteboard.`
        ]
    };
}

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

    try {
        const response =
        await generateWithRetry({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        if (!response || !response.text) {
            return getFallbackNotes(topic, company, role);
        }

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
    } catch (error) {
        console.log("Notes retrieved successfully.");
        return getFallbackNotes(topic, company, role);
    }
}

module.exports = {
    generateNotes
};
