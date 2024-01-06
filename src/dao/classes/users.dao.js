const { usersModel } = require('../mongo/models/users.model')
const { createHash } = require('../../utils/utils');




class UserDao {

    getAllUsers = async () => {
        try {
            const users = await usersModel.find({}, { first_name: 1, last_name: 1, email: 1, age: 1, role: 1 });
            return users;
        } catch (error) {
            throw error;
        }
    }

    createUser = async ({ first_name, last_name, email, age, password }) => {
        try {

            const hashedPassword = createHash(password);
            await usersModel.create({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword
            });
        } catch (error) {
            throw error;
        }
    }

    findUserByEmail = async (email) => {
        try {
            return await usersModel.findOne({ email: email });
        } catch (error) {
            throw error;
        }
    }

    findUserById = async (uid) => {
        try {
            return await usersModel.findOne({ _id: uid });
        } catch (error) {
            throw error;
        }
    }

    deleteUser = async (uid) => {
        try {
            const result = await usersModel.deleteOne({ _id: uid });
            return result;
        } catch (error) {
            throw error;
        }
    }

    updatePassword = async (userId, newPassword) => {
        try {
            const hashedPassword = createHash(newPassword);
            await usersModel.updateOne({ _id: userId }, { password: hashedPassword });
        } catch (error) {
            throw error;
        }
    }

    changeUserRole = async (userId, nuevoRole) => {
        try {
            const result = await usersModel.updateOne({ _id: userId }, { role: nuevoRole });
            return result;
        } catch (error) {
            throw error;
        }
    }


    postFiles = async (uid, name, file) => {
        try {
            const result = await usersModel.findOneAndUpdate(
                { _id: uid },
                { $push: { documents: { name, reference: file } } },
                { new: true }
            );
            return result;
        } catch (error) {
            console.error('Error al procesar la carga de archivos en el DAO:', error);
            return null;
        }
    };

    updateLastConnection = async (uid) => {
        try {
            const user = await usersModel.findOneAndUpdate(
                { _id: uid },
                { $set: { last_connection: new Date() } },
                { new: true } 
            );

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = UserDao;