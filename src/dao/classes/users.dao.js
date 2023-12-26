const {usersModel} = require('../mongo/models/users.model')
const { createHash } = require('../../utils/utils');




class UserDao {
    
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

findUserByEmail = async(email) => {
        try {
            return await usersModel.findOne({ email: email });
        } catch (error) {
            throw error;
        }
    }

 updatePassword = async(userId, newPassword) =>{
        try {
            const hashedPassword = createHash(newPassword);
            await usersModel.updateOne({ _id: userId }, { password: hashedPassword });
        } catch (error) {
            throw error;
        }
    }

changeUserRole = async(userId, nuevoRole) =>{
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
    
    
}

module.exports = UserDao;