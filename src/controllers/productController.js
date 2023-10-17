const {productsModel} = require('../dao/mongo/models/products.model.js');

exports.getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sortOrder = req.query.sortOrder || "asc";
        const filtro = req.query.filtro;

        let products = await productsModel.paginate({ filtro }, { limit: limit, page: page, sort: { precio: sortOrder } });

        res.send({ result: "success", payload: products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Internal Server Error" });
    }
};


exports.getProductById = async (req, res) => {
    try {
        let { pid } = req.params;
        let product = await productsModel.findOne({ _id: pid });

        if (!product) {
            return res.status(404).send({ result: "error", message: "Product not found" });
        }

        res.send({ result: "success", payload: product });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Internal Server Error" });
    }
};

exports.createProduct = async (req,res) => {
    try {
        const { titulo, categoria, precio, stock, imagenes } = req.body;

        if (!titulo || !categoria || !precio || !stock) {
            return res.status(400).json({ result: "error", error: "Falta completar parámetros" });
        }

        const result=  await productsModel.create({ titulo, categoria, precio, stock, imagenes: [] });

        res.status(201).json({ result: "success", payload: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "error", message: "Internal Server Error" });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const productUpdate = req.body;

        if (!productUpdate.titulo || !productUpdate.descripcion || !productUpdate.precio) {
            return res.status(400).json({ result: "error", error: "Faltan ingresar parámetros obligatorios" });
        }

    
        const result = await productsModel.updateOne({ _id: pid }, productUpdate);

       
        res.status(200).json({ result: "success", payload: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "error", message: "Error interno del servidor" });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;

        
        const result = await productsModel.deleteOne({ _id: pid });

         res.status(204).json({ result: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "error", message: "Error interno del servidor" });
    }
};