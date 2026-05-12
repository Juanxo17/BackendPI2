import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filtrar por rol (admin, tester, viewer)
 *     responses:
 *       200:
 *         description: Lista de usuarios paginada recuperada con éxito
 */
router.get('/', verifyToken, userController.getUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de Mongoose del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', verifyToken, userController.getUserById);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Registra un nuevo usuario en la app (Mongo) y Firebase Auth
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@test.com
 *               password:
 *                 type: string
 *                 example: FuerteySegur0-
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               role:
 *                 type: string
 *                 enum: [admin, tester, viewer]
 *                 example: tester
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación o fallo de Firebase
 *       409:
 *         description: El usuario (correo) ya existe
 */
// Nota: ¡Esta ruta suele NO ser protegida con Token si es el registro libre general!
// Depende de tu regla de negocio. La dejaré descubierta simulando un "Registro" normal.
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualiza información de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Datos actualizados
 */
router.put('/:id', verifyToken, userController.updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Desactiva un usuario (Soft Delete) y bloquea su cuenta en Firebase
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *       403:
 *         description: Acción denegada (ej. borrar su propia cuenta admin)
 */
router.delete('/:id', verifyToken, userController.deleteUser);

export default router;
