import { agentService } from '../services/agentService.js';
import { responseHelper } from '../utils/responseHelper.js';

export const agentController = {
    async createAgent(req, res) {
        try {
            const agent = await agentService.createAgent(req.body);
            return responseHelper.success(res, 'Agente creado exitosamente', agent, 201);
        } catch (error) {
            return responseHelper.error(res, error.message, 400);
        }
    },

    async getAgents(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;

            const { agents, total } = await agentService.getAgents(page, limit, status);
            return responseHelper.paginated(res, 'Agentes listados correctamente', agents, total, page, limit);
        } catch (error) {
            return responseHelper.error(res, error.message, 400);
        }
    },

    async getAgentById(req, res) {
        try {
            const agent = await agentService.getAgentById(req.params.id);
            return responseHelper.success(res, 'Agente obtenido con éxito', agent);
        } catch (error) {
            return responseHelper.error(res, error.message, 404);
        }
    },

    async updateAgent(req, res) {
        try {
            const agent = await agentService.updateAgent(req.params.id, req.body);
            return responseHelper.success(res, 'Agente actualizado exitosamente', agent);
        } catch (error) {
            const statusCode = error.message === 'Agente no encontrado' ? 404 : 400;
            return responseHelper.error(res, error.message, statusCode);
        }
    },

    async deleteAgent(req, res) {
        try {
            const agent = await agentService.deleteAgent(req.params.id);
            return responseHelper.success(res, 'Agente desactivado (Soft Delete) exitosamente', agent);
        } catch (error) {
            return responseHelper.error(res, error.message, 404);
        }
    }
};