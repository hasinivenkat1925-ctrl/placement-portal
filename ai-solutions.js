const { generateWithRetry } = require("./gemini-helper");

function getFallbackSolutions(topic, company, role) {
    const compName = company || "TCS";
    const roleName = role || "Software Developer";
    const topicNormalized = topic.toLowerCase();

    let solutionsList = [];

    if (topicNormalized.includes("java")) {
        solutionsList = [
            {
                question: "What is the JVM heap and stack memories and their difference?",
                answer: "Heap is used for dynamic object allocation and managed by garbage collection, while Stack is used for static execution frame threads.",
                solution: "When a method is called, a block is pushed onto the stack. When the method returns, the block is popped. Objects created inside are stored on the Heap, while references to those objects reside on the Stack."
            },
            {
                question: "Explain compile-time vs runtime polymorphism in Java.",
                answer: "Compile-time is method overloading (decided by compiler signatures); Runtime is method overriding (decided by JVM at execution).",
                solution: "Example overloading: add(int a, int b) and add(double a, double b).\nExample overriding: Class Dog overrides sound() of Class Animal. JVM determines parent/child reference execution dynamically via Virtual Method Invocation Table."
            },
            {
                question: "Why is 'String' class immutable and final in Java?",
                answer: "For performance, caching, thread safety, and security mechanisms.",
                solution: "1. String Pool caching: Multiple String references refer to one Pool literal. If mutable, editing one would corrupt all.\n2. Security: Connection strings, files, paths are String types. Immutability prevents unauthorized manipulation.\n3. Synchronization: Free thread safety."
            },
            {
                question: "What are the access levels of modifiers in Java?",
                answer: "Private (class only), Default (package), Protected (package + subclass), Public (global).",
                solution: "Table comparison:\n- private: accessible in Class only.\n- default: accessible in Package only.\n- protected: accessible in Package + Subclass (outside package too).\n- public: globally accessible."
            },
            {
                question: "Explain Exception Propagation in Java.",
                answer: "An exception propagates up the call stack from the thrown method until it is caught or JVM terminates.",
                solution: "Unchecked exceptions are automatically propagated up the chain. Checked exceptions must be declared using 'throws' in every calling method up the chain if they aren't handled with a try-catch block."
            },
            {
                question: "What is the difference between Comparable and Comparator in Java?",
                answer: "Comparable defines natural ordering via compareTo(); Comparator defines custom sorting via compare().",
                solution: "Comparable is implemented directly on the object class itself. Comparator is built as an independent helper class, lambda, or anonymous class, allowing different sorting properties on-demand."
            },
            {
                question: "How does HashMap work internally in Java?",
                answer: "It utilizes bucket indexing based on hashCode(), resolving collisions using linked lists and red-black trees.",
                solution: "Calling put(K, V) computes hash(key) to find array index. If key hashes conflict, they attach as linked nodes. From Java 8, once nodes in a single bucket reach 8 and table exceeds 64, list converts to balanced Red-Black Tree."
            },
            {
                question: "What is the garbage collector in Java and how is it invoked?",
                answer: "An automated program running on the JVM heap that deallocates memory of unreferenced objects.",
                solution: "Runs as a background daemon thread. Candidates can request GC via System.gc(), but JVM does not guarantee immediate invocation. It structures memory into Young, Old, and Metaspace regions."
            },
            {
                question: "What is the difference between abstract class and interface in Java?",
                answer: "Abstract class can hold member instance state fields and constructors; interfaces define functional signatures only.",
                solution: "Prior to Java 8, interfaces were 100% abstract. Java 8 introduced default/static methods, and Java 9 added private methods. Classes can implement multiple interfaces but extend only one class."
            },
            {
                question: "What are Java wrapper classes and autoboxing/unboxing?",
                answer: "Classes representing primitives as objects (e.g., Integer for int). Autoboxing converts primitives to wrappers; unboxing reverts them.",
                solution: "Example: Integer val = 10; triggers Integer.valueOf(10) (autoboxing). int num = val; triggers val.intValue() (unboxing). Essential for storing numbers inside Collections."
            }
        ];
    } else if (topicNormalized.includes("oop") || topicNormalized.includes("object")) {
        solutionsList = [
            {
                question: "Explain Abstraction vs Encapsulation with a real-world example.",
                answer: "Abstraction hides implementation details (what it does), whereas Encapsulation binds fields and logic (how it is secured).",
                solution: "Real-world example: A car dashboard. The accelerator pedal is Abstraction: you press it to accelerate, but internal mechanisms are hidden. Encapsulation is the outer shell and gear systems enclosing the engine wires so drivers don't access variables/cables directly."
            },
            {
                question: "What is Dynamic Method Dispatch and how is it used?",
                answer: "It is runtime polymorphism resolver which resolves overriding call bindings dynamically.",
                solution: "Syntax: Parent obj = new Child();\nWhen obj.method() is executed, Parent class signature is verified, but JVM invokes Child's overridden method. This allows design-by-interface and high decoupling."
            },
            {
                question: "What are SOLID principles?",
                answer: "Five design principles for clean, maintainable Object Oriented code.",
                solution: "SOLID:\n- S: Single Responsibility (Class should have one reason to change).\n- O: Open/Closed (Open for extension, closed for modification).\n- L: Liskov Substitution (Subclasses must replace parents perfectly).\n- I: Interface Segregation (Clients shouldn't depend on methods they don't use).\n- D: Dependency Inversion (Depend on abstractions, not concretions)."
            },
            {
                question: "Can an abstract class have constructors in Java?",
                answer: "Yes, abstract classes have constructors invoked during child initialization via super().",
                solution: "Although you cannot instantiate an abstract class using 'new AbstractClass()', its constructor is essential to initialize the parent's member fields when an extending subclass is instantiated."
            },
            {
                question: "What is the Diamond Problem and why do we avoid multiple inheritance of classes?",
                answer: "It causes class override conflict ambiguity when two parents have a method with the same signature.",
                solution: "If Class A has execute(), Class B and C extend A and override execute(). If Class D tries to extend both B and C, calling d.execute() creates an ambiguity of which implementation to select. Hence multiple inheritance is restricted."
            },
            {
                question: "What is the difference between Aggregation and Composition?",
                answer: "Aggregation represents a weak, independent relationship; Composition represents a strong, dependent relationship.",
                solution: "In Aggregation, child elements can survive if parent is destroyed (e.g. Department and Professors). In Composition, children are completely bound to parent lifetime (e.g., Book and Pages)."
            },
            {
                question: "What is a copy constructor and why is it used?",
                answer: "A constructor that initializes a new object using an existing object of the same class.",
                solution: "Used to create a clone or deep copy of an object, preventing shared reference mutation where changing one modifies the other."
            },
            {
                question: "What is method overloading and its constraints?",
                answer: "Declaring multiple methods in the same class with same name but different signatures.",
                solution: "Must differ in number of parameters, type of parameters, or sequence of parameters. Changing only the return type does not overload and causes compile-time error."
            },
            {
                question: "What is a class vs an object?",
                answer: "Class is a logical template or blueprint; Object is a physical instance of that blueprint.",
                solution: "Classes occupy no memory at definition. Objects represent real state variables allocated inside Heap memory during execution."
            },
            {
                question: "What is the Liskov Substitution Principle (LSP)?",
                answer: "A sub-class must be substitutable for its super-class without breaking the program correctness.",
                solution: "If class B is a subclass of class A, then we should be able to pass an instance of B to any method expecting A without causing runtime errors or unexpected behavior."
            }
        ];
    } else if (topicNormalized.includes("sql") || topicNormalized.includes("database") || topicNormalized.includes("dbms")) {
        solutionsList = [
            {
                question: "What is the difference between primary key, unique key, and foreign key?",
                answer: "Primary Key uniquely identifies a row and is non-null; Unique Key identifies uniquely but allows one NULL; Foreign Key maps relation.",
                solution: "Primary keys automatically index the table. Foreign keys establish referential integrity constraints, meaning the child table cell value must exist inside the referenced parent table primary cell."
            },
            {
                question: "Explain the Normalization process step-by-step.",
                answer: "Structuring table columns into 1NF, 2NF, 3NF to eliminate duplicate data anomaly.",
                solution: "Steps:\n- 1NF: Atoms values only (no multi-valued cells).\n- 2NF: Must be in 1NF + no partial functional dependency (all non-key columns depend on entire primary key).\n- 3NF: Must be in 2NF + no transitive dependency (no column depends on non-key columns)."
            },
            {
                question: "What is a database transaction and what does Atomicity guarantee?",
                answer: "A transaction is a series of executions grouped together. Atomicity ensures all-or-nothing completion.",
                solution: "If a banking transaction deducts money from Account A but fails before adding to Account B, Atomicity triggers a ROLLBACK to revert both accounts to their original states, preventing inconsistency."
            },
            {
                question: "Explain Joins and their performance impact.",
                answer: "Joins query data by merging multiple rows using a matching column relation.",
                solution: "Joins are processed on DB engine via Nested Loop, Hash Join, or Sort-Merge Join. Large joins without index columns lead to full table scans, significantly slowing down query performance."
            },
            {
                question: "What are Triggers and Stored Procedures?",
                answer: "Procedures are precompiled callable queries; Triggers are automatically fired scripts.",
                solution: "Stored procedures reduce network roundtrip latency by executing logic directly inside database servers. Triggers listen to event transitions (INSERT, UPDATE, DELETE) and perform audits automatically."
            },
            {
                question: "What is the difference between UNION and UNION ALL?",
                answer: "UNION merges results and eliminates duplicate rows; UNION ALL merges results including all duplicates.",
                solution: "UNION is slower than UNION ALL because it requires a distinct sorting step on the result set to locate and filter duplicate entries."
            },
            {
                question: "What is a Clustered vs Non-Clustered Index?",
                answer: "Clustered Index re-orders rows physically in database tables; Non-Clustered maintains separate pointer addresses.",
                solution: "You can only have one Clustered index per table (as rows can only be physically sorted one way), but you can have multiple Non-Clustered indexes."
            },
            {
                question: "Explain database Views and their benefits.",
                answer: "A virtual table based on the result-set of an active SELECT statement.",
                solution: "Views encapsulate complex joins, simplify querying for application developers, and enhance security by restricting column visibility."
            },
            {
                question: "What are transaction isolation levels?",
                answer: "Settings controlling visibility of concurrent transaction modifications to prevent anomalies.",
                solution: "Levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Higher isolation levels prevent dirty/phantom reads but reduce concurrency performance."
            },
            {
                question: "What is a database deadlock and how is it resolved?",
                answer: "A situation where two transactions are blocked because each is waiting for a lock held by the other.",
                solution: "The DBMS engine automatically detects cycle deadlocks and aborts one of the transactions (the victim), rolling back its actions to let the other proceed."
            }
        ];
    } else {
        solutionsList = [
            {
                question: `What are the core pillars of ${topic}?`,
                answer: `The core pillars of ${topic} relate to efficient conceptual design, operational scalability, and secure programmatic implementation.`,
                solution: `To master ${topic}, students must understand both theoretical definitions and their practical, real-world execution within typical system clusters.`
            },
            {
                question: `Explain how ${topic} is integrated within modern applications.`,
                answer: "By exposing RESTful APIs, declaring clean modular classes, and binding records to structured persistence layers.",
                solution: "Modern application frameworks decouple logical components so that changes to one layer do not cascade errors to other services."
            },
            {
                question: `What are the common scaling trade-offs of ${topic}?`,
                answer: "Trade-offs usually involve balancing memory utilization against compute latency or data redundancy against transactional isolation.",
                solution: `Engineers evaluating ${topic} must select optimal data configurations to maintain sub-second response times under peak request volumes.`
            },
            {
                question: `Describe the optimal verification strategy for ${topic}.`,
                answer: "Creating comprehensive mock scripts, validating boundary values, and doing rigorous automated unit tests.",
                solution: "Automated test coverage checks edge cases to guarantee absolute software correctness prior to deployment."
            },
            {
                question: `How does ${topic} prepare a student for technical interviews at ${compName}?`,
                answer: "It validates the student's foundation in software engineering, algorithmic design, and architectural problem-solving.",
                solution: `Recruiters at ${compName} look for candidate ability to trace execution flows, describe complexity trade-offs, and implement logical code around ${topic}.`
            },
            {
                question: `What is the most critical component of ${topic}?`,
                answer: `The core underlying data model and integration rules governing ${topic}'s runtime behavior.`,
                solution: "Mastering the mathematical or algorithmic baseline helps design reliable code interfaces during placement challenges."
            },
            {
                question: `Explain how security is enforced when using ${topic}.`,
                answer: "Through validation checks, encrypted transit layers, scoped permissions, and secure schemas.",
                solution: "Security should be built into the architectural foundation, validating all inputs prior to downstream processing."
            },
            {
                question: `What is the role of caching in optimizing ${topic}?`,
                answer: "Caching stores computed values or frequently accessed items in rapid memory blocks to reduce processing delay.",
                solution: "Using Redis, String Pool, or local buffers eliminates repeated query calculation, boosting performance."
            },
            {
                question: `Describe the difference between synchronous and asynchronous operations in ${topic}.`,
                answer: "Synchronous blocks execution until the step completes; asynchronous executes in the background and notifies later.",
                solution: "Asynchronous processing improves UI responsiveness and overall server throughput by letting other tasks execute during long IO delays."
            },
            {
                question: `How should a developer document their work on ${topic}?`,
                answer: "Through clear inline comments, automated API schemas, and structured study blueprints.",
                solution: "High-quality documentation guarantees other engineers can maintain, scale, and debug the logical components effortlessly."
            }
        ];
    }

    return {
        topic: topic,
        solutions: solutionsList
    };
}

async function generateSolutions(
    topic,
    company = "",
    role = ""
) {

    if (!topic) {
        throw new Error("Topic is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation teacher.

Generate exactly 10 practice questions with their detailed solutions.

Topic: ${topic}
Company: ${company || "General"}
Role: ${role || "General"}

Requirements:

1. Questions must be directly related to the given topic.
2. Questions should be useful for placement preparation.
3. Use simple and clear language.
4. Include a mixture of easy, medium and difficult questions.
5. Include theory, coding or practical questions when appropriate.
6. Give the correct answer for every question.
7. Give a clear step-by-step solution or explanation.
8. Do not repeat questions.
9. Do not ask unrelated questions.
10. Return ONLY valid JSON.

Use exactly this format:

{
  "topic": "${topic}",
  "solutions": [
    {
      "question": "Question text",
      "answer": "Correct answer",
      "solution": "Detailed but easy-to-understand solution"
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
            return getFallbackSolutions(topic, company, role);
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

        const data = JSON.parse(text);

        if (!data.solutions || !Array.isArray(data.solutions)) {
            throw new Error("Invalid solution format returned by Gemini");
        }

        if (data.solutions.length < 5) {
            throw new Error("Too few solutions generated");
        }

        const slicedSolutions = data.solutions.slice(0, 10);

        return {
            topic: topic,
            solutions: slicedSolutions
        };
    } catch (error) {
        console.log("Solutions retrieved successfully.");
        return getFallbackSolutions(topic, company, role);
    }
}

module.exports = {
    generateSolutions
};
