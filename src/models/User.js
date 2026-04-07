import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // UID de Firebase para vincular ambas bases de datos
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['evaluator', 'admin'], default: 'evaluator' },
    // Soft delete para mantener trazabilidad
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
