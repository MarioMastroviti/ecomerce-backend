const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController')


router.post('/', ticketController.createTicket)

router.get("/:tid", ticketController.getTicketById);

module.exports = router;

