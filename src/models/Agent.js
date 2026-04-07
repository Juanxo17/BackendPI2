import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    endpointUrl: { type: String, required: true },
    apiKey: { type: String, required: true },
    version: { type: String, required: true },
    // Soft delete para que las ejecuciones viejas no se rompan si "borramos" el agente
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Agent', agentSchema);
