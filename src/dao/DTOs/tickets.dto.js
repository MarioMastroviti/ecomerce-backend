class TicketDTO {
    constructor({ code, purchaseDate, amount, purchaser }) {
      this.code = code;
      this.purchaseDate = purchaseDate;
      this.amount = amount;
      this.purchaser = purchaser;
    }
  }
  
  module.exports = TicketDTO;
  