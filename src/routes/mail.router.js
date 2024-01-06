const { Router } = require("express");

const emailController = require('../controllers/emailController');


const router = Router();

router.get("/", emailController.getEmail);

router.post("/enviar-correo", emailController.postEmail);

module.exports = router;
