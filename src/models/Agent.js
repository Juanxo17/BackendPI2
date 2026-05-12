import mongoose from 'mongoose';

const toJSONConfig = {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    endpointUrl: { type: String, required: true },
    apiKey: { type: String, required: true },
    provider: { type: String, required: true, default: 'custom' },
    model: { type: String, required: true, default: 'custom-model' },
    version: { type: String, required: true },
    // Soft delete adaptado al frontend status
    status: { type: String, enum: ['active', 'inactive', 'deprecated'], default: 'active' }
}, { 
    timestamps: true,
    toJSON: toJSONConfig,
    toObject: toJSONConfig 
});

export default mongoose.model('Agent', agentSchema);
