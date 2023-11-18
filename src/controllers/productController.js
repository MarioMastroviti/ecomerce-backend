const daoProduct = require ('../dao/classes/products.dao')
const ProductDTO = require('../dao/DTOs/products.dto'); 
const {CustomError} = require('../error/CustomError.js')
const {generateUserErrorInfo, generateProductConsultErrorInfo} = require('../error/info.js');
const ErrorCodes = require('../error/enums.js') 
const {addLogger} = require('../utils/loggerCustom.js')



const ProductDAO = new daoProduct()

exports.getProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortOrder = req.query.sortOrder || 'asc';
    const filtro = req.query.filtro;

    const products = await ProductDAO.getProducts({ filtro, limit, page, sortOrder });

    const productsDTO = products.docs.map((product) => new ProductDTO(product));

    res.send({ result: 'success', payload: productsDTO });
  }  catch (error) {
    req.logger.warn(`Error in getProducts: ${error.message}`, { error });
      
    next(error);
  }
};



exports.getProductById = async (req, res) => {
  try {
   
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);

    const { pid } = req.params;

    if (pid < 0) {
      CustomError.createError({
        name: 'Invalid Params',
        cause: generateProductConsultErrorInfo(req.params.pid),
        message: 'Error to get product by ID',
        code: ErrorCodes.INVALID_PARAM
      });
    }

    const product = await ProductDAO.getProductById(pid);

    if (!product) {
      
      req.logger.warn(`Product not found for ID: ${pid}`);
      return res.status(404).send({ result: 'error', message: 'Product not found' });
    }

    res.send({ result: 'success', payload: product });
  } catch (error) {
   
    req.logger.warn(`Error in getProductById: ${error.message}`, { error });
    res.status(500).send({ result: 'error', message: 'Internal Server Error' });
  }
};
exports.createProduct = async (req, res) => {
  try {
      
      req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);

      const { titulo, categoria, precio, stock, imagenes } = req.body;

      if (!titulo || !categoria || !precio || !stock) {
          const error = CustomError.createError({
              name: 'product creation error',
              cause: generateUserErrorInfo({ titulo, categoria, precio, stock }),
              message: 'Error trying to create Product',
              code: ErrorCodes.INVALID_TYPES_ERROR
          });

          throw error;
      }

      const productDTO = new ProductDTO({
          titulo,
          categoria,
          precio,
          stock,
          imagenes: imagenes || []
      });

      const result = await ProductDAO.createProduct(productDTO);

      res.status(201).json({ result: 'success', payload: result });
  } catch (error) {
     
      req.logger.warn(`Error in createProduct: ${error.message}`, { error });

      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
      
      req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);

      const { pid } = req.params;
      const productUpdate = req.body;

      if (!productUpdate.titulo || !productUpdate.descripcion || !productUpdate.precio) {
          return res.status(400).json({ result: 'error', error: 'Faltan ingresar parámetros obligatorios' });
      }

      const result = await ProductDAO.updateProduct(pid, productUpdate);

      res.status(200).json({ result: 'success', payload: result });
  } catch (error) {
      
      req.logger.warn(`Error in updateProduct: ${error.message}`, { error });

      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
      
      req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);

      const { pid } = req.params;
      const result = await ProductDAO.deleteProduct(pid);

      res.status(204).json({ result: 'success', message: 'Producto eliminado exitosamente' });
  } catch (error) {
    
      req.logger.warn(`Error in deleteProduct: ${error.message}`, { error });

      console.error(error);
      res.status(500).json({ result: 'error', message: 'Internal Server Error' });
  }
};