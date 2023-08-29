const mongoose = require('mongoose')

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    
    descripcion: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true
    }
})

const productsModel = mongoose.model(productsCollection, productsSchema)

module.exports = {productsModel}