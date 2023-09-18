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

module.exports = router;