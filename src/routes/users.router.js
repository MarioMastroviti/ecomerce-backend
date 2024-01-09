const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController.js');
const { isAdmin } = require('../middleware/authorize.js');
const upload = require("../config/multer.js");
const passport = require('passport')
const { ro } = require('@faker-js/faker');



router.get('/', usersController.getAllUsers);

router.get('/profile', usersController.getProfile)

router.get("/restore" , usersController.getRestore)

router.get('/register' , usersController.getRegister);

router.get('/login' , usersController.getLogin)

router.post('/register', usersController.registerUser)

router.get("/failregister", usersController.failRegister);

router.post("/login", usersController.loginUser , usersController.handleLogin );

router.post('/restore', usersController.restorePassword);

router.put('/premiun/:userId', isAdmin, usersController.changeUserRole)

router.post('/:uid/documents',  upload.single("file"),usersController.postFiles);

router.delete('/deleteUserInactive/:uid', usersController.deleteUserInactive)

router.delete('/deleteUser/:userId' , usersController.deleteUser)


router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
  );
  
  router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    usersController.getLoginGit
  );
  

module.exports = router;
