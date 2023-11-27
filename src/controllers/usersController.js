const daoUser = require('../dao/classes/users.dao.js');
const UsersDTO = require('../dao/DTOs/users.dto.js');
const passport = require("passport");
const { CustomError } = require('../error/CustomError.js');
const { generateUserErrorInfo } = require('../error/info.js');
const ErrorCodes = require('../error/enums.js');
const { addLogger } = require('../utils/loggerCustom.js');

const userDao = new daoUser();

exports.getRestore = async (req, res) => {
    res.render('restore'); 
};


exports.getLogin = async (req, res) => {
    res.render('login'); 
};

exports.getRegister = async (req, res) => {
    res.render('register'); 
};

exports.getProfile = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/api/sessions/login');
    }
    
    const { first_name, last_name, email, age, role } = req.session.user;
    res.render('profile', { first_name, last_name, email, age, role });
    }

exports.registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            const error = CustomError.createError({
                name: 'User creation error',
                cause: generateUserErrorInfo({ first_name, last_name, email, age, password }),
                message: 'Error trying to create User',
                code: ErrorCodes.INVALID_TYPES_ERROR
            });

            throw error;
        }

        const userDTO = new UsersDTO({
            first_name,
            last_name,
            email,
            age,
            password
        });

        await userDao.createUser(userDTO);

        res.redirect('/api/sessions/login');
    } catch (error) {
        req.logger.error("Error al registrar usuario:", error);
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
            age: req.user.age,
            role:req.user.role
        };
        res.redirect('/api/product');
    } catch (error) {
        req.logger.error("Error al iniciar sesión:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};

exports.restorePassword = async (req, res) => {
    const { email, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
        return res.status(400).json({ result: "error", error: "Las contraseñas no coinciden" });
    }

    try {
        const user = await userDao.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ result: "error", error: "Usuario no encontrado" });
        }

        await userDao.updatePassword(user._id, new_password);

        res.redirect('/api/sessions/login');
    } catch (error) {
        req.logger.error("Error al restaurar la contraseña:", error);
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

        const rolesPermitidos = ['user', 'premiun', 'admin'];

       
        if (!rolesPermitidos.includes(nuevoRole)) {
            return res.status(400).json({ result: 'error', error: 'Role no permitido' });
        }

        const result = await userDao.changeUserRole(userId, nuevoRole);

        if (result.status === 'success') {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error("Error al cambiar el role del usuario:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};
