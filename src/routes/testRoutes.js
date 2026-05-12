import { Router } from 'express';
import { testController } from '../controllers/testController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Gestión de Casos de Prueba (Tests) para los TestSets
 */

/**
 * @swagger
 * /api/v1/tests:
 *   get:
 *     summary: Obtiene la lista de casos de prueba
 *     tags: [Tests]
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
 *         description: Cantidad por página
 *       - in: query
 *         name: testSetId
 *         schema:
 *           type: string
 *         description: Filtrar tests por un ID de TestSet específico
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, deleted]
 *     responses:
 *       200:
 *         description: Lista de tests recuperada con éxito
 */
router.get('/', verifyToken, testController.getTests);

/**
 * @swagger
 * /api/v1/tests/{id}:
 *   get:
 *     summary: Obtiene un test específico por su ID
 *     tags: [Tests]
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
 *         description: Test obtenido con éxito
 */
router.get('/:id', verifyToken, testController.getTestById);

/**
 * @swagger
 * /api/v1/tests:
 *   post:
 *     summary: Crea un nuevo caso de prueba
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - input
 *               - expectedOutput
 *               - category
 *               - priority
 *               - testSetId
 *             properties:
 *               input:
 *                 type: string
 *               expectedOutput:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: ['greeting', 'faq', 'error_handling', 'intent_recognition', 'context_retention', 'edge_case']
 *               priority:
 *                 type: string
 *                 enum: ['low', 'medium', 'high', 'critical']
 *                 default: 'medium'
 *               testSetId:
 *                 type: string
 *                 description: ObjectId del TestSet al que pertenece
 *     responses:
 *       201:
 *         description: Test creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', verifyToken, testController.createTest);

/**
 * @swagger
 * /api/v1/tests/{id}:
 *   put:
 *     summary: Actualiza un caso de prueba
 *     tags: [Tests]
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
 *               input:
 *                 type: string
 *               expectedOutput:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test actualizado
 */
router.put('/:id', verifyToken, testController.updateTest);

/**
 * @swagger
 * /api/v1/tests/{id}:
 *   delete:
 *     summary: Realiza un borrado lógico de un Test
 *     tags: [Tests]
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
 *         description: Test desactivado exitosamente
 */
router.delete('/:id', verifyToken, testController.deleteTest);

export default router;