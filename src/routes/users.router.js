const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js')


router.post('/register', usersController.registerUser)

router.get("/failregister", usersController.failRegister);

router.post("/login", usersController.loginUser , usersController.handleLogin);

router.post('/restore', usersController.restorePassword);

router.put('/changerole/:userId', usersController.changeUserRole)


module.exports = router;