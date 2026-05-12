import 'dotenv/config';

// ⚠️ Cambia esto por un correo y contraseña de un usuario que YA exista en la pestaña Auth de Firebase Test
const email = "testerdeverdad@test.com";
const password = "Password123!";

async function getFirebaseToken() {
    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
        console.error("❌ Falla: No encuntro FIREBASE_API_KEY en tu .env");
        return;
    }

    try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true })
        });

        const data = await response.json();

        if (data.error) {
            console.error("❌ Error de Firebase:", data.error.message);
        } else {
            console.log("✅ Token obtenido con éxito. Pégalo en Swagger (Authorize):");
            console.log("\n" + data.idToken + "\n");
        }
    } catch (error) {
        console.error("❌ Error en la petición:", error.message);
    }
}

getFirebaseToken();
