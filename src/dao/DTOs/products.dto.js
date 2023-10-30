class ProductDTO {
    constructor({ titulo, categoria, precio, stock, imagenes }) {
      this.titulo = titulo;
      this.categoria = categoria;
      this.precio = precio;
      this.stock = stock;
      this.imagenes = imagenes || []; 
    }
  }
  

  module.exports = ProductDTO;

