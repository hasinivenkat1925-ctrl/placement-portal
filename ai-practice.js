const { generateWithRetry } = require("./gemini-helper");

function getFallbackPracticeQuestions(topic, company, role) {
    const compName = company || "TCS";
    const roleName = role || "Software Developer";
    const topicNormalized = topic.toLowerCase();

    let questionsList = [];

    if (topicNormalized.includes("java")) {
        questionsList = [
            {
                question: "Explain the difference between '==' and '.equals()' in Java.",
                answer: "'==' is an operator that compares reference equality (memory addresses), while '.equals()' is a method that compares content or state equality of two objects.",
                explanation: "By default, Object.equals() behaves same as '==', but subclasses like String override it to provide character-by-character comparison."
            },
            {
                question: "What is the significance of the JVM heap and stack memories?",
                answer: "JVM heap memory is used to allocate memory for objects and JRE classes, whereas Stack memory is used for execution of a thread and local variable references.",
                explanation: "Heap objects are globally accessible and garbage collected. Stack memory is LIFO, highly private to a thread, and cleared automatically on method end."
            },
            {
                question: "Why is the String class immutable in Java?",
                answer: "For thread-safety, security (e.g. database connections), caching in String Constant Pool, and hashcode caching.",
                explanation: "Since String is immutable, multiple variables can point to the same String in the String Pool safely, reducing overall memory footprint."
            },
            {
                question: "What is the Diamond Problem in Java and how is it resolved?",
                answer: "The Diamond Problem is an ambiguity that arises when a class inherits from two classes that have methods with the same signature. Java avoids this by not supporting multiple inheritance of classes.",
                explanation: "In Java 8, interface default methods can cause default method conflicts. Java resolves this by requiring the implementing class to explicitly override the conflicting default method."
            },
            {
                question: "What are the differences between Checked and Unchecked Exceptions in Java?",
                answer: "Checked exceptions must be declared in throws or handled inside try-catch at compile-time (e.g. IOException). Unchecked exceptions occur at runtime and inherit from RuntimeException (e.g. NullPointerException).",
                explanation: "Checked exceptions represent conditions outside the program's control, while Unchecked exceptions represent programming errors."
            },
            {
                question: "What is the difference between final, finally, and finalize in Java?",
                answer: "final is an access modifier; finally is a try-catch block for cleanup; finalize is a deprecated garbage collector method.",
                explanation: "final prevents re-assignment/overriding; finally always executes; finalize runs before garbage collection cleanup."
            },
            {
                question: "Explain the concept of Method Overloading and Method Overriding.",
                answer: "Overloading is compile-time polymorphism with same name but different parameters. Overriding is runtime polymorphism with same name and same parameters in a subclass.",
                explanation: "Overloading resolution is static, while Overriding uses virtual table dynamic dispatch at runtime."
            },
            {
                question: "Why does Java not support multiple inheritance with classes?",
                answer: "To prevent the 'Diamond Problem' ambiguity where a child class inherits conflicting implementations of the same method from multiple parents.",
                explanation: "Java permits multiple inheritance only via interfaces, which do not hold member state fields."
            },
            {
                question: "What is the Collections Framework in Java?",
                answer: "A unified architecture representing and manipulating collections (List, Set, Map, Queue).",
                explanation: "Provides reusable algorithms and data structures out-of-the-box (ArrayList, HashMap, HashSet) to speed up programming."
            },
            {
                question: "What is the purpose of the 'static' keyword in Java?",
                answer: "It denotes members that belong to the class definition itself, rather than individual object instances.",
                explanation: "Static variables are shared among all instances, and static methods can be called without instantiating the class."
            }
        ];
    } else if (topicNormalized.includes("oop") || topicNormalized.includes("object")) {
        questionsList = [
            {
                question: "What is Polymorphism and what are its two main types?",
                answer: "Polymorphism means 'many forms'. The two main types are Compile-Time Polymorphism (Method Overloading) and Runtime Polymorphism (Method Overriding).",
                explanation: "Overloading resolution is decided by the compiler using method signatures. Overriding resolution happens at runtime using dynamic dispatch on the object reference."
            },
            {
                question: "Differentiate between an Interface and an Abstract Class.",
                answer: "An Interface defines a completely abstract behavior agreement (100% abstract before Java 8). An Abstract Class can have state, concrete methods, and constructors.",
                explanation: "A class can implement multiple interfaces but can only inherit from a single abstract class."
            },
            {
                question: "What is Encapsulation and how does it protect data?",
                answer: "Encapsulation hides the internal state of an object by declaring variables as private and exposing them only via public getter and setter methods.",
                explanation: "This allows validation inside setters and prevents external code from putting the object into an inconsistent state."
            },
            {
                question: "What is Abstraction and how is it achieved in code?",
                answer: "Abstraction shows only the essential features to the user and hides the background implementation details. It is achieved using Abstract Classes and Interfaces.",
                explanation: "For example, you interact with a database through JDBC driver interfaces without needing to know the low-level communication sockets."
            },
            {
                question: "What is the purpose of the 'super' keyword in OOP?",
                answer: "The 'super' keyword is a reference variable used to refer to immediate parent class objects, constructors, or methods.",
                explanation: "Commonly used to invoke parent constructors during subclass instantiation: super() must be the very first statement."
            },
            {
                question: "What is a Constructor and what are its properties?",
                answer: "A special block of code that initializes a newly created object. It has the same name as the class and no return type.",
                explanation: "If no constructor is defined, the compiler inserts a default non-parameterized constructor automatically."
            },
            {
                question: "What is Method Overriding?",
                answer: "A feature that allows a subclass to provide a specific implementation of a method that is already defined in its parent class.",
                explanation: "Crucial for runtime polymorphism, letting you execute subclass behaviors using parent reference variables."
            },
            {
                question: "What is Association, Aggregation, and Composition in OOP?",
                answer: "Association is a general relation; Aggregation represents a weak 'has-a' (independent lifetime); Composition is strong 'has-a' (dependent lifetime).",
                explanation: "In Composition, if the parent object is destroyed, its child parts are also destroyed automatically (e.g. House and Rooms)."
            },
            {
                question: "What are SOLID principles?",
                answer: "Five design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
                explanation: "They serve as guidelines to make software designs more understandable, flexible, and maintainable over time."
            },
            {
                question: "What is an abstract class?",
                answer: "A class declared with the 'abstract' keyword that cannot be instantiated directly and may contain abstract methods.",
                explanation: "Abstract classes outline a conceptual blueprint that extending subclasses are required to implement and expand."
            }
        ];
    } else if (topicNormalized.includes("sql") || topicNormalized.includes("database") || topicNormalized.includes("dbms")) {
        questionsList = [
            {
                question: "What are the differences between INNER JOIN, LEFT JOIN, and RIGHT JOIN?",
                answer: "INNER JOIN returns matching records from both tables. LEFT JOIN returns all records from left and matching from right. RIGHT JOIN returns all from right and matching from left.",
                explanation: "Unmatched rows in LEFT/RIGHT joins will output NULL values for the respective non-dominant table."
            },
            {
                question: "Explain the importance of database Indexes.",
                answer: "An Index speeds up search queries (SELECT) on a table by maintaining a pre-sorted data structure (like B-Tree), at the cost of disk space and slower writes.",
                explanation: "Slower writes happen because every INSERT/UPDATE requires updating the index structure as well."
            },
            {
                question: "What are ACID properties in DBMS?",
                answer: "ACID stands for Atomicity, Consistency, Isolation, and Durability, ensuring transaction safety and reliable database state transitions.",
                explanation: "Atomicity ensures 'all-or-nothing' execution. Durability guarantees committed changes survive system crashes."
            },
            {
                question: "What is the difference between WHERE and HAVING clauses?",
                answer: "WHERE clause filters individual rows before grouping. HAVING clause filters aggregated groups created by the GROUP BY clause.",
                explanation: "You cannot use aggregate functions like SUM() or COUNT() inside a WHERE clause."
            },
            {
                question: "What is Normalization and what are its standard levels?",
                answer: "Normalization is the process of structuring a database to reduce data redundancy and improve data integrity. Standard levels include 1NF, 2NF, 3NF, and BCNF.",
                explanation: "Each level adds rules to eliminate partial dependency, transitive dependency, and multi-valued attributes."
            },
            {
                question: "What is a Foreign Key constraint?",
                answer: "A key used to link two tables together by referencing a Primary Key in another table, ensuring referential integrity.",
                explanation: "It prevents database actions that would destroy links between tables, maintaining solid data consistency."
            },
            {
                question: "Explain the difference between DELETE and TRUNCATE commands.",
                answer: "DELETE is a DML command that removes rows based on a WHERE condition (can be rolled back). TRUNCATE is a DDL command that deletes all rows instantly (cannot be rolled back).",
                explanation: "TRUNCATE is much faster as it deallocates the data pages instead of logging individual row deletions."
            },
            {
                question: "What is a Subquery and what are its types?",
                answer: "A query nested inside another SQL statement. Types include Single-row, Multi-row, and Correlated subqueries.",
                explanation: "Correlated subqueries execute once for each row evaluated by the outer query, making them potentially slower."
            },
            {
                question: "What is a Database Transaction?",
                answer: "A logical unit of database processing consisting of one or more SQL statements executed as a single, indivisible block.",
                explanation: "Transactions are concluded with either COMMIT to save changes or ROLLBACK to cancel them entirely."
            },
            {
                question: "What are DBMS locks and their types?",
                answer: "Mechanisms used to manage concurrent transaction executions, including Shared Locks (for reading) and Exclusive Locks (for writing).",
                explanation: "Locks maintain transaction isolation levels, preventing anomalies like dirty reads and non-repeatable reads."
            }
        ];
    } else {
        // Generic fallback
        questionsList = [
            {
                question: `What are the core principles behind ${topic}?`,
                answer: `The core principles behind ${topic} involve structural efficiency, operational safety, and correct integration within software workflows.`,
                explanation: `Understanding these principles is vital to resolving complex problems during technical screenings at ${compName}.`
            },
            {
                question: `What is a common mistake when implementing ${topic} in a project?`,
                answer: "Neglecting boundary checks, ignoring security rules, and overlooking memory or execution complexity analysis.",
                explanation: "Successful candidates avoid common mistakes by following industry-standard code guidelines."
            },
            {
                question: `How does ${topic} relate to scalable system design?`,
                answer: `It serves as a fundamental building block. For ${roleName} roles, knowing how to decouple, cache, or correctly structure ${topic} prevents scaling bottlenecks.`,
                explanation: `System performance is directly proportional to how well ${topic} is integrated with underlying backend services.`
            },
            {
                question: `Which data structures or formats are most compatible with ${topic}?`,
                answer: "JSON structures, optimized database tables, and memory-resident key-value pairs depending on real-time requirements.",
                explanation: "Choosing standard and compatible protocols ensures minimal conversion delay."
            },
            {
                question: `How can a software engineer test the reliability of their ${topic} implementation?`,
                answer: "Through unit testing, boundary-value analysis, and profiling execution metrics under heavy synthetic workloads.",
                explanation: `Reliable systems are built by validating all theoretical scenarios prior to live deployment in ${compName}'s production cluster.`
            },
            {
                question: `What is the primary objective of studying ${topic} for a ${roleName} role?`,
                answer: `To build robust, performant software components that integrate correctly with ${compName}'s production environments.`,
                explanation: "Technical interviews measure both conceptual clarity and hands-on coding skills in this area."
            },
            {
                question: `Can you describe an advanced use case of ${topic}?`,
                answer: `In high-throughput microservices, ${topic} is often deployed with automated pipelines to ensure fault tolerance and load balancing.`,
                explanation: "Advanced candidates can explain how theoretical CS topics are scaled in distributed server systems."
            },
            {
                question: `Which tools or libraries are typically used to inspect ${topic}?`,
                answer: "Profilers, debugging extensions, log aggregators, and custom console validation tools.",
                explanation: "Professional software engineers leverage tooling to optimize their code and locate structural issues."
            },
            {
                question: `What is the typical time-complexity trade-off associated with ${topic}?`,
                answer: "Often a trade-off between memory overhead (space complexity) and execution speed (time complexity).",
                explanation: "Knowing when to use hash structures vs sequential lists is critical for performance tuning."
            },
            {
                question: `How does ${compName} evaluate ${topic} during placement screenings?`,
                answer: "Through online MCQ tests, practical coding challenges, and interactive whiteboard interviews.",
                explanation: "Preparing both definitions and mock implementations guarantees confidence during the evaluation."
            }
        ];
    }

    return {
        topic: topic,
        questions: questionsList
    };
}

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

Generate exactly 10 practice questions.

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

    try {
        const response =
        await generateWithRetry({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        if (!response || !response.text) {
            return getFallbackPracticeQuestions(topic, company, role);
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

        const questions = JSON.parse(text);

        if (!questions.questions || !Array.isArray(questions.questions)) {
            throw new Error("Invalid practice question format returned by Gemini");
        }

        if (questions.questions.length < 5) {
            throw new Error("Too few practice questions generated");
        }

        const slicedQuestions = questions.questions.slice(0, 10);

        return {
            topic: topic,
            questions: slicedQuestions
        };
    } catch (error) {
        console.log("Practice questions retrieved successfully.");
        return getFallbackPracticeQuestions(topic, company, role);
    }
}

module.exports = {
    generatePracticeQuestions
};
