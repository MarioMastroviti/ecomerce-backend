const mongoose = require('mongoose')

const usersCollection = "users"

const usersSchema = new mongoose.Schema({
   
    nombre: {
        type: String,
        required: true,
        max:50,
        min:3
    },
    
    apellido: {
        type: String,
        required: true,
        max: 50,
        min: 3
    },
    email: {
        type: String,
        required: true,
        max: 50,
        min: 10
    },

    dni: {
        type: Number,
        required: true,
         min: 7
    }
})

const usersModel = mongoose.model(usersCollection, usersSchema)

module.exports = {usersModel}