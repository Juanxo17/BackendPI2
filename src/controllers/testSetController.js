import { testSetService } from '../services/testSetService.js';
import { responseHelper } from '../utils/responseHelper.js';
import User from '../models/User.js';

export const testSetController = {
    async createTestSet(req, res) {
        try {
            // El JWT de Firebase guarda el ID (uid) original de Firebase en req.user.uid
            // Buscamos el ID interno de Mongo para asociarlo como "creador"
            const user = await User.findOne({ uid: req.user.uid });
            if (!user) {
                return responseHelper.error(res, 'Usuario de origen no encontrado en la Base de Datos. Asegúrate de registrarte usando el POST de users primero.', 404);
            }

            // Inyectamos forzosamente el ObjectId del creador validado y borramos cualquier basura enviada en el body
            const testSetData = {
                ...req.body,
                createdBy: user._id
            };

            const testSet = await testSetService.createTestSet(testSetData);
            return responseHelper.success(res, 'TestSet creado exitosamente', testSet, 201);
        } catch (error) {
            return responseHelper.error(res, error.message, 400);
        }
    },

    async getTestSets(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const agentId = req.query.agentId;

            const { testSets, total } = await testSetService.getTestSets(page, limit, agentId, status);
            return responseHelper.paginated(res, 'TestSets listados correctamente', testSets, total, page, limit);
        } catch (error) {
            return responseHelper.error(res, error.message, 500);
        }
    },

    async getTestSetById(req, res) {
        try {
            const testSet = await testSetService.getTestSetById(req.params.id);
            return responseHelper.success(res, 'TestSet obtenido con éxito', testSet);
        } catch (error) {
            return responseHelper.error(res, error.message, 404);
        }
    },

    async updateTestSet(req, res) {
        try {
            const testSet = await testSetService.updateTestSet(req.params.id, req.body);
            return responseHelper.success(res, 'TestSet actualizado exitosamente', testSet);
        } catch (error) {
            const statusCode = error.message === 'TestSet no encontrado' ? 404 : 400;
            return responseHelper.error(res, error.message, statusCode);
        }
    },

    async deleteTestSet(req, res) {
        try {
            const testSet = await testSetService.deleteTestSet(req.params.id);
            return responseHelper.success(res, 'TestSet eliminado (Soft Delete) exitosamente', testSet);
        } catch (error) {
            return responseHelper.error(res, error.message, 404);
        }
    }
};