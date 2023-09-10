const mongoose = require('mongoose');


const cartCollection = "cart"

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true }, 
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products', required:true }],
  quantity:{ type: Number, default : 1}
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = {cartModel};
