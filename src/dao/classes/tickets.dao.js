const { Ticket } = require('../mongo/models/tickets.model');
const TicketDTO = require('../DTOs/tickets.dto');

class TicketsDAO {
  createTicket = async (code, amount, purchaser) => {
    try {
      const ticket = new Ticket({
        code,
        amount,
        purchaser,
      });
      await ticket.save();
      return new TicketDTO(ticket);
    } catch (error) {
      throw error;
    }
  }

  getTicketById = async (tid) => {
    try {
      const ticket = await Ticket.findOne({ _id: tid });
      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }
      return new TicketDTO(ticket);
    } catch (error) {
      throw error;
    }
  }

  getAllTickets = async () => {
    try {
      const tickets = await Ticket.find();
      return tickets.map((ticket) => new TicketDTO(ticket)); 
    } catch (error) {
      throw error;
    }
  }

  updateTicketByCode = async (tid, newAmount) => {
    try {
      const ticket = await Ticket.findOne({ _id: tid });
      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }

      ticket.amount = newAmount;
      await ticket.save();
      return new TicketDTO(ticket); 
    } catch (error) {
      throw error;
    }
  }

  deleteTicketByCode = async (tid) => {
    try {
      const result = await Ticket.deleteOne({ _id: tid });
      if (result.deletedCount === 0) {
        throw new Error('Ticket no encontrado');
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TicketsDAO;
