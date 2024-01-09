const { cartModel } = require('../mongo/models/cart.model.js');
const { productsModel } = require('../mongo/models/products.model.js');
const {usersModel} = require('../mongo/models/users.model.js')


class cartDao {


    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findOne({ _id: cartId });
            return cart;
        } catch (error) {

            throw error;
        }
    }

    
  getPopulatedCart = async (cartId) => {
    try {
      const cart = await cartModel
        .findOne({ _id: cartId })
        .populate('products.product'); 

      return cart;
    } catch (error) {
      throw error;
    }
  }



    createCart = async (userId) =>{
        try {
            const result = await cartModel.create({ userId })
            return result
        }
        catch (error) {
            throw error;
        }
    }

    addToCart = async (cartId, productId, quantity = 1) => {
        try {
            const carrito = await cartModel.findOne({ _id: cartId });
            const product = await productsModel.findOne({ _id: productId });
    
            if (!product || !carrito) {
                return { error: "Producto o carrito no encontrado" };
            }
    
            const existingProduct = carrito.products.find(item => item && item.product && item.product.equals(productId));
    
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity: quantity });
            }
    
            let totalPrice = 0;
            carrito.products.map((p) => {
                const productPrice = p.product.price || 0;
                totalPrice += productPrice * p.quantity;
            });
    
            carrito.totalPrice = totalPrice;
    
            await cartModel.updateOne({ _id: cartId }, carrito);
    
            return { success: true, payload: carrito };
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            return { error: "Error interno del servidor" };
        }
    };


    removeFromCart = async (cartId, productId) => {
        try {
            const carrito = await cartModel.findOne({ _id: cartId });
            if (!carrito) {
                return { error: "Carrito no existe" };
            }

            const existingProductIndex = carrito.products.findIndex(item => item.product == productId);

            if (existingProductIndex === -1) {
                return { error: "Producto no existe en el carrito" };
            } else {
                carrito.products.splice(existingProductIndex, 1);
                await carrito.save();
                return { success: true, payload: carrito };
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            return { error: "Error interno del servidor" };
        }
    }

    clearCart = async (cartId) => {
        try {
            const carrito = await cartModel.findOne({ _id: cartId });
            if (!carrito) {
                return { error: "Carrito no existe" };
            }

            carrito.products.splice(0, carrito.products.length);
            await carrito.save();
            return { success: true, payload: carrito };
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
            return { error: "Error interno del servidor" };
        }
    }

    updateCartItem = async (cartId, productId, quantity) => {
        try {
            if (quantity <= 0) {
                return { error: "Ingresar al menos una unidad del producto" };
            }

            const carrito = await cartModel.findOne({ _id: cartId });
            const product = await productsModel.findOne({ _id: productId });

            if (!product || !carrito) {
                return { error: "Producto o carrito no encontrado" };
            }

            const existingProduct = carrito.products.find(item => item && item.product && item.product.equals(productId));

            if (existingProduct) {
                existingProduct.quantity = quantity;
            } else {
                return { error: "Producto no agregado al carrito" };
            }

            await cartModel.updateOne({ _id: cartId }, carrito);

            return { success: true, payload: carrito };
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            return { error: "Error interno del servidor" };
        }
    }


}



module.exports = cartDao;