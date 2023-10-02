const mongoose = require('mongoose');

const cartCollection = "cart"

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: {type: Number, default: 1}
    }
  ]
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = { cartModel };