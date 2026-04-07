# Plataforma de Evaluacion de Agentes RAG

Plataforma web para evaluar agentes de inteligencia artificial conversacionales mediante pruebas automatizadas de caja negra. Permite definir bancos de preguntas, ejecutarlas contra agentes externos y obtener metricas objetivas de su desempeño.

## Arquitectura y Stack Tecnologico

- Node.js + Express
- MongoDB (Atlas) + Mongoose
- Autenticacion: Firebase Auth
- Documentacion: Swagger (OpenAPI)

El proyecto sigue una arquitectura MVC adaptada para APIs REST con separacion de responsabilidades en rutas, controladores, servicios y middlewares.

## Requisitos Previos

- Node.js (v18 o superior recomendado)
- Cuenta y Cluster en MongoDB Atlas
- Proyecto en Firebase con Firebase Admin configurado

## Configuracion Local

1. Clonar el repositorio y navegar a la carpeta del proyecto.

2. Instalar las dependencias:
   npm install

3. Configurar variables de entorno:
   Crear un archivo .env en la raiz del proyecto basado en las siguientes variables:
   PORT=3000
   MONGO_URI=tu_cadena_de_conexion_de_atlas

4. Configurar Firebase:
   Colocar el archivo JSON con las credenciales de servicio de la cuenta de Firebase Admin dentro de la ruta src/config/ y nombrarlo firebase-key.json.

5. Levantar el servidor en modo desarrollo:
   npm run dev

La documentacion de la API (Swagger) estara disponible en: http://localhost:3000/api-docs
