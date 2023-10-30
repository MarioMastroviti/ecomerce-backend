const daoCart = require('../dao/classes/cart.dao')
const CartDTO = require('../dao/DTOs/carts.dto');

const cartDao = new daoCart()

exports.getCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        const carritoBuscado = await cartDao.getCartById(cid);

        if (!carritoBuscado) {
            return res.status(404).json({ result: 'error', error: 'Carrito no encontrado.' });
        }

 
        const cartDTO = new CartDTO(carritoBuscado);

        res.json({ result: 'success', payload: cartDTO });
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