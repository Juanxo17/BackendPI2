import Run from '../models/Run.js';
import TestSet from '../models/TestSet.js';

export const runService = {
    async createRun(runData) {
        // Obtenemos el TestSet base para extraer la información automática y evitar que el frontend deba enviarla
        const testSet = await TestSet.findById(runData.testSet).populate('agentId');
        if (!testSet) throw new Error('TestSet no encontrado al intentar registrar la Ejecución');

        const run = new Run({
            ...runData,
            agent: testSet.agentId._id,
            agentVersion: testSet.agentId.version || '1.0'
        });

        await run.save();
        return run;
    },

    async getRuns(page = 1, limit = 10, testSetId) {
        const skip = (page - 1) * limit;
        const query = {};
        
        if (testSetId) query.testSet = testSetId;

        const [runs, total] = await Promise.all([
            Run.find(query)
                .populate('testSet', 'name')
                .populate('agent', 'name endpointUrl type')
                .populate('triggeredBy', 'name email')
                .skip(skip)
                .limit(limit)
                .sort({ started: -1 }), // Ordenadas de la ejecución más reciente a la más vieja
            Run.countDocuments(query)
        ]);

        return { runs, total };
    },

    async getRunById(id) {
        const run = await Run.findById(id)
            .populate('testSet', 'name description')
            .populate('agent', 'name')
            .populate('triggeredBy', 'name role')
            // Poblamos también los detalles internos de cada caso para saber cuál fue el Input original
            .populate('details.testId', 'input expectedOutput category');
            
        if (!run) throw new Error('Ejecución no encontrada');
        return run;
    },

    async updateRun(id, updateData) {
        const run = await Run.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!run) throw new Error('Ejecución no encontrada');
        return run;
    }
};