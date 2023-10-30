const TicketsDAO = require('../dao/classes/tickets.dao'); 

const ticketsDao = new TicketsDAO();

function generateUniqueCode(length) {
    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

exports.createTicket = async (req, res) => {
  try {
    const { amount, purchaser } = req.body;
    const code = generateUniqueCode();

    const ticket = await ticketsDao.createTicket(code, amount, purchaser);
    res.status(201).json({ result: 'success', payload: ticket });
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await ticketsDao.getTicketById(id);
    if (!ticket) {
      return res.status(404).json({ result: 'error', error: 'Ticket no encontrado' });
    }
    res.json({ result: 'success', payload: ticket });
  } catch (error) {
    console.error('Error al obtener el ticket:', error);
    res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketsDao.getAllTickets();
    res.json({ result: 'success', payload: tickets });
  } catch (error) {
    console.error('Error al obtener los tickets:', error);
    res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
  }
};

exports.updateTicketByCode = async (req, res) => {
    try {
      const { id } = req.params;
      const { newAmount } = req.body;
      const ticket = await ticketsDao.updateTicketByCode(id, newAmount);
      res.json({ result: 'success', payload: ticket });
    } catch (error) {
      console.error('Error al actualizar el ticket:', error);
      res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
    }
  };
  
  exports.deleteTicketByCode = async (req, res) => {
    try {
      const { id } = req.params;
      await ticketsDao.deleteTicketByCode(id);
      res.json({ result: 'success', message: 'Ticket eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el ticket:', error);
      res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
    }
  };