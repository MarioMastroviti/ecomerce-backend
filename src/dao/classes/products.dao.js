const { productsModel } = require('../mongo/models/products.model');

class ProductDAO {

 getProducts = async ({ filtro, limit, page, sortOrder }) => {
    try {
      const products = await productsModel.paginate({ filtro }, { limit, page, sort: { precio: sortOrder } });
      return products;
    } catch (error) {
    throw error;
  }
 
}

getProductById = async (productId) =>  {
    try {
      const product = await productsModel.findById({ _id: productId });
      return product;
    } catch (error) {
      
      throw error;
    }
  }
  

createProduct = async ({ titulo, categoria, precio, stock, imagenes, owner }) => {
    try {
      const result = await productsModel.create({ titulo, categoria, precio, stock, imagenes, owner });
      return result;
    } catch (error) {
      throw error; 
    }
  }
  
  updateProduct = async (pid, { titulo, categoria, precio, stock, imagenes, owner }) => {
    try {
        const result = await productsModel.updateOne({ _id: pid }, { titulo, categoria, precio, stock, imagenes, owner });
        return result;
    } catch (error) {
      throw error; 
    }
  }

  deleteProduct = async (productId) => {
    try {
        const result = await productsModel.deleteOne({ _id: productId });
        return result;
    } catch (error) {
      throw error; 
    }
  }

}





module.exports = ProductDAO;






