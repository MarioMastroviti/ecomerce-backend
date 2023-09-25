const express = require('express');
const router = express.Router();
const {usersModel} = require('../models/users.model.js')
const { createHash, isValidatePassword } = require('../../utils.js');
const passport = require("passport")


router.post('/register', passport.authenticate("register", { failureRedirect: "/api/sessions/failregister" }), async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;


    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }


    await usersModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
    });

   
    res.redirect('/api/sessions/login');
});

router.get("/failregister", async (req, res) => {
   res.send({ error: "usuario ya existente" })
})


router.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Usuario no encontrado")
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }
    res.redirect('/api/sessions/products');
}
)

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


router.get("/faillogin", async (req, res) => {
    console.log("Falla en autenticacion")
    res.send({ error: "Falla" })
})

module.exports = router;