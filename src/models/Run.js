import mongoose from 'mongoose';

const toJSONConfig = {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

// Subdocumento para registrar literalmente qué respondió el agente para cada Input
const runDetailSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    agentOutput: { type: String },
    result: { type: String, enum: ['pass', 'fail', 'partial', 'skipped'] },
    latencyMs: { type: Number },
}, { _id: false }); 

const runSchema = new mongoose.Schema({
    testSet: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSet', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    agentVersion: { type: String, required: true },
    
    started: { type: Date, default: Date.now },
    duration: { type: String }, // Front lo espera como string, ej. "45s"
    
    status: { type: String, enum: ['completed', 'running', 'failed'], default: 'running' },
    
    // Métricas precalculadas que el Front exige consumir directo
    pass: { type: Number, default: 0 },
    fail: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    passRate: { type: Number, default: 0 },
    
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // El arreglo donde se guardará pregunta a pregunta
    details: [runDetailSchema]
}, { 
    timestamps: true,
    toJSON: toJSONConfig,
    toObject: toJSONConfig 
});

export default mongoose.model('Run', runSchema);
