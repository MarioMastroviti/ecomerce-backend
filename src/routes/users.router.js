const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');
const { isAdmin } = require('../middleware/authorize.js');

router.get('/profile', usersController.getProfile)

router.get("/restore" , usersController.getRestore)

router.get('/register' , usersController.getRegister);

router.get('/login' , usersController.getLogin)

router.post('/register', usersController.registerUser)

router.get("/failregister", usersController.failRegister);

router.post("/login", usersController.loginUser , usersController.handleLogin );

router.post('/restore', usersController.restorePassword);

router.put('/changerole/:userId', isAdmin, usersController.changeUserRole)



module.exports = router;