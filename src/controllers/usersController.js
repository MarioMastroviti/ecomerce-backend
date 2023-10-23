const {usersModel, cambiarRole} = require('../dao/mongo/models/users.model.js')
const { createHash, isValidatePassword } = require('../../utils.js');
const passport = require("passport")


exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ result: "error", error: 'Faltan datos.' });
        }

       
        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        });

        res.redirect('/api/sessions/login');
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};

exports.failRegister = async (req, res) => {
    res.json({ error: "Usuario ya existente" });
};

exports.loginUser = async (req, res, next) => {
    passport.authenticate("login", {
        failureRedirect: "/api/sessions/login",
        failureFlash: true
    })(req, res, next);
};

exports.handleLogin = async (req, res) => {
    try {
        if (!req.user) {
            const errorMessage = req.flash("error")[0];
            if (errorMessage) {
                req.session.error = errorMessage;
            }
            return res.status(400).json({ result: "error", error: errorMessage || "Usuario no encontrado" });
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        };
        res.redirect('/api/sessions/products');
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};

exports.restorePassword = async (req, res) => {
    const { email, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
        return res.status(400).json({ result: "error", error: "Las contraseñas no coinciden" });
    }

    try {
        const user = await usersModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ result: "error", error: "Usuario no encontrado" });
        }

        const hashedPassword = createHash(new_password);

        await usersModel.updateOne({ _id: user._id }, { password: hashedPassword });

        res.redirect('/api/sessions/login');

    } catch (error) {
        console.error("Error al restaurar la contraseña:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};


exports.changeUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { nuevoRole } = req.body;

        if (!userId || !nuevoRole) {
            return res.status(400).json({ result: 'error', error: 'Faltan datos' });
        }

        const result = await cambiarRole(userId, nuevoRole);

        if (result.status === 'success') {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error("Error al cambiar el rol del usuario:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};