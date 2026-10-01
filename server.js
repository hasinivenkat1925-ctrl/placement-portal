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
const { generateCompanyPreparation } =
    require("./ai-company-preparation");
const {
    saveUserToFirestore,
    findUserInFirestore,
    getStudentsFromFirestore,
    deleteStudentFromFirestore,
    savePerformanceToFirestore,
    getPerformanceFromFirestore
} = require("./firebase-service");
    async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json());

// Health Check API
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "Placement Portal API",
        timestamp: new Date().toISOString()
    });
});
app.get("/api/ping", (req, res) => res.send("pong"));


// ========================================
// ADMIN LOGIN
// ========================================

// Strict Admin credentials (ONLY authorized admin emails)
const adminEmails = [
    "hasinivenkat1925@gmail.com",
    "prasanthichinni2805@gmail.com"
];
const adminPassword = "admin123";

app.post("/api/admin-login", (req, res) => {
    const email = String(req.body.email || "")
        .trim()
        .toLowerCase();
    const password = String(req.body.password || "").trim();

    console.log("ADMIN LOGIN ATTEMPT:", email);

    const isAuthorizedEmail = adminEmails.map(e => e.toLowerCase()).includes(email);
    const isAuthorizedPassword = password === adminPassword;

    if (isAuthorizedEmail && isAuthorizedPassword) {
        console.log("ADMIN LOGIN SUCCESS:", email);
        return res.json({
            message: "Admin login successful",
            admin: {
                email: email,
                name: email.includes("hasini") ? "Hasini Venkat" : "Prasanthi Chinni",
                role: "Super Admin"
            }
        });
    }

    console.log("ADMIN LOGIN FAILED for:", email);
    return res.status(401).json({
        message: "Access Denied: Only authorized administrators (hasinivenkat1925@gmail.com and prasanthichinni2805@gmail.com) can log in."
    });
});


// ========================================
// FRONTEND
// ========================================

function resolveFrontendPath() {
    const candidatePaths = [
        __dirname,
        process.cwd(),
        path.join(__dirname, ".."),
        path.join(process.cwd(), "..")
    ];
    for (const c of candidatePaths) {
        if (fs.existsSync(path.join(c, "index.html")) && fs.existsSync(path.join(c, "login.html"))) {
            return c;
        }
    }
    return __dirname;
}

const frontendPath = resolveFrontendPath();

app.use(express.static(frontendPath));
app.use("/CSS", express.static(path.join(frontendPath, "CSS")));
app.use("/css", express.static(path.join(frontendPath, "CSS")));

app.get(["/style.css", "/CSS/style.css", "/css/style.css"], (req, res) => {
    const cssPath = fs.existsSync(path.join(frontendPath, "CSS", "style.css")) 
        ? path.join(frontendPath, "CSS", "style.css")
        : path.join(frontendPath, "style.css");
    res.type("text/css").sendFile(cssPath);
});

app.get(["/nav-header.js"], (req, res) => {
    res.type("application/javascript").sendFile(path.join(frontendPath, "nav-header.js"));
});


// ========================================
// MAIN PAGES & HTML ROUTING
// ========================================

const allHtmlPages = [
    "index", "landing-login", "login", "register", "dashboard",
    "preparation", "interview", "progress", "resources", "topics",
    "videos", "company", "company-quiz", "questions", "quiz",
    "solutions", "technical-interview", "hr-interview",
    "admin-login", "admin-dashboard", "admin-student", "admin-questions",
    "admin-company-role", "admin-performance", "topic-notes",
    "topic-preparation", "topic-questions", "topic-quiz", "topic-solutions"
];

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

allHtmlPages.forEach(page => {
    app.get([`/${page}`, `/${page}.html`], (req, res) => {
        const filePath = path.join(frontendPath, `${page}.html`);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
        res.sendFile(path.join(frontendPath, "index.html"));
    });
});

// Automatic routing fallback for any other .html page
app.get("/:page", (req, res, next) => {
    let page = req.params.page;
    if (page.startsWith("api")) {
        return next();
    }
    if (!page.includes(".")) {
        page = page + ".html";
    }
    const pageFile = path.join(frontendPath, page);
    if (fs.existsSync(pageFile)) {
        return res.sendFile(pageFile);
    }
    next();
});

// ========================================
// QUESTION FILES
// ========================================

const dataFolder = path.join(__dirname, "data");
if (!fs.existsSync(dataFolder)) {
    try {
        fs.mkdirSync(dataFolder, { recursive: true });
    } catch (e) {
        // Ignored on read-only environments
    }
}

const questionsFile = path.join(
    __dirname,
    "data",
    "questions.json"
);

// Seed questions.json if missing from data directory
if (!fs.existsSync(questionsFile) && fs.existsSync(path.join(__dirname, "questions.json"))) {
    try {
        fs.copyFileSync(path.join(__dirname, "questions.json"), questionsFile);
    } catch (e) {
        console.warn("Could not copy questions.json to data directory:", e.message);
    }
}

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

function readQuestionsDatabase() {
    try {
        if (fs.existsSync(questionsFile)) {
            return JSON.parse(fs.readFileSync(questionsFile, "utf8"));
        }
        const rootPath = path.join(__dirname, "questions.json");
        if (fs.existsSync(rootPath)) {
            return JSON.parse(fs.readFileSync(rootPath, "utf8"));
        }
    } catch (e) {
        console.warn("Failed reading questions database:", e.message);
    }
    return [];
}

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
    try {
        fs.writeFileSync(
            generatedTopicsFile,
            JSON.stringify(data, null, 2)
        );
    } catch (e) {
        console.warn("Local topics cache write skipped:", e.message);
    }
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

app.get("/api/questions", async (req, res) => {

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
        const questions = readQuestionsDatabase();

        const selectedCompany =
            normalize(company);

        const selectedRole =
            normalize(role);

        const matchingQuestions =
            questions.filter((q) => {
                return (
                    normalize(q.company) === selectedCompany &&
                    normalize(q.role) === selectedRole
                );
            });

        if (matchingQuestions.length > 0) {
            return res.json({
                company: company,
                role: role,
                count: matchingQuestions.length,
                questions: matchingQuestions
            });
        }

        // Fallback to real-time company questions generator
        const generated = await generateCompanyQuestions(company, role);
        return res.json({
            company: company,
            role: role,
            count: generated.questions ? generated.questions.length : 0,
            questions: generated.questions || []
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

        const questions = readQuestionsDatabase();

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

app.post(["/register", "/api/register"], async (req, res) => {

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

        const existingFirestoreUser = await findUserInFirestore(email);

        if (existingUser || existingFirestoreUser) {

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

        try {
            fs.writeFileSync(
                usersFile,
                JSON.stringify(
                    users,
                    null,
                    2
                )
            );
        } catch (fsErr) {
            console.warn("Local users file write skipped:", fsErr.message);
        }

        // Sync to Firebase Firestore
        await saveUserToFirestore(newUser);

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
app.get("/api/admin/students", async (req, res) => {
    console.log("Fetching students (admin/students)");
    try {
        let allStudents = [];
        const studentMap = new Map();
        // ... (rest of the student loading logic)
        // (I will keep the existing logic and just split the route)

        // 1. Read local users.json
        if (fs.existsSync(usersFile)) {
            try {
                const data = fs.readFileSync(usersFile, "utf8");
                const localUsers = data.trim() ? JSON.parse(data) : [];
                localUsers.forEach(u => {
                    const normEmail = String(u.email || "").toLowerCase().trim();
                    if (normEmail) {
                        studentMap.set(normEmail, {
                            id: u.id || Date.now(),
                            name: u.name || normEmail.split("@")[0],
                            email: normEmail
                        });
                    }
                });
            } catch (localErr) {
                console.warn("Local users reading warning:", localErr.message);
            }
        }

        // 2. Read from Firestore
        try {
            const firestoreStudents = await getStudentsFromFirestore();
            if (Array.isArray(firestoreStudents)) {
                firestoreStudents.forEach(u => {
                    const normEmail = String(u.email || "").toLowerCase().trim();
                    if (normEmail) {
                        studentMap.set(normEmail, {
                            id: u.id || studentMap.get(normEmail)?.id || Date.now(),
                            name: u.name || studentMap.get(normEmail)?.name || normEmail.split("@")[0],
                            email: normEmail
                        });
                    }
                });
            }
        } catch (fsErr) {
            console.warn("Firestore get students warning:", fsErr.message);
        }

        allStudents = Array.from(studentMap.values());

        // 3. If database has no entries yet, seed initial verified student records
        if (allStudents.length === 0) {
            allStudents = [
                { id: 101, name: "Hasini Venkat", email: "hasinivenkat1925@gmail.com" },
                { id: 102, name: "Prasanthi Chinni", email: "prasanthichinni2805@gmail.com" },
                { id: 103, name: "Placement Candidate", email: "candidate@placement.edu" }
            ];
        }

        return res.json({
            students: allStudents
        });

    } catch (error) {
        console.log("Admin student loading error:", error);
        return res.status(500).json({
            error: "Unable to load students"
        });
    }
});


// DELETE STUDENT

app.delete(
    "/api/admin/students/:id",
    async (req, res) => {

        try {

            const studentId = Number(req.params.id);
            await deleteStudentFromFirestore(studentId);

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


            try {
                fs.writeFileSync(
                    usersFile,
                    JSON.stringify(
                        users,
                        null,
                        2
                    )
                );
            } catch (fsErr) {
                console.warn("Local users file update skipped:", fsErr.message);
            }


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

app.post(["/login", "/api/login"], async (req, res) => {

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

        // Check Firestore first
        const firestoreUser = await findUserInFirestore(email);
        if (firestoreUser && String(firestoreUser.password || "").trim() === password) {
            console.log("LOGIN SUCCESS (Firestore):", firestoreUser.email);
            return res.json({
                message: "Login successful!",
                user: {
                    id: firestoreUser.id,
                    name: firestoreUser.name,
                    email: firestoreUser.email
                }
            });
        }

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

app.post("/api/performance", async (req, res) => {

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


        try {
            fs.writeFileSync(
                performanceFile,
                JSON.stringify(
                    performance,
                    null,
                    2
                )
            );
        } catch (fsErr) {
            console.warn("Local performance file write skipped:", fsErr.message);
        }

        // Sync to Firebase Firestore
        const firestoreResult = await savePerformanceToFirestore(result);
        console.log("Firestore sync result for student " + email + ":", firestoreResult);


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
app.get("/api/performance", async (req, res) => {
    try {
        const perfMap = new Map();

        // 1. Local performance
        if (fs.existsSync(performanceFile)) {
            try {
                const data = fs.readFileSync(performanceFile, "utf8");
                const localPerf = data.trim() ? JSON.parse(data) : [];
                localPerf.forEach(p => {
                    if (p && p.id) perfMap.set(String(p.id), p);
                });
            } catch (err) {
                console.warn("Local performance read warning:", err.message);
            }
        }

        // 2. Firestore performance
        try {
            const firestorePerf = await getPerformanceFromFirestore();
            if (Array.isArray(firestorePerf)) {
                firestorePerf.forEach(p => {
                    if (p && p.id) perfMap.set(String(p.id), p);
                });
            }
        } catch (fsErr) {
            console.warn("Firestore performance read warning:", fsErr.message);
        }

        const performance = Array.from(perfMap.values());
        return res.json(performance);

    } catch (error) {
        console.log("Performance loading error:", error);
        return res.status(500).json({
            error: "Unable to load performance"
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
app.get("/api/firebase-config", (req, res) => {
    try {
        const config = require("./firebase-applet-config.json");
        return res.json(config);
    } catch {
        return res.status(404).json({ error: "Firebase config not found" });
    }
});

module.exports = app;

if (!process.env.VERCEL) {
    const server =
        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `Server running on http://0.0.0.0:${PORT}`
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
}
