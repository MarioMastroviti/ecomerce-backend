const mongoose = require('mongoose')

const usersCollection = "users"

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        max: 50,
        min: 3
    },
    last_name: {
        type: String,
        required: true,
        max: 50,
        min: 3
    },
    email: {
        type: String,
        required: true,
        max: 50,
        min: 10,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 3
    },
    cart: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    }
})

async function cambiarRole(userId, nuevoRole) {
    try {
      
      const user = await usersModel.findById(userId);
  
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
  
       user.role = nuevoRole;
  
      
      await user.save();
  
      return { status: 'success', message: 'Rol cambiado exitosamente' };
    } catch (error) {
      console.error('Error al cambiar el rol del usuario:', error);
      return { status: 'error', error: 'Error interno del servidor' };
    }
  }


const usersModel = mongoose.model(usersCollection, usersSchema)

module.exports = { usersModel, cambiarRole }
