import { Router } from 'express';
import { runController } from '../controllers/runController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Runs
 *   description: Tracking y reporte de las Ejecuciones Automáticas
 */

/**
 * @swagger
 * /api/v1/runs:
 *   get:
 *     summary: Obtiene la lista de ejecuciones (historial)
 *     tags: [Runs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: testSetId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de ejecuciones recuperada
 */
router.get('/', verifyToken, runController.getRuns);

/**
 * @swagger
 * /api/v1/runs/{id}:
 *   get:
 *     summary: Obtiene el detalle profundo de una Ejecución y sus resultados
 *     tags: [Runs]
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
 *         description: Ejecución obtenida con éxito
 */
router.get('/:id', verifyToken, runController.getRunById);

/**
 * @swagger
 * /api/v1/runs:
 *   post:
 *     summary: Inicia o registra una nueva Ejecución de un TestSet
 *     tags: [Runs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testSet
 *             properties:
 *               testSet:
 *                 type: string
 *                 description: ID del TestSet que se va a correr
 *               status:
 *                 type: string
 *                 enum: [completed, running, failed]
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     testId:
 *                       type: string
 *                     agentOutput:
 *                       type: string
 *                     result:
 *                       type: string
 *                     latencyMs:
 *                       type: number
 *     responses:
 *       201:
 *         description: Ejecución registrada exitosamente
 */
router.post('/', verifyToken, runController.createRun);

/**
 * @swagger
 * /api/v1/runs/{id}:
 *   put:
 *     summary: Actualiza el estado/métricas de una ejecución en curso
 *     tags: [Runs]
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
 *               status:
 *                 type: string
 *               duration:
 *                 type: string
 *               pass:
 *                 type: number
 *               fail:
 *                 type: number
 *               total:
 *                 type: number
 *               passRate:
 *                 type: number
 *               details:
 *                 type: array
 *     responses:
 *       200:
 *         description: Ejecución actualizada
 */
router.put('/:id', verifyToken, runController.updateRun);

export default router;