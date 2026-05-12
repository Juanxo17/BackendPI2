import mongoose from 'mongoose';

// Configuración común de utilidades para convertir _id a id para el frontend
const toJSONConfig = {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

const userSchema = new mongoose.Schema({
    // Guardamos el UID de Firebase para vincular ambas bases de datos
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'tester', 'viewer'], default: 'tester' },
    // Soft delete para mantener trazabilidad
    isActive: { type: Boolean, default: true }
}, { 
    timestamps: true,
    toJSON: toJSONConfig,
    toObject: toJSONConfig 
});

export default mongoose.model('User', userSchema);
