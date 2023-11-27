const mongoose = require('mongoose')
const mongoosePaginate =require('mongoose-paginate-v2')

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
   
    titulo: {
        type: String,
        required: true,
        max: 50,
        index: true
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
    },
    owner: {
        type: String, 
        required: true
        }
})
productsSchema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productsCollection, productsSchema)

module.exports = {productsModel}