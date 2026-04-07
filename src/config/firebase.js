import admin from 'firebase-admin'
import serviceAccount from './firebase-key.json' with { type: 'json' }


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase Admin inicializado correctamente");


export default admin;