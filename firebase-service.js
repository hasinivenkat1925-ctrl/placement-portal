const { initializeApp } = require("firebase/app");
const {
    initializeFirestore,
    doc,
    collection,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    getDocFromServer
} = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const firebaseConfig = require("./firebase-applet-config.json");

let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
    console.log("Firebase App & Firestore successfully initialized");
} catch (error) {
    console.error("Firebase initialization error:", error.message);
}

const OperationType = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    LIST: 'list',
    GET: 'get',
    WRITE: 'write',
};

function handleFirestoreError(error, operationType, docPath) {
    const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
            userId: null,
            email: null,
            emailVerified: null,
            isAnonymous: null,
            tenantId: null,
            providerInfo: []
        },
        operationType,
        path: docPath
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
    if (!db) return;
    try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Connected to Firestore successfully.");
    } catch (error) {
        if (error && error.message && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration.");
        }
    }
}

testConnection();

// ========================================
// USERS FIRESTORE SYNC
// ========================================

async function saveUserToFirestore(userData) {
    if (!db) return false;
    const docPath = `users/${userData.id}`;
    try {
        await setDoc(doc(db, "users", String(userData.id)), {
            id: String(userData.id),
            name: userData.name,
            email: String(userData.email).toLowerCase().trim(),
            password: userData.password,
            createdAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.warn("Firestore save user warning:", error.message);
        return false;
    }
}

async function findUserInFirestore(email) {
    if (!db) return null;
    const normEmail = String(email).toLowerCase().trim();
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", normEmail));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            return snapshot.docs[0].data();
        }
        return null;
    } catch (error) {
        console.warn("Firestore find user warning:", error.message);
        return null;
    }
}

async function getStudentsFromFirestore() {
    if (!db) return null;
    try {
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const list = [];
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            list.push({
                id: data.id,
                name: data.name,
                email: data.email
            });
        });
        return list;
    } catch (error) {
        console.warn("Firestore get students warning:", error.message);
        return null;
    }
}

async function deleteStudentFromFirestore(id) {
    if (!db) return false;
    try {
        await deleteDoc(doc(db, "users", String(id)));
        return true;
    } catch (error) {
        console.warn("Firestore delete student warning:", error.message);
        return false;
    }
}

// ========================================
// PERFORMANCE FIRESTORE SYNC
// ========================================

async function savePerformanceToFirestore(record) {
    if (!db) return false;
    const docPath = `performance/${record.id}`;
    try {
        await setDoc(doc(db, "performance", String(record.id)), {
            ...record,
            id: String(record.id)
        });
        return true;
    } catch (error) {
        console.warn("Firestore save performance warning:", error.message);
        return false;
    }
}

async function getPerformanceFromFirestore() {
    if (!db) return null;
    try {
        const perfRef = collection(db, "performance");
        const snapshot = await getDocs(perfRef);
        const list = [];
        snapshot.forEach(docSnap => {
            list.push(docSnap.data());
        });
        return list;
    } catch (error) {
        console.warn("Firestore get performance warning:", error.message);
        return null;
    }
}

module.exports = {
    db,
    app,
    OperationType,
    handleFirestoreError,
    testConnection,
    saveUserToFirestore,
    findUserInFirestore,
    getStudentsFromFirestore,
    deleteStudentFromFirestore,
    savePerformanceToFirestore,
    getPerformanceFromFirestore
};
