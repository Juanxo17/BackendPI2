import User from '../models/User.js';
import admin from '../config/firebase.js';

export const userService = {
    /**
     * Lista de usuarios con paginación y filtro por rol (solo activos)
     */
    async getUsers(page = 1, limit = 10, role) {
        const query = { isActive: true };
        if (role) query.role = role;

        const skip = (page - 1) * limit;

        // Ejecutar en paralelo el conteo y la búsqueda por rendimiento
        const [users, total] = await Promise.all([
            User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(query)
        ]);

        return { users, total };
    },

    /**
     * Obtener un usuario por su ID
     */
    async getUserById(id) {
        const user = await User.findOne({ _id: id, isActive: true });
        if (!user) throw new Error('Usuario no encontrado');
        return user;
    },

    /**
     * Crear un usuario nuevo (En Firebase y luego en MongoDB)
     */
    async createUser(userData) {
        const { email, password, name, role } = userData;

        // 1. Verificar si el usuario ya existe en Mongo
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado en el sistema');
        }

        try {
            // 2. Crear el usuario en Firebase Auth
            const firebaseRecord = await admin.auth().createUser({
                email,
                password,
                displayName: name,
            });

            // 3. Crear el registro en MongoDB vinculando el uid de Firebase
            const newUser = new User({
                uid: firebaseRecord.uid,
                name,
                email,
                role: role || 'tester' // tester por defecto si no lo envían
            });

            await newUser.save();
            return newUser;
            
        } catch (error) {
            // Si Firebase falla (ej. password muy corto), lanzamos el error al controlador
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    },

    /**
     * Actualizar datos del usuario (Solo MongoDB, no enviamos password aquí por simplicidad)
     */
    async updateUser(id, updateData) {
        // Asegurarnos de no sobreescribir campos protegidos como el uid o el _id
        delete updateData.uid;
        delete updateData._id;

        const updatedUser = await User.findOneAndUpdate(
            { _id: id, isActive: true }, 
            updateData, 
            { new: true, runValidators: true } // new: true devuelve el obj ya modificado
        );

        if (!updatedUser) throw new Error('Usuario no encontrado o ya fue eliminado');
        return updatedUser;
    },

    /**
     * Borrado Lógico (Soft Delete)
     * En lugar de borrar de la base de datos, lo marcamos como inactivo.
     */
    async deleteUser(id) {
        const user = await User.findOneAndUpdate(
            { _id: id, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!user) throw new Error('Usuario no encontrado o ya fue eliminado');
        
        // Deshabilitar el ingreso con firebase tambien
        try {
            await admin.auth().updateUser(user.uid, { disabled: true });
        } catch (error) {
            console.error("No se pudo deshabilitar en Firebase:", error);
            // No bloqueamos la ejecución si Firebase falla aquí, Mongo ya lo inhabilitó
        }

        return user;
    }
};
