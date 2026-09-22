const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { generateQuiz } = require("./ai-quiz");
const { generateNotes } = require("./ai-notes");
const { generatePracticeQuestions } = require("./ai-practice");
const { generateSolutions } = require("./ai-solutions");
const { generateCompanyQuestions } =
    require("./ai-company-questions");
const { generateCompanySolutions } =
    require("./ai-company-solutions");
const { generateCompanyQuiz } =
    require("./ai-company-quiz");
    async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ========================================
// ADMIN LOGIN
// ========================================

// Admin credentials
const adminEmail = "prasanthichinni2805@gmail.com";
const adminPassword = "admin123";

app.post("/api/admin-login", (req, res) => {

    const email = String(req.body.email || "")
        .trim()
        .toLowerCase();

    const password = String(req.body.password || "").trim();

    console.log("ADMIN LOGIN ATTEMPT");
    console.log("Admin Email:", email);

    if (
        email === adminEmail.toLowerCase() &&
        password === adminPassword
    ) {

        console.log("ADMIN LOGIN SUCCESS");

        return res.json({

            message: "Admin login successful",

            admin: {
                email: adminEmail,
                name: "Administrator"
            }

        });

    }

    console.log("ADMIN LOGIN FAILED");

    return res.status(401).json({

        message: "Invalid admin email or password."

    });

});


// ========================================
// FRONTEND
// ========================================

const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));


// ========================================
// MAIN PAGES
// ========================================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "index.html")
    );
});

app.get("/dashboard.html", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "dashboard.html")
    );
});

app.get("/preparation.html", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "preparation.html")
    );
});

app.get("/questions.html", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "questions.html")
    );
});

app.get("/solutions.html", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "solutions.html")
    );
});

app.get("/company-quiz.html", (req, res) => {
    res.sendFile(
        path.join(frontendPath, "company-quiz.html")
    );
});


// ========================================
// QUESTION FILES
// ========================================

const questionsFile = path.join(
    __dirname,
    "data",
    "questions.json"
);

const topicQuestionsFile = path.join(
    __dirname,
    "data",
    "topic-questions.json"
);

const usersFile = path.join(
    __dirname,
    "data",
    "users.json"
);
// ========================================
// PERFORMANCE DATABASE
// ========================================

const performanceFile = path.join(
    __dirname,
    "data",
    "performance.json"
);
const generatedTopicsFile =
    path.join(__dirname, "data", "generated-topics.json");

// ========================================
// NORMALIZE
// ========================================

function normalize(text) {

    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}

// ======================================
// AI GENERATED CONTENT CACHE
// ======================================

function getGeneratedTopics() {

    if (!fs.existsSync(generatedTopicsFile)) {
        return {};
    }

    try {

        const data =
            fs.readFileSync(
                generatedTopicsFile,
                "utf8"
            );

        if (!data.trim()) {
            return {};
        }

        return JSON.parse(data);

    } catch (error) {

        console.log(
            "Generated topics cache read error:",
            error
        );

        return {};
    }
}

function saveGeneratedTopics(data) {

    fs.writeFileSync(
        generatedTopicsFile,
        JSON.stringify(data, null, 2)
    );

}


function createTopicCacheKey(
    company,
    role,
    topic
) {

    return (
        normalize(company || "general") +
        "__" +
        normalize(role || "general") +
        "__" +
        normalize(topic)
    );

}
// ========================================
// QUESTIONS API
// ========================================

app.get("/api/questions", (req, res) => {

    const company =
        String(req.query.company || "").trim();

    const role =
        String(req.query.role || "").trim();

    if (!company || !role) {

        return res.status(400).json({

            error:
                "Company and role are required"

        });

    }

    try {

        const data =
            fs.readFileSync(
                questionsFile,
                "utf8"
            );

        const questions =
            JSON.parse(data);

        const selectedCompany =
            normalize(company);

        const selectedRole =
            normalize(role);

        const matchingQuestions =
            questions.filter((q) => {

                return (
                    normalize(q.company) ===
                        selectedCompany &&

                    normalize(q.role) ===
                        selectedRole
                );

            });

        return res.json({

            company: company,

            role: role,

            count:
                matchingQuestions.length,

            questions:
                matchingQuestions

        });

    } catch (error) {

        console.log(
            "Error reading questions database:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to load questions database"

        });

    }

});


// ========================================
// ALL QUESTIONS
// ========================================

app.get("/api/all-questions", (req, res) => {

    try {

        const data =
            fs.readFileSync(
                questionsFile,
                "utf8"
            );

        const questions =
            JSON.parse(data);

        return res.json(questions);

    } catch (error) {

        console.log(
            "Error reading questions database:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to load questions database"

        });

    }

});


// ========================================
// TOPIC QUESTIONS
// ========================================

app.get("/api/topic-questions", (req, res) => {

    const company =
        String(req.query.company || "").trim();

    const role =
        String(req.query.role || "").trim();

    const topic =
        String(req.query.topic || "").trim();

    if (!company || !role || !topic) {

        return res.status(400).json({

            error:
                "Company, role and topic are required"

        });

    }

    try {

        const data =
            fs.readFileSync(
                topicQuestionsFile,
                "utf8"
            );

        const questions =
            JSON.parse(data);

        const selectedCompany =
            normalize(company);

        const selectedRole =
            normalize(role);

        const selectedTopic =
            normalize(topic);

        const matchingQuestions =
            questions.filter((q) => {

                return (
                    normalize(q.company) ===
                        selectedCompany &&

                    normalize(q.role) ===
                        selectedRole &&

                    normalize(q.topic) ===
                        selectedTopic
                );

            });

        return res.json({

            company: company,

            role: role,

            topic: topic,

            count:
                matchingQuestions.length,

            questions:
                matchingQuestions

        });

    } catch (error) {

        console.log(
            "Error reading topic questions:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to load topic questions database"

        });

    }

});


// ========================================
// REGISTER
// ========================================

app.post("/register", (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({

            error:
                "Name, email and password are required"

        });

    }

    try {

        let users = [];

        if (fs.existsSync(usersFile)) {

            const data =
                fs.readFileSync(
                    usersFile,
                    "utf8"
                );

            users =
                data.trim()
                    ? JSON.parse(data)
                    : [];

        }

        const existingUser =
            users.find(
                user =>
                    normalize(user.email) ===
                    normalize(email)
            );

        if (existingUser) {

            return res.status(409).json({

                error:
                    "Email already registered"

            });

        }

        const newUser = {

            id: Date.now(),

            name:
                name.trim(),

            email:
                email.trim(),

            password:
                password

        };

        users.push(newUser);

        fs.writeFileSync(
            usersFile,
            JSON.stringify(
                users,
                null,
                2
            )
        );

        return res.json({

            message:
                "Registration successful!"

        });

    } catch (error) {

        console.log(
            "Registration error:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to register user"

        });

    }

});
// ========================================
// ADMIN STUDENT MANAGEMENT
// ========================================

// GET ALL STUDENTS

app.get("/api/admin/students", (req, res) => {

    try {

        if (!fs.existsSync(usersFile)) {

            return res.json({
                students: []
            });

        }

        const data =
            fs.readFileSync(
                usersFile,
                "utf8"
            );

        const users =
            data.trim()
                ? JSON.parse(data)
                : [];


        // Do NOT send passwords to admin page

        const students =
            users.map(user => {

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email
                };

            });


        return res.json({
            students: students
        });


    } catch (error) {

        console.log(
            "Admin student loading error:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to load students"

        });

    }

});


// DELETE STUDENT

app.delete(
    "/api/admin/students/:id",
    (req, res) => {

        try {

            if (!fs.existsSync(usersFile)) {

                return res.status(404).json({

                    error:
                        "No students found"

                });

            }


            const data =
                fs.readFileSync(
                    usersFile,
                    "utf8"
                );

            let users =
                data.trim()
                    ? JSON.parse(data)
                    : [];


            const studentId =
                Number(req.params.id);


            const studentExists =
                users.some(
                    user =>
                        Number(user.id) ===
                        studentId
                );


            if (!studentExists) {

                return res.status(404).json({

                    error:
                        "Student not found"

                });

            }


            users =
                users.filter(
                    user =>
                        Number(user.id) !==
                        studentId
                );


            fs.writeFileSync(

                usersFile,

                JSON.stringify(
                    users,
                    null,
                    2
                )

            );


            return res.json({

                message:
                    "Student deleted successfully"

            });


        } catch (error) {

            console.log(
                "Admin student delete error:",
                error
            );

            return res.status(500).json({

                error:
                    "Unable to delete student"

            });

        }

    }
);

// ========================================
// STUDENT LOGIN
// ========================================

app.post("/login", (req, res) => {

    const email =
        String(req.body.email || "")
            .trim();

    const password =
        String(req.body.password || "")
            .trim();

    console.log("LOGIN ATTEMPT");
    console.log("Email:", email);

    if (!email || !password) {

        return res.status(400).json({

            error:
                "Email and password are required"

        });

    }

    try {

        if (!fs.existsSync(usersFile)) {

            return res.status(401).json({

                error:
                    "No registered users found"

            });

        }

        const data =
            fs.readFileSync(
                usersFile,
                "utf8"
            );

        const users =
            JSON.parse(data);

        const user =
            users.find((u) => {

                return (

                    String(u.email || "")
                        .trim()
                        .toLowerCase() ===
                    email.toLowerCase()

                    &&

                    String(u.password || "")
                        .trim() ===
                    password

                );

            });

        if (!user) {

            console.log(
                "LOGIN FAILED"
            );

            return res.status(401).json({

                error:
                    "Invalid email or password"

            });

        }

        console.log(
            "LOGIN SUCCESS:",
            user.email
        );

        return res.json({

            message:
                "Login successful!",

            user: {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email

            }

        });

    } catch (error) {

        console.log(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to login"

        });

    }

});
// ========================================
// PERFORMANCE API
// ========================================

// SAVE PERFORMANCE RESULT

app.post("/api/performance", (req, res) => {

    const {
        email,
        type,
        company,
        role,
        topic,
        score,
        percentage,
        correct,
        wrong,
        unanswered
    } = req.body;


    if (!email || !type) {

        return res.status(400).json({

            error:
                "Email and performance type are required"

        });

    }


    try {

        let performance = [];


        if (fs.existsSync(performanceFile)) {

            const data =
                fs.readFileSync(
                    performanceFile,
                    "utf8"
                );

            performance =
                data.trim()
                    ? JSON.parse(data)
                    : [];

        }


        const result = {

            id: Date.now(),

            email: email,

            type: type,

            company: company || "",

            role: role || "",

            topic: topic || "",

            score:
                Number(score || 0),

            percentage:
                Number(percentage || 0),

            correct:
                Number(correct || 0),

            wrong:
                Number(wrong || 0),

            unanswered:
                Number(unanswered || 0),

            date:
                new Date().toISOString()

        };


        performance.push(result);


        fs.writeFileSync(

            performanceFile,

            JSON.stringify(
                performance,
                null,
                2
            )

        );


        return res.json({

            message:
                "Performance saved successfully",

            result: result

        });


    } catch (error) {

        console.log(
            "Performance save error:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to save performance"

        });

    }

});


// ========================================
// GET ALL PERFORMANCE
// ========================================

app.get("/api/performance", (req, res) => {

    try {

        if (!fs.existsSync(performanceFile)) {

            return res.json([]);

        }


        const data =
            fs.readFileSync(
                performanceFile,
                "utf8"
            );


        const performance =
            data.trim()
                ? JSON.parse(data)
                : [];


        return res.json(performance);


    } catch (error) {

        console.log(
            "Performance loading error:",
            error
        );

        return res.status(500).json({

            error:
                "Unable to load performance"

        });

    }

});

// ========================================
// START SERVER
// ========================================

// ======================================
// GEMINI AI QUIZ GENERATION
// ======================================

// ======================================
// GEMINI AI QUIZ GENERATION
// ======================================

app.get("/api/generate-quiz", async (req, res) => {

    const topic = String(req.query.topic || "").trim();
    const company = String(req.query.company || "").trim();
    const role = String(req.query.role || "").trim();

    if (!topic) {
        return res.status(400).json({
            error: "Topic is required"
        });
    }

    try {

        // Create cache key
        const cacheKey =
            createTopicCacheKey(
                company,
                role,
                topic
            );

        // Load existing cache
        const generatedTopics =
            getGeneratedTopics();

        // Check cached quiz
        if (
            generatedTopics[cacheKey] &&
            generatedTopics[cacheKey].quiz
        ) {

            console.log("================================");
            console.log("USING CACHED AI QUIZ");
            console.log("Topic:", topic);
            console.log("Company:", company || "General");
            console.log("Role:", role || "General");
            console.log("================================");

            return res.json(
                generatedTopics[cacheKey].quiz
            );
        }

        // Generate new AI quiz
        console.log("================================");
        console.log("AI QUIZ GENERATION");
        console.log("Topic:", topic);
        console.log("Company:", company || "General");
        console.log("Role:", role || "General");

        const quiz = await generateQuiz(
            topic,
            company,
            role
        );

        // Save quiz to cache
        generatedTopics[cacheKey] =
            generatedTopics[cacheKey] || {};

        generatedTopics[cacheKey].quiz =
            quiz;

        saveGeneratedTopics(
            generatedTopics
        );

        console.log(
            "AI quiz generated successfully"
        );

        console.log(
            "Questions:",
            quiz.questions.length
        );

        console.log(
            "AI quiz saved to cache"
        );

        console.log("================================");

        return res.json(quiz);

    } catch (error) {

        console.log(
            "AI QUIZ ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to generate quiz",
            details: error.message
        });
    }

});
// ======================================
// GEMINI AI NOTES GENERATION
// ======================================

app.get("/api/generate-notes", async (req, res) => {

    const topic = String(req.query.topic || "").trim();
    const company = String(req.query.company || "").trim();
    const role = String(req.query.role || "").trim();

    if (!topic) {
        return res.status(400).json({
            error: "Topic is required"
        });
    }

    try {

        // Create cache key
        const cacheKey =
            createTopicCacheKey(
                company,
                role,
                topic
            );

        // Load existing cache
        const generatedTopics =
            getGeneratedTopics();

        // Check whether notes already exist
        if (
            generatedTopics[cacheKey] &&
            generatedTopics[cacheKey].notes
        ) {

            console.log("================================");
            console.log("USING CACHED AI NOTES");
            console.log("Topic:", topic);
            console.log("Company:", company || "General");
            console.log("Role:", role || "General");
            console.log("================================");

            return res.json(
                generatedTopics[cacheKey].notes
            );
        }

        // Generate new AI notes
        console.log("================================");
        console.log("AI NOTES GENERATION");
        console.log("Topic:", topic);
        console.log("Company:", company || "General");
        console.log("Role:", role || "General");

        const notes = await generateNotes(
            topic,
            company,
            role
        );

        // Save notes to cache
        generatedTopics[cacheKey] =
            generatedTopics[cacheKey] || {};

        generatedTopics[cacheKey].notes =
            notes;

        saveGeneratedTopics(
            generatedTopics
        );

        console.log("AI notes generated successfully");
        console.log("AI notes saved to cache");
        console.log("================================");

        return res.json(notes);

    } catch (error) {

        console.log(
            "AI NOTES ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to generate notes",
            details: error.message
        });

    }

});
// ======================================
// GEMINI AI PRACTICE QUESTIONS
// ======================================

// ======================================
// GEMINI AI PRACTICE QUESTIONS
// ======================================

app.get("/api/generate-practice", async (req, res) => {

    const topic = String(req.query.topic || "").trim();
    const company = String(req.query.company || "").trim();
    const role = String(req.query.role || "").trim();

    if (!topic) {
        return res.status(400).json({
            error: "Topic is required"
        });
    }

    try {

        // Create cache key
        const cacheKey =
            createTopicCacheKey(
                company,
                role,
                topic
            );

        // Load existing cache
        const generatedTopics =
            getGeneratedTopics();

        // Check cached practice questions
        if (
            generatedTopics[cacheKey] &&
            generatedTopics[cacheKey].practice
        ) {

            console.log("================================");
            console.log("USING CACHED AI PRACTICE QUESTIONS");
            console.log("Topic:", topic);
            console.log("Company:", company || "General");
            console.log("Role:", role || "General");
            console.log("================================");

            return res.json(
                generatedTopics[cacheKey].practice
            );
        }

        // Generate new practice questions
        console.log("================================");
        console.log("AI PRACTICE QUESTIONS");
        console.log("Topic:", topic);
        console.log("Company:", company || "General");
        console.log("Role:", role || "General");

        const questions =
            await generatePracticeQuestions(
                topic,
                company,
                role
            );

        // Save questions to cache
        generatedTopics[cacheKey] =
            generatedTopics[cacheKey] || {};

        generatedTopics[cacheKey].practice =
            questions;

        saveGeneratedTopics(
            generatedTopics
        );

        console.log(
            "AI practice questions generated successfully"
        );

        console.log(
            "Questions:",
            questions.questions.length
        );

        console.log(
            "AI practice questions saved to cache"
        );

        console.log("================================");

        return res.json(questions);

    } catch (error) {

        console.log(
            "AI PRACTICE ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to generate practice questions",
            details: error.message
        });

    }

});
// ======================================
// GEMINI AI SOLUTIONS
// ======================================

// ======================================
// GEMINI AI SOLUTIONS
// ======================================

app.get("/api/generate-solutions", async (req, res) => {

    const topic = String(req.query.topic || "").trim();
    const company = String(req.query.company || "").trim();
    const role = String(req.query.role || "").trim();

    if (!topic) {
        return res.status(400).json({
            error: "Topic is required"
        });
    }

    try {

        // Create cache key
        const cacheKey =
            createTopicCacheKey(
                company,
                role,
                topic
            );

        // Load existing cache
        const generatedTopics =
            getGeneratedTopics();

        // Check cached solutions
        if (
            generatedTopics[cacheKey] &&
            generatedTopics[cacheKey].solutions
        ) {

            console.log("================================");
            console.log("USING CACHED AI SOLUTIONS");
            console.log("Topic:", topic);
            console.log("Company:", company || "General");
            console.log("Role:", role || "General");
            console.log("================================");

            return res.json(
                generatedTopics[cacheKey].solutions
            );
        }

        // Generate new solutions
        console.log("================================");
        console.log("AI SOLUTIONS GENERATION");
        console.log("Topic:", topic);
        console.log("Company:", company || "General");
        console.log("Role:", role || "General");

        const solutions =
            await generateSolutions(
                topic,
                company,
                role
            );

        // Save solutions to cache
        generatedTopics[cacheKey] =
            generatedTopics[cacheKey] || {};

        generatedTopics[cacheKey].solutions =
            solutions;

        saveGeneratedTopics(
            generatedTopics
        );

        console.log(
            "AI solutions generated successfully"
        );

        console.log(
            "Solutions:",
            solutions.solutions.length
        );

        console.log(
            "AI solutions saved to cache"
        );

        console.log("================================");

        return res.json(solutions);

    } catch (error) {

        console.log(
            "AI SOLUTIONS ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to generate solutions",
            details: error.message
        });

    }

});
// ========================================
// AI COMPANY PLACEMENT PREPARATION
// ========================================

app.get("/api/generate-company-preparation", async (req, res) => {

    const company =
        String(req.query.company || "").trim();

    const role =
        String(req.query.role || "").trim();

    if (!company || !role) {
        return res.status(400).json({
            error: "Company and role are required"
        });
    }

    try {

        console.log("================================");
        console.log("AI COMPANY PREPARATION");
        console.log("Company:", company);
        console.log("Role:", role);

        const resources =
            await generateCompanyPreparation(
                company,
                role
            );

        console.log(
            "AI company preparation generated successfully"
        );

        console.log("Resources:", resources.resources.length);

        console.log("================================");

        return res.json(resources);

    } catch (error) {

        console.log(
            "AI COMPANY PREPARATION ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to generate company preparation",
            details: error.message
        });

    }

});
// ========================================
// AI COMPANY PLACEMENT QUESTIONS
// ========================================

app.get("/api/generate-company-questions", async (req, res) => {

    const company =
        String(req.query.company || "").trim();

    const role =
        String(req.query.role || "").trim();

    if (!company || !role) {
        return res.status(400).json({
            error: "Company and role are required"
        });
    }

    try {

        console.log("================================");
        console.log("AI COMPANY QUESTIONS");
        console.log("Company:", company);
        console.log("Role:", role);

        const questions =
            await generateCompanyQuestions(
                company,
                role
            );

        console.log(
            "AI company questions generated successfully"
        );

        console.log(
            "Questions:",
            questions.questions.length
        );

        console.log("================================");

        return res.json(questions);

    } catch (error) {

        console.log(
            "AI COMPANY QUESTIONS ERROR:",
            error
        );

        return res.status(500).json({
            error: "Unable to generate company questions",
            details: error.message
        });

    }

});
// ========================================
// AI COMPANY PLACEMENT SOLUTIONS
// ========================================

app.get("/api/generate-company-solutions", async (req, res) => {

    const company =
        String(req.query.company || "").trim();

    const role =
        String(req.query.role || "").trim();

    if (!company || !role) {
        return res.status(400).json({
            error: "Company and role are required"
        });
    }

    try {

        console.log("================================");
        console.log("AI COMPANY SOLUTIONS");
        console.log("Company:", company);
        console.log("Role:", role);

        const solutions =
            await generateCompanySolutions(
                company,
                role
            );

        console.log(
            "AI company solutions generated successfully"
        );

        console.log(
            "Solutions:",
            solutions.solutions.length
        );

        console.log("================================");

        return res.json(solutions);

    } catch (error) {

    console.log(
        "AI COMPANY SOLUTIONS ERROR:",
        error.message
    );

    console.log(
        "Gemini unavailable. Using fallback solutions."
    );

    const fallbackSolutions = [
        {
            question: "What skills are important for a " + role + " role?",
            answer: "Programming, problem solving, communication and technical knowledge.",
            solution:
                "For a " + role +
                " role, prepare programming fundamentals, " +
                "data structures, databases, problem solving " +
                "and communication skills."
        },

        {
            question: "Why is problem solving important for a " + role + " role?",
            answer: "It helps solve technical problems efficiently.",
            solution:
                "Problem solving helps candidates handle coding " +
                "questions, logical problems and real-world " +
                "technical situations."
        },

        {
            question: "Why are databases important for a " + role + " role?",
            answer: "Databases store, manage and retrieve data.",
            solution:
                "A " + role +
                " professional should understand SQL, tables, " +
                "keys, joins and basic database operations."
        },

        {
            question: "What is the importance of data structures?",
            answer: "Data structures organize data efficiently.",
            solution:
                "Arrays, linked lists, stacks, queues, trees and " +
                "hash tables help programs store and process data " +
                "efficiently."
        },

        {
            question: "How should a candidate prepare for a " +
                company + " " + role + " interview?",
            answer:
                "Prepare technical concepts, coding, aptitude and communication.",
            solution:
                "Practice coding problems, revise core subjects, " +
                "study SQL and databases, practice aptitude and " +
                "prepare technical and HR interview questions."
        }
    ];

    return res.json({
        company: company,
        role: role,
        solutions: fallbackSolutions,
        source: "fallback"
    });

}

});
app.get("/api/generate-company-quiz", async (req, res) => {
    const company = String(req.query.company || "").trim();
    const role = String(req.query.role || "").trim();

    if (!company || !role) {
        return res.status(400).json({
            error: "Company and role are required"
        });
    }

    try {
        console.log("================================");
        console.log("AI COMPANY QUIZ");
        console.log("Company:", company);
        console.log("Role:", role);

        const quiz = await generateCompanyQuiz(company, role);

        console.log("AI company quiz generated successfully");
        console.log("Questions:", quiz.questions.length);
        console.log("================================");

        return res.json(quiz);

    } catch (error) {

        console.log(
            "AI COMPANY SOLUTIONS ERROR:",
            error.message
        );

        console.log(
            "Gemini unavailable. Using fallback solutions."
        );

        const fallbackSolutions = [
            {
                question:
                    "What are the important skills required for a " +
                    role + " role?",

                answer:
                    "Programming, problem solving, communication, " +
                    "technical knowledge and database skills.",

                solution:
                    "For a " + role +
                    " role, prepare programming fundamentals, " +
                    "data structures, databases, problem solving, " +
                    "and communication skills."
            },

            {
                question:
                    "What is the importance of problem solving in a " +
                    role + " role?",

                answer:
                    "It helps in solving technical problems efficiently.",

                solution:
                    "Problem solving is important because placement " +
                    "tests and interviews commonly check logical " +
                    "thinking, algorithms and the ability to solve " +
                    "real-world programming problems."
            },

            {
                question:
                    "Why are databases important for a " +
                    role + " role?",

                answer:
                    "Databases are used to store, manage and retrieve data.",

                solution:
                    "A " + role +
                    " professional should understand basic database " +
                    "concepts, SQL queries, tables, keys, joins and " +
                    "data retrieval."
            },

            {
                question:
                    "What is the role of data structures in programming?",

                answer:
                    "Data structures organize data efficiently.",

                solution:
                    "Arrays, linked lists, stacks, queues, trees and " +
                    "hash tables help programs store and process data " +
                    "efficiently. They are also common placement interview topics."
            },

            {
                question:
                    "How should a candidate prepare for a " +
                    company + " " + role + " interview?",

                answer:
                    "Prepare technical concepts, coding, aptitude and communication.",

                solution:
                    "The candidate should practice coding problems, " +
                    "review core technical subjects, study SQL and " +
                    "databases, practice aptitude questions and prepare " +
                    "for technical and HR interview questions."
            }
        ];

        return res.json({
            company: company,
            role: role,
            solutions: fallbackSolutions,
            source: "fallback"
        });

    }
});
const server =
    app.listen(
        PORT,
        () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

            console.log(
                "Frontend folder:",
                frontendPath
            );

            console.log(
                "Questions database:",
                questionsFile
            );

        }
    );


server.on(
    "error",
    (error) => {

        console.log(
            "Server error:",
            error
        );

    }
);