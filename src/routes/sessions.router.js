const express = require('express');
const router = express.Router();
const {usersModel} = require('../models/users.model.js')
const { createHash, isValidatePassword } = require('../../utils.js');

router.post('/register', async (req, res) => {
    let { first_name, last_name, email, age, password } = req.body;


    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }

    const hashedPassword = createHash(password);

    let user = await usersModel.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword
    });

    res.send({ status: "success", payload: user });
    console.log('Usuario registrado con éxito.' + user);
     res.redirect('/login');
});


router.get("/failuregister", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})



router.get('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "valores incorrectos" })
    const user = usersModel.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password })
    if (!user) return res.status(400).send({ status: "error", error: "usuario no encontrado" })
    if (!isValidatePassword(user, password)) return res.status(403).send({ status: "error", error: "Password incorrecto" })
   delete user.password
    req.session.user = user
    res.send({ status: "success", payload: user })
});


module.exports = router;