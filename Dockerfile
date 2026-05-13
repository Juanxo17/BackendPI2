# Usamos una imagen ligera de Node.js (Alpine)
FROM node:22-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero (para optimizar la caché de Docker)
COPY package*.json ./

# Instalamos las dependencias (solo para producción)
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa la app
EXPOSE 3001

# Comando por defecto para arrancar la app
CMD ["node", "index.js"]