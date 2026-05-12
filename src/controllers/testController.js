import { testService } from '../services/testService.js';
import { responseHelper } from '../utils/responseHelper.js';

export const testController = {
    async createTest(req, res) {
        try {
            const test = await testService.createTest(req.body);
            return responseHelper.success(res, 'Caso de prueba creado exitosamente', test, 201);
        } catch (error) {
            return responseHelper.error(res, error.message, 400);
        }
    },

    async getTests(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const testSetId = req.query.testSetId;

            const { tests, total } = await testService.getTests(page, limit, testSetId, status);
            return responseHelper.paginated(res, 'Casos de prueba listados correctamente', tests, total, page, limit);
        } catch (error) {
            return responseHelper.error(res, error.message, 500);
        }
    },

    async getTestById(req, res) {
        try {
            const test = await testService.getTestById(req.params.id);
            return responseHelper.success(res, 'Caso de prueba obtenido con éxito', test);
        } catch (error) {
            return responseHelper.error(res, error.message, 404);
        }
    },

    async updateTest(req, res) {
        try {
            const test = await testService.updateTest(req.params.id, req.body);
            return responseHelper.success(res, 'Caso de prueba actualizado exitosamente', test);
        } catch (error) {
            const statusCode = error.message.includes('no encontrado') ? 404 : 400;
            return responseHelper.error(res, error.message, statusCode);
        }
    },

    async deleteTest(req, res) {
        try {
            const test = await testService.deleteTest(req.params.id);
            return responseHelper.success(res, 'Caso de prueba desactivado exitosamente', test);
        } catch (error) {
            return responseHelper.error(res, error.message, 404);
        }
    }
};