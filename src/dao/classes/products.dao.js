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

getProductById = async (pid) =>  {
    try {
      const product = await productsModel.findOne({ _id: pid });
      return product;
    } catch (error) {
      
      throw error;
    }
  }
  

createProduct = async ({ titulo, categoria, precio, stock, imagenes }) => {
    try {
      const result = await productsModel.create({ titulo, categoria, precio, stock, imagenes });
      return result;
    } catch (error) {
      throw error; 
    }
  }
  
  updateProduct = async (pid, { titulo, categoria, precio, stock, imagenes }) => {
    try {
        const result = await productsModel.updateOne({ _id: pid }, { titulo, categoria, precio, stock, imagenes });
        return result;
    } catch (error) {
      throw error; 
    }
  }

  deleteProduct = async (pid) => {
    try {
        const result = await productsModel.deleteOne({ _id: pid });
        return result;
    } catch (error) {
      throw error; 
    }
  }

}





module.exports = ProductDAO;






