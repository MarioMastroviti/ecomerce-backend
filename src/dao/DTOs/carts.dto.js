class CartDTO {
    constructor({ uid, items }) {
      this.uid = uid;
      this.items = items || []; 
    }
  }
  
  module.exports = CartDTO;