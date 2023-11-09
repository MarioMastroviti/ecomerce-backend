const mongoose = require('mongoose');

const cartCollection = "cart"

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: "users",
    required: true,
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      quantity: {type: Number, default: 1}
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const cartModel = mongoose.model(cartCollection, cartSchema);

module.exports = { cartModel };