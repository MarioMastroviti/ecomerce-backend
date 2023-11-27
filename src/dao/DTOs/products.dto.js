class ProductDTO {
    constructor({ titulo, categoria, precio, stock, imagenes, owner }) {
      this.titulo = titulo;
      this.categoria = categoria;
      this.precio = precio;
      this.stock = stock;
      this.imagenes = imagenes || []; 
      this.owner = owner;
    }
  }
  

  module.exports = ProductDTO;

