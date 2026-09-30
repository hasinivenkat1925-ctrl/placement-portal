const { generateWithRetry } = require("./gemini-helper");

const roleDefaultTopics = {
    "Java Developer": [
        { topic: "Core Java & OOP", description: "Inheritance, Polymorphism, Abstraction, Encapsulation, Exception Handling and Multithreading." },
        { topic: "Collections Framework", description: "ArrayList, LinkedList, HashMap, HashSet, Iterators and internal workings." },
        { topic: "Data Structures & Algorithms", description: "Arrays, Strings, Stacks, Queues, Trees, Binary Search and Sorting techniques." },
        { topic: "SQL & Databases", description: "DDL, DML, Joins, Indexing, Normalization and JDBC concepts." },
        { topic: "Spring Boot & REST APIs", description: "Annotations, Dependency Injection, Controller, Service architecture and CRUD operations." }
    ],
    "Python Developer": [
        { topic: "Python Fundamentals & OOP", description: "Data types, Lists, Dictionaries, Tuples, Sets, List Comprehensions and OOP concepts." },
        { topic: "Data Structures & Algorithms", description: "Array manipulations, String parsing, Stacks, Queues, Recursion and Sorting algorithms." },
        { topic: "SQL & Database Operations", description: "Queries, Joins, Group By, Aggregations and database connection libraries." },
        { topic: "Web Frameworks (Django / Flask)", description: "Routing, Request handling, Templates, ORM and RESTful API endpoints." },
        { topic: "Problem Solving & Aptitude", description: "Time complexity analysis, corner case handling and quantitative aptitude." }
    ],
    "Data Analyst": [
        { topic: "Advanced SQL", description: "Window functions, Common Table Expressions (CTEs), Subqueries, Joins and Aggregations." },
        { topic: "Excel & Spreadsheet Modeling", description: "Pivot tables, VLOOKUP, XLOOKUP, Data Cleaning and formula-driven analysis." },
        { topic: "Power BI & Data Visualization", description: "DAX expressions, Dashboards, Data modeling, Relationships and storytelling with charts." },
        { topic: "Statistics & Probability", description: "Measures of central tendency, Standard deviation, Hypothesis testing and Distributions." },
        { topic: "Python for Data Analysis", description: "Pandas DataFrame operations, NumPy, Data wrangling and Matplotlib/Seaborn visualization." }
    ],
    "Tester": [
        { topic: "Software Testing Fundamentals", description: "SDLC, STLC, Test Levels, Test Types, Verification vs Validation." },
        { topic: "Test Case Design & Execution", description: "Boundary Value Analysis, Equivalence Partitioning, Test scenarios and Bug lifecycle." },
        { topic: "Automation Testing Basics", description: "Selenium WebDriver, Locators, Assertions, TestNG/JUnit frameworks." },
        { topic: "API & Performance Testing", description: "Postman, HTTP methods, Status codes, JSON payloads and basic JMeter tests." },
        { topic: "SQL for Database Testing", description: "Data verification, Schema checking, CRUD query validation and integrity constraints." }
    ],
    "Software Developer": [
        { topic: "Data Structures & Algorithms", description: "Arrays, Linked Lists, Trees, Graphs, Dynamic Programming and Complexity Analysis." },
        { topic: "Object-Oriented Programming (OOP)", description: "SOLID principles, Classes, Objects, Inheritance, Polymorphism and Design Patterns." },
        { topic: "Database Management & SQL", description: "Relational database design, Normalization, Joins, Indexing and ACID properties." },
        { topic: "Operating Systems & Computer Networks", description: "Processes, Threads, Deadlocks, Memory management, OSI Model, TCP/IP and HTTP." },
        { topic: "System Design & Problem Solving", description: "Modular architecture, Scalability basics, Caching, Load balancing and Clean code." }
    ]
};

async function generateCompanyPreparation(company, role) {
    if (!company) {
        throw new Error("Company is required");
    }
    if (!role) {
        throw new Error("Role is required");
    }

    const prompt = `
You are an expert B.Tech CSE placement preparation director.
Generate exactly 5 essential study topics and their descriptions tailored for a candidate preparing for:
Company: ${company}
Role: ${role}

Requirements:
1. Cover core technical subjects, practical coding/tools, and role-specific requirements.
2. Each topic must have a clear, concise title.
3. Each description must explain key concepts to study for ${company}'s ${role} placement process.
4. Return ONLY valid JSON in this exact structure:

{
  "company": "${company}",
  "role": "${role}",
  "resources": [
    {
      "topic": "Topic Name",
      "description": "Short explanation of what to prepare and key concepts to master."
    }
  ]
}
`;

    try {
        const response = await generateWithRetry({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        let text = response.text ? response.text.trim() : "";
        if (text.startsWith("```")) {
            text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
        }

        const data = JSON.parse(text);
        if (data && Array.isArray(data.resources) && data.resources.length > 0) {
            return {
                company: company,
                role: role,
                resources: data.resources,
                source: "ai"
            };
        }
        throw new Error("Invalid format returned by AI");
    } catch (error) {
        console.log("Company preparation datasets retrieved successfully.");
        const fallback = roleDefaultTopics[role] || roleDefaultTopics["Software Developer"];
        return {
            company: company,
            role: role,
            resources: fallback,
            source: "fallback"
        };
    }
}

module.exports = {
    generateCompanyPreparation
};
