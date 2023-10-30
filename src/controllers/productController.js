const daoProduct = require ('../dao/classes/products.dao')
const ProductDTO = require('../dao/DTOs/products.dto'); 


const ProductDAO = new daoProduct()
exports.getProducts = async (req, res) => {
  try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sortOrder = req.query.sortOrder || "asc";
      const filtro = req.query.filtro;

      const products = await ProductDAO.getProducts({ filtro, limit, page, sortOrder });

      const productsDTO = products.map(product => new ProductDTO(product));

      res.send({ result: "success", payload: productsDTO });
  } catch (error) {
      console.log(error);
      res.status(500).send({ result: "error", message: "Internal Server Error" });
  }
};

  exports.getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      
      const product = await ProductDAO.getProductById(pid);
  
      if (!product) {
        return res.status(404).send({ result: "error", message: "Product not found" });
      }
  
      res.send({ result: "success", payload: product });
    } catch (error) {
      console.log(error);
      res.status(500).send({ result: "error", message: "Internal Server Error" });
    }
  };

  exports.createProduct = async (req, res) => {
    try {
        const { titulo, categoria, precio, stock, imagenes } = req.body;

        if (!titulo || !categoria || !precio || !stock) {
            return res.status(400).json({ result: "error", error: "Falta completar parámetros" });
        }

        const productDTO = new ProductDTO({
            titulo,
            categoria,
            precio,
            stock,
            imagenes: imagenes || []
        });

        const result = await ProductDAO.createProduct(productDTO);

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
  
      const result = await ProductDAO.updateProduct(pid, productUpdate);
  
      res.status(200).json({ result: "success", payload: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: "error", message: "Error interno del servidor" });
    }
  };

  exports.deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;
      const result = await ProductDAO.deleteProduct(pid);
  
      res.status(204).json({ result: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: "error", message: "Error interno del servidor" });
    }
  };