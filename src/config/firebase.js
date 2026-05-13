import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS_BASE64) {
    // Si estamos en Render / Docker usará esta variable de entorno codificada en Base64
    const buffer = Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, 'base64');
    serviceAccount = JSON.parse(buffer.toString('utf-8'));
} else {
    // Si estamos en tu local, lee el archivo JSON normalmente
    const keyPath = path.join(__dirname, 'firebase-key.json');
    if (fs.existsSync(keyPath)) {
        serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    } else {
        console.error("❌ ERROR: No se encontró FIREBASE_CREDENTIALS_BASE64 ni el archivo firebase-key.json");
        process.exit(1);
    }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase Admin inicializado correctamente");

export default admin;