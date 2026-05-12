import mongoose from 'mongoose';

const toJSONConfig = {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

const testSchema = new mongoose.Schema({
    input: { type: String, required: true }, // Front expected: 'input'
    expectedOutput: { type: String, required: true }, // Front expected: 'expectedOutput'
    
    // Categorías obligatorias según enum del Front
    category: { 
        type: String, 
        enum: ['greeting', 'faq', 'error_handling', 'intent_recognition', 'context_retention', 'edge_case'],
        required: true 
    },
    // Priority según front
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'critical'],
        required: true,
        default: 'medium'
    },
    
    // A qué set de pruebas pertenece
    testSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestSet', required: true },
    
    // Resultados de su última ejecución
    lastResult: { type: String, enum: ['pass', 'fail', 'partial', 'skipped'] },
    
    status: { type: String, enum: ['active', 'deleted'], default: 'active' }
}, { 
    timestamps: true,
    toJSON: toJSONConfig,
    toObject: toJSONConfig 
});

export default mongoose.model('Test', testSchema);
