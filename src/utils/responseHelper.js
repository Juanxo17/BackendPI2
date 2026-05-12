/**
 * Helper para estandarizar las respuestas de la API
 * basándonos en los contratos ApiResponse y PaginatedResponse del Frontend.
 */

export const responseHelper = {
    /**
     * Respuesta exitosa estándar (ApiResponse)
     * @param {Object} res - Objeto response de Express
     * @param {String} message - Mensaje descriptivo
     * @param {Object|Array} data - Datos a devolver (Payload)
     * @param {Number} statusCode - Código HTTP (Por defecto 200)
     */
    success: (res, message, data = {}, statusCode = 200) => {
        return res.status(statusCode).json({
            message,
            data
        });
    },

    /**
     * Respuesta exitosa paginada (PaginatedResponse)
     * @param {Object} res - Objeto response de Express
     * @param {String} message - Mensaje descriptivo
     * @param {Array} data - Arreglo de datos (Lista)
     * @param {Number} total - Total de registros en la DB
     * @param {Number} page - Página actual solicitada
     * @param {Number} limit - Límite de registros por página
     * @param {Number} statusCode - Código HTTP (Por defecto 200)
     */
    paginated: (res, message, data, total, page, limit, statusCode = 200) => {
        const totalPages = Math.ceil(total / limit);
        
        return res.status(statusCode).json({
            message,
            data,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages
            }
        });
    },

    /**
     * Respuesta de Error estándar
     * @param {Object} res - Objeto response de Express
     * @param {String} message - Mensaje de error para el usuario/frontend
     * @param {Number} statusCode - Código HTTP (Ej: 400, 401, 404, 500)
     * @param {Object|String} errorDetails - (Opcional) Detalles técnicos del error para debug
     */
    error: (res, message, statusCode = 500, errorDetails = null) => {
        const response = { message };
        
        // Si hay detalles de error y estamos en desarrollo, los inyectamos en la respuesta
        if (errorDetails && process.env.NODE_ENV !== 'production') {
            response.errorDetails = errorDetails;
        }

        return res.status(statusCode).json(response);
    }
};
