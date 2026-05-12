import { Router } from 'express';
import { testSetController } from '../controllers/testSetController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TestSets
 *   description: Gestión de conjuntos de pruebas para evaluar agentes
 */

/**
 * @swagger
 * /api/v1/test-sets:
 *   get:
 *     summary: Obtiene la lista de TestSets
 *     tags: [TestSets]
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
 *         name: agentId
 *         schema:
 *           type: string
 *         description: Filtrar TestSets por ID de un Agente específico
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, deleted]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de TestSets recuperada con éxito
 */
router.get('/', verifyToken, testSetController.getTestSets);

/**
 * @swagger
 * /api/v1/test-sets/{id}:
 *   get:
 *     summary: Obtiene un TestSet específico por su ID
 *     tags: [TestSets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del TestSet (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: TestSet obtenido con éxito
 *       404:
 *         description: TestSet no encontrado
 */
router.get('/:id', verifyToken, testSetController.getTestSetById);

/**
 * @swagger
 * /api/v1/test-sets:
 *   post:
 *     summary: Crea un nuevo TestSet
 *     tags: [TestSets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - agentId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               agentId:
 *                 type: string
 *                 description: ObjectId del Agente asociado
 *               createdBy:
 *                 type: string
 *                 description: ObjectId del Usuario creador
 *     responses:
 *       201:
 *         description: TestSet creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', verifyToken, testSetController.createTestSet);

/**
 * @swagger
 * /api/v1/test-sets/{id}:
 *   put:
 *     summary: Actualiza un TestSet
 *     tags: [TestSets]
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
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, deleted]
 *     responses:
 *       200:
 *         description: TestSet actualizado
 *       404:
 *         description: TestSet no encontrado
 */
router.put('/:id', verifyToken, testSetController.updateTestSet);

/**
 * @swagger
 * /api/v1/test-sets/{id}:
 *   delete:
 *     summary: Realiza un borrado lógico (desactiva) a un TestSet
 *     tags: [TestSets]
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
 *         description: TestSet desactivado exitosamente
 *       404:
 *         description: TestSet no encontrado
 */
router.delete('/:id', verifyToken, testSetController.deleteTestSet);

export default router;