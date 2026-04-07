import mongoose from 'mongoose';

const executionSchema = new mongoose.Schema({
    testSet: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSet', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    status: { 
        type: String, 
        enum: ['in_progress', 'completed', 'error'], 
        default: 'in_progress' 
    },
    // Progreso
    processedCases: { type: Number, default: 0 },
    totalCases: { type: Number, required: true },
    // Resultados individuales
    results: [{
        testCase: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' },
        agentResponse: { type: String },
        isPassed: { type: Boolean },
        errorMessage: { type: String }
    }],
    // Métricas globales
    successRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Execution', executionSchema);
