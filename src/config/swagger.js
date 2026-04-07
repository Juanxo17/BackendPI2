import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
    definition: {
        openapi: '3.0.0', 
        info: {
            title: 'API de Evaluación de Agentes RAG',
            version: '1.0.0',
            description: 'Documentación de la API para pruebas de caja negra a agentes conversacionales.'
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`, 
                description: 'Servidor Local'
            }
        ],
        
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // El token de Firebase es un JWT
                }
            }
        }
    },
    
    apis: ['./src/routes/*.js'] // Buscará en todos los archivos .js dentro de la carpeta routes
};


const swaggerSpec = swaggerJSDoc(options);

//Exportamos una función que configurará la ruta en express
export const swaggerDocs = (app) => {
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Documentación disponible en http://localhost:${process.env.PORT || 3000}/api-docs`);
};