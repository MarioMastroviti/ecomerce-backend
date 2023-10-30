const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController')


router.post('/', ticketController.createTicket)

router.get("/:tid", ticketController.getTicketById);

router.get("/", ticketController.getAllTickets);

router.put('/:tid', ticketController.updateTicketByCode);

router.delete('/:tid', ticketController.deleteTicketByCode)


module.exports = router;