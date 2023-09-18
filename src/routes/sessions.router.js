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
     res.redirect('/login');
});


router.get("/failuregister", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "valores incorrectos" })
    
    try {
        const user = await usersModel.findOne({ email: email })
    
        if (!user) {
            return res.status(400).send({ status: "error", error: "Usuario no encontrado" })
        }

        if (!isValidatePassword(user, password)) {
            return res.status(403).send({ status: "error", error: "Contraseña incorrecta" })
        }
        
        req.session.user = user
        res.redirect('/profile');
    
    } catch (error) {
        console.error("Error al autenticar usuario:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" })
    }
})

router.post('/restore', async (req, res) => {
    const { email, new_password, confirm_password } = req.body;

  
    if (new_password !== confirm_password) {
        return res.status(400).send({ status: "error", error: "Las contraseñas no coinciden" });
    }

    try {
        const user = await usersModel.findOne({ email: email });
        if (!user) {
            return res.status(400).send({ status: "error", error: "Usuario no encontrado" })
        }

        const hashedPassword = createHash(new_password);

        await usersModel.updateOne({ _id: user._id }, { password: hashedPassword });

        res.redirect('/login');
    } catch (error) {
        console.error("Error al restaurar la contraseña:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});



module.exports = router;