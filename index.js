import 'dotenv/config'; // ¡Importante siempre como primera línea!
import express from 'express';
import connectDB from './src/config/db.js';
import admin from './src/config/firebase.js';
import { swaggerDocs } from './src/config/swagger.js';
import userRoutes from './src/routes/userRoutes.js';
import agentRoutes from './src/routes/agentRoutes.js';
import testSetRoutes from './src/routes/testSetRoutes.js';
import testRoutes from './src/routes/testRoutes.js';
import runRoutes from './src/routes/runRoutes.js';

connectDB();
const app = express();

app.use(express.json());

// Inyectamos los enrutadores en las rutas base
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/test-sets', testSetRoutes);
app.use('/api/v1/tests', testRoutes);
app.use('/api/v1/runs', runRoutes);

swaggerDocs(app);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});