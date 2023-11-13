const daoCart = require('../dao/classes/cart.dao')
const CartDTO = require('../dao/DTOs/carts.dto');
const daoProduct = require ('../dao/classes/products.dao');
const { usersModel } = require('../dao/mongo/models/users.model');
const daoTickets = require('../dao/classes/tickets.dao'); 

const ticketsDao = new daoTickets();

const cartDao = new daoCart()
const ProductDAO = new daoProduct()




exports.getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const carritoBuscado = await cartDao.getCartById(cid);

        if (!carritoBuscado) {
            return res.status(404).json({ result: 'error', error: 'Carrito no encontrado.' });
        }

 
      

        res.json({ result: 'success', payload: carritoBuscado });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};

exports.createCart = async (req, res) => {
    try {
        const { uid } = req.body;
        const cart = await cartDao.createCart(uid);


        const cartDTO = new CartDTO(cart);

        res.status(201).json({ result: 'success', payload: cartDTO });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
    }
};



exports.addToCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid, quantity = 1 } = req.body;

        const result = await cartDao.addToCart(cid, pid, quantity);

        if (result.error) {
            return res.status(404).json({ result: "error", error: result.error });
        }

        res.status(200).json({ result: "success", payload: result.payload });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ result: "error", error: "Error interno del servidor." });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartDao.removeFromCart(cid, pid);

        if (result.error === "Carrito no existe") {
            return res.status(400).json({ result: "error", error: "Carrito no existe" });
        } else if (result.error === "Producto no existe en el carrito") {
            return res.status(400).json({ result: "error", error: "Producto no existe en el carrito" });
        }

        res.status(200).json({ result: "success", payload: result.payload });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartDao.clearCart(cid);

        if (result.error === "Carrito no existe") {
            return res.status(400).json({ result: "error", error: "Carrito no existe" });
        }

        res.status(200).json({ result: "success", payload: result.payload });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = parseInt(req.body.quantity);

        if (quantity <= 0) {
            return res.status(400).json({ result: "error", error: "Ingresar al menos una unidad del producto" });
        }

        const result = await cartDao.updateCartItem(cid, pid, quantity);

        if (result.error === "Producto o carrito no encontrado") {
            return res.status(404).json({ result: "error", error: result.error });
        } else if (result.error === "Producto no agregado al carrito") {
            return res.status(400).json({ result: "error", error: result.error });
        }

        res.status(200).json({ result: "success", payload: result.payload });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ result: "error", error: "Error interno del servidor." });
    }
};
exports.purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productsToPurchase = cart.products;
        const cartPurchase = cart.userId;

        const productAvaible = productsToPurchase.filter(p => p.product.stock !== 0);
        const productNoAvaible = productsToPurchase.filter(p => p.product.stock === 0);

        productAvaible.forEach(async (p) => {
            const productToSell = await ProductDAO.getProductById(p.product._id);
            productToSell.stock = productToSell.stock - p.quantity;
            await ProductDAO.updateProduct({ _id: p.product._id }, productToSell);
        });

        if (productAvaible.length > 0) {
            const ticketInfo = {
                code: 'll', // O cualquier valor de código que desees asignar
                amount: productsToPurchase.reduce((acc, productToPurchase) => {
                    acc += productToPurchase.precio * productToPurchase.quantity;
                    return acc;
                }, 0),
                purchaser: cartPurchase
            };
            
            const ticket = await ticketsDao.createTicket(ticketInfo);
            res.status(201).json({ result: 'success', payload: ticket });
        } else {
            res.status(400).json({ mensaje: 'No hay suficiente stock para comprar ningún producto' });
        }
    } catch (error) {
        console.error('Se ha producido un error:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
