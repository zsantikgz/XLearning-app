const admin = require("firebase-admin");
const serviceAccount = require("../src/serviceAccountKey.json"); 

// Inicializamos la app de Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Exportamos la instancia de Firestore
const db = admin.firestore();

module.exports = db;
