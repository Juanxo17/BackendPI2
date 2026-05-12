import Agent from '../models/Agent.js';

export const agentService = {
    async createAgent(agentData) {
        const agent = new Agent(agentData);
        await agent.save();
        return agent;
    },

    async getAgents(page = 1, limit = 10, status) {
        const skip = (page - 1) * limit;
        const query = {};
        if (status) {
            query.status = status;
        }

        const [agents, total] = await Promise.all([
            Agent.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Agent.countDocuments(query)
        ]);

        return { agents, total };
    },

    async getAgentById(id) {
        const agent = await Agent.findById(id);
        if (!agent) throw new Error('Agente no encontrado');
        return agent;
    },

    async updateAgent(id, updateData) {
        const agent = await Agent.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!agent) throw new Error('Agente no encontrado');
        return agent;
    },

    async deleteAgent(id) {
        // Soft delete cambiando el estado a 'inactive' en lugar de borrarlo físicamente
        const agent = await Agent.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
        if (!agent) throw new Error('Agente no encontrado');
        return agent;
    }
};