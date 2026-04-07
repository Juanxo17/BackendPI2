import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    question: { type: String, required: true },
    expectedResponse: { type: String, required: true },
    category: { type: String, required: true, default: 'General' },
    validationCriteria: [{ type: String }],
    weight: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('TestCase', testCaseSchema);
