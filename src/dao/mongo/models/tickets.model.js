const mongoose = require('mongoose');


const ticketsCollection = "tickets"


const ticketSchema = new mongoose.Schema({
  code: {
    type: String, 
    unique: true, 
    required: true, 
  },
  purchaseDate: {
    type: Date, 
    default: Date.now, 
  },
  amount: {
    type: Number, 
    required: true, 
  },
  purchaser: {
    type: String,
    required: true
  }
  
});


const Ticket = mongoose.model(ticketsCollection, ticketSchema);

module.exports = {Ticket};
