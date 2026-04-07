import admin from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
    try {
        // 1. Buscamos el header de autorización en la petición
        const authHeader = req.headers.authorization;

        // 2. Verificamos si existe y si tiene el formato correcto "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'No se proporcionó un token de autenticación o el formato es incorrecto'
            });
        }

        // 3. Extraemos solo el string del token (separamos por el espacio y tomamos la segunda parte)
        const token = authHeader.split(' ')[1];

        // 4. Usamos Firebase Admin para verificar la firma y expiración del token
        const decodedToken = await admin.auth().verifyIdToken(token);

        // 5. Inyectamos los datos del usuario en la request
        // Esto es clave: los controladores posteriores podrán acceder a req.user.uid, req.user.email, etc.
        req.user = decodedToken;

        // 6. Todo correcto, damos paso a la siguiente función
        next();
    } catch (error) {
        console.error('Error verificando token de Firebase:', error);
        
        // Si el token expiró, está mal formado o fue revocado, cae aquí
        return res.status(401).json({
            status: 'error',
            message: 'Token inválido o expirado',
            // Opcional: enviamos el mensaje real del error para facilitar el debug desde el frontend
            error: error.message 
        });
    }
};
