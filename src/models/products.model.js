const mongoose = require('mongoose')

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
   
    titulo: {
        type: String,
        required: true,
        max: 50
    },
    
    categoria: {
        type: String,
        required: true,
        max: 20,
               
    },

    precio: {
        type: Number,
        required: true,
        },

    stock: {
        type: Number,
        required: true
    },

    imagenes: {
        type: Array,
        required: false
    }
})

const productsModel = mongoose.model(productsCollection, productsSchema)

module.exports = {productsModel}