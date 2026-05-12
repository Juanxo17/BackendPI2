import TestSet from '../models/TestSet.js';

export const testSetService = {
    async createTestSet(testSetData) {
        const testSet = new TestSet(testSetData);
        await testSet.save();
        return testSet;
    },

    async getTestSets(page = 1, limit = 10, agentId, status) {
        const skip = (page - 1) * limit;
        const query = {};
        
        if (status) query.status = status;
        if (agentId) query.agentId = agentId;

        // Poblamos agentId y createdBy para que el frontend reciba los datos completos de esas referencias
        const [testSets, total] = await Promise.all([
            TestSet.find(query)
                .populate('agentId', 'name endpointUrl provider version')
                .populate('createdBy', 'name email role')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            TestSet.countDocuments(query)
        ]);

        return { testSets, total };
    },

    async getTestSetById(id) {
        const testSet = await TestSet.findById(id)
            .populate('agentId', 'name endpointUrl provider version')
            .populate('createdBy', 'name email role');
            
        if (!testSet) throw new Error('TestSet no encontrado');
        return testSet;
    },

    async updateTestSet(id, updateData) {
        const testSet = await TestSet.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!testSet) throw new Error('TestSet no encontrado');
        return testSet;
    },

    async deleteTestSet(id) {
        // Soft delete cambiando el status a 'deleted'
        const testSet = await TestSet.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });
        if (!testSet) throw new Error('TestSet no encontrado');
        return testSet;
    }
};