import connectDB from './src/config/db.js'
import admin from './src/config/firebase.js'
import 'dotenv/config';
import express from 'express'
import { swaggerDocs } from './src/config/swagger.js';

connectDB();
const app = express()

app.use(express.json());

swaggerDocs(app);

app.listen(process.env.PORT)

console.log("Server running on port 3001")