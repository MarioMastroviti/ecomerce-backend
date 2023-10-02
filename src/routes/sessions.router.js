const express = require('express');
const router = express.Router();
const {usersModel, cambiarRole} = require('../models/users.model.js')
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

router.post("/login", (req, res, next) => {
    passport.authenticate("login", {
        failureRedirect: "/api/sessions/login",
        failureFlash: true
    })(req, res, next);
}, async (req, res) => {
    if (!req.user) {
        const errorMessage = req.flash("error")[0]; 
        if (errorMessage) {
            req.session.error = errorMessage; 
        }
        return res.status(400).send(errorMessage || "Usuario no encontrado");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    };
    res.redirect('/api/sessions/products');
});

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

        res.redirect('/api/sessions/login');
    } catch (error) {
        console.error("Error al restaurar la contraseña:", error);
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.post('/cambiarrole/:email', async (req, res) => {
    const { email } = req.params;
    const { nuevoRole } = req.body;
  
    if (!email || !nuevoRole) {
      return res.status(400).json({ status: 'error', error: 'Faltan datos' });
    }
  
    const result = await cambiarRole(email, nuevoRole);
  
  
    if (result.status === 'success') {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  });



module.exports = router;