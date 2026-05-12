import Test from '../models/Test.js';
import TestSet from '../models/TestSet.js';

export const testService = {
    async createTest(testData) {
        const test = new Test(testData);
        await test.save();

        // Actualizamos el TestSet para registrar este nuevo caso
        await TestSet.findByIdAndUpdate(
            test.testSetId,
            { 
                $push: { testCases: test._id }, 
                $inc: { testCount: 1 } 
            }
        );

        return test;
    },

    async getTests(page = 1, limit = 10, testSetId, status) {
        const skip = (page - 1) * limit;
        const query = {};
        
        if (status) query.status = status;
        if (testSetId) query.testSetId = testSetId;

        const [tests, total] = await Promise.all([
            Test.find(query)
                .populate('testSetId', 'name')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Test.countDocuments(query)
        ]);

        return { tests, total };
    },

    async getTestById(id) {
        const test = await Test.findById(id).populate('testSetId', 'name');
        if (!test) throw new Error('Caso de prueba no encontrado');
        return test;
    },

    async updateTest(id, updateData) {
        const test = await Test.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!test) throw new Error('Caso de prueba no encontrado');
        return test;
    },

    async deleteTest(id) {
        // Soft delete
        const test = await Test.findByIdAndUpdate(id, { status: 'deleted' }, { new: true });
        if (!test) throw new Error('Caso de prueba no encontrado');

        // Opcional: Podríamos descontarlo del contador del TestSet, aunque mantenerlo con status deleted asegura consistencia histórica
        return test;
    }
};