import { runService } from '../services/runService.js';
import { responseHelper } from '../utils/responseHelper.js';
import User from '../models/User.js';

export const runController = {
    async createRun(req, res) {
        try {
            const user = await User.findOne({ uid: req.user.uid });
            if (!user) {
                return responseHelper.error(res, 'Usuario de origen no encontrado en la Base de Datos.', 404);
            }

            const runData = {
                ...req.body,
                triggeredBy: user._id
            };

            const run = await runService.createRun(runData);
            return responseHelper.success(res, 'Ejecución (Run) registrada exitosamente', run, 201);
        } catch (error) {
            return responseHelper.error(res, error.message, 400);
        }
    },

    async getRuns(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const testSetId = req.query.testSetId;

            const { runs, total } = await runService.getRuns(page, limit, testSetId);
            return responseHelper.paginated(res, 'Ejecuciones listadas correctamente', runs, total, page, limit);
        } catch (error) {
            return responseHelper.error(res, error.message, 500);
        }
    },

    async getRunById(req, res) {
        try {
            const run = await runService.getRunById(req.params.id);
            return responseHelper.success(res, 'Ejecución obtenida con éxito', run);
        } catch (error) {
            return responseHelper.error(res, error.message, 404);
        }
    },

    async updateRun(req, res) {
        try {
            // Se usa típicamente para detener la ejecución y grabar el resultado final
            const run = await runService.updateRun(req.params.id, req.body);
            return responseHelper.success(res, 'Ejecución actualizada exitosamente', run);
        } catch (error) {
            const statusCode = error.message.includes('no encontrada') ? 404 : 400;
            return responseHelper.error(res, error.message, statusCode);
        }
    }
};