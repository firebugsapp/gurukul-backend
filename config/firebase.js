const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
    throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_PATH is not configured"
    );
}

if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
        `Firebase service account file not found: ${serviceAccountPath}`
    );
}

const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
);

if (!admin.apps.length) {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    console.log("Firebase Admin SDK initialized successfully ✅");
}

module.exports = admin;
