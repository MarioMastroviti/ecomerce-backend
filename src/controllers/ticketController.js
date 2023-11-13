const TicketsDAO = require('../dao/classes/tickets.dao'); 

const ticketsDao = new TicketsDAO();
const {CustomError} = require('../error/CustomError.js')
const {generateUserErrorInfo} = require('../error/info.js');
const ErrorCodes = require('../error/enums.js') 




exports.createTicket = async (req, res) => {
  try {
    const {code, amount, purchaser } = req.body;
 
    if (!code || !amount || !purchaser) {
      const error = CustomError.createError({
          name: 'Ticket creation error',
          cause: generateUserErrorInfo({ code, amount, purchaser }),
          message: 'Error trying to create Ticket',
          code: ErrorCodes.INVALID_TYPES_ERROR
      });

      throw error;
  }

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