import mongoose from 'mongoose';

const testSetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    // Relación: Un set contiene múltiples IDs de casos de prueba
    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('TestSet', testSetSchema);
