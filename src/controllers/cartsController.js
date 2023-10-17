const { cartModel } = require('../dao/mongo/models/cart.model.js');
const { productsModel } = require('../dao/mongo/models/products.model.js');


exports.getCartById = async (req, res) => {
    try {
        const { cid } = req.params;

        const carritoBuscado = await cartModel.findOne({ _id: cid });

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

        const cart = await cartModel.create({ user: uid });

        res.status(201).json({ result: 'success', payload: cart });

    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
    }
};


exports.addToCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid, quantity = 1 } = req.body;

        const carrito = await cartModel.findOne({ _id: cid });
        const product = await productsModel.findOne({ _id: pid });

        if (!product || !carrito) {
            return res.status(404).json({ result: "error", error: "Producto o carrito no encontrado" });
        }

        const existingProduct = carrito.products.find(item => item && item.product && item.product.equals(pid));

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            carrito.products.push({ product: pid, quantity: quantity });
        }

        await cartModel.updateOne({ _id: cid }, carrito);

        res.status(200).json({ result: "success", payload: carrito });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).json({ result: "error", error: "Error interno del servidor." });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const carrito = await cartModel.findOne({ _id: cid });
        if (!carrito) {
            return res.status(400).json({ result: "error", error: "Carrito no existe" });
        }

        const existingProductIndex = carrito.products.findIndex(item => item.product == pid);

        if (existingProductIndex === -1) {
            return res.status(400).json({ result: "error", error: "Producto no existe en el carrito" });
        } else {
            carrito.products.splice(existingProductIndex, 1);
            await carrito.save();
        }

        res.status(200).json({ result: "success", payload: carrito });

    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};


exports.clearCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const carrito = await cartModel.findOne({ _id: cid });
        if (!carrito) {
            return res.status(400).json({ result: "error", error: "Carrito no existe" });
        }

        carrito.products.splice(0, carrito.products.length);
        await carrito.save();

        res.status(200).json({ result: "success", payload: carrito });

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

        const carrito = await cartModel.findOne({ _id: cid });
        const product = await productsModel.findOne({ _id: pid });

        if (!product || !carrito) {
            return res.status(404).json({ result: "error", error: "Producto o carrito no encontrado" });
        }

        const existingProduct = carrito.products.find(item => item && item.product && item.product.equals(pid));

        if (existingProduct) {
            existingProduct.quantity = quantity;
        } else {
            return res.status(400).json({ result: "error", error: "Producto no agregado al carrito" });
        }

        await cartModel.updateOne({ _id: cid }, carrito);

        res.status(200).json({ result: "success", payload: carrito });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ result: "error", error: "Error interno del servidor." });
    }
};