import mongoose from 'mongoose';

const toJSONConfig = {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

const testSetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    // Exigencia del Front: asociar un TestSet a un Agente y Creador
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Relación: Un set contiene múltiples IDs de casos de prueba
    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
    // Para no tener que contar el array cada vez, podemos llevar un contador
    testCount: { type: Number, default: 0 },
    // Soft delete
    status: { type: String, enum: ['active', 'deleted'], default: 'active' }
}, { 
    timestamps: true,
    toJSON: toJSONConfig,
    toObject: toJSONConfig 
});

export default mongoose.model('TestSet', testSetSchema);
