import { Router } from 'express';
import { agentController } from '../controllers/agentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: Gestión de Agentes Conversacionales (LLMs a evaluar)
 */

/**
 * @swagger
 * /api/v1/agents:
 *   get:
 *     summary: Obtiene la lista de agentes
 *     tags: [Agents]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, deprecated]
 *         description: Filtrar por estado del agente
 *     responses:
 *       200:
 *         description: Lista de agentes paginada recuperada con éxito
 */
router.get('/', verifyToken, agentController.getAgents);

/**
 * @swagger
 * /api/v1/agents/{id}:
 *   get:
 *     summary: Obtiene un agente específico por su ID
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del agente (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Información del agente obtenida con éxito
 *       404:
 *         description: Agente no encontrado
 */
router.get('/:id', verifyToken, agentController.getAgentById);

/**
 * @swagger
 * /api/v1/agents:
 *   post:
 *     summary: Crea un nuevo agente
 *     tags: [Agents]
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
 *               - endpointUrl
 *               - apiKey
 *               - version
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               endpointUrl:
 *                 type: string
 *               apiKey:
 *                 type: string
 *               provider:
 *                 type: string
 *                 default: 'custom'
 *               model:
 *                 type: string
 *                 default: 'custom-model'
 *               version:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, deprecated]
 *                 default: 'active'
 *     responses:
 *       201:
 *         description: Agente creado exitosamente
 *       400:
 *         description: Error de validación en los datos provistos
 */
router.post('/', verifyToken, agentController.createAgent);

/**
 * @swagger
 * /api/v1/agents/{id}:
 *   put:
 *     summary: Actualiza la información de un agente
 *     tags: [Agents]
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
 *               endpointUrl:
 *                 type: string
 *               apiKey:
 *                 type: string
 *               provider:
 *                 type: string
 *               model:
 *                 type: string
 *               version:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, deprecated]
 *     responses:
 *       200:
 *         description: Agente actualizado
 *       404:
 *         description: Agente no encontrado
 */
router.put('/:id', verifyToken, agentController.updateAgent);

/**
 * @swagger
 * /api/v1/agents/{id}:
 *   delete:
 *     summary: Realiza un borrado lógico (desactiva) a un agente
 *     tags: [Agents]
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
 *         description: Agente desactivado exitosamente
 *       404:
 *         description: Agente no encontrado
 */
router.delete('/:id', verifyToken, agentController.deleteAgent);

export default router;