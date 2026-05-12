import { userService } from '../services/userService.js';
import { responseHelper } from '../utils/responseHelper.js';

export const userController = {
    /**
     * Obtiene la lista paginada de usuarios
     */
    async getUsers(req, res) {
        try {
            // Extraer parámetros de la query string (con valores por defecto seguros)
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const role = req.query.role;

            const { users, total } = await userService.getUsers(page, limit, role);
            
            // Usar nuestro Helper estandarizado para respuestas paginadas
            return responseHelper.paginated(res, 'Usuarios listados correctamente', users, total, page, limit);
        } catch (error) {
            return responseHelper.error(res, 'Error al obtener usuarios', 500, error.message);
        }
    },

    /**
     * Obtiene un usuario específico por su ID
     */
    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            
            return responseHelper.success(res, 'Usuario encontrado', user);
        } catch (error) {
            // Si el servicio lanza error 'Usuario no encontrado', respondemos con 404
            const status = error.message.includes('No encontrado') ? 404 : 500;
            return responseHelper.error(res, error.message, status);
        }
    },

    /**
     * Crea un usuario (Tanto en Firebase Auth como en MongoDB)
     */
    async createUser(req, res) {
        try {
            // Pasamos todo el body al servicio (ahí están email, password, name, role)
            const userData = req.body;
            
            // Validaciones rápidas de formato a nivel de controlador
            if (!userData.email || !userData.password || !userData.name) {
                return responseHelper.error(res, 'Email, password y nombre son obligatorios', 400);
            }

            const newUser = await userService.createUser(userData);
            
            // HTTP 201: Created
            return responseHelper.success(res, 'Usuario registrado exitosamente', newUser, 201);
        } catch (error) {
            // Si el servicio choca por email repetido o Firebase falla, caeremos aquí
            const status = error.message.includes('ya está registrado') ? 409 : 400;
            return responseHelper.error(res, error.message, status);
        }
    },

    /**
     * Actualiza la información básica del usuario
     */
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            
            const updatedUser = await userService.updateUser(userId, updateData);
            return responseHelper.success(res, 'Usuario actualizado exitosamente', updatedUser);
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            return responseHelper.error(res, error.message, status);
        }
    },

    /**
     * Aplica borrado lógico al usuario y lo desactiva en Firebase
     */
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            // Validación de seguridad para que un Admin no se elimine a sí mismo
            // req.user viene desde nuestro authMiddleware
            if (req.user && req.user.uid) {
                const userToDelete = await userService.getUserById(userId);
                if (userToDelete.uid === req.user.uid) {
                    return responseHelper.error(res, 'No puedes eliminar tu propia cuenta a través de este endpoint comercial', 403);
                }
            }

            await userService.deleteUser(userId);
            
            // Responder éxito sin datos adjuntos
            return responseHelper.success(res, 'Usuario eliminado exitosamente del sistema');
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 500;
            return responseHelper.error(res, error.message, status);
        }
    }
};
