const { Router } = require("express");

const emailController = require('../controllers/EmailController');


const router = Router();

router.get("/", emailController.getEmail);

router.post("/enviar-correo", emailController.postEmail);

module.exports = router;
