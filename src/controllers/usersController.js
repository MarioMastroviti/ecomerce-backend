const daoUser = require('../dao/classes/users.dao.js');
const UsersDTO = require('../dao/DTOs/users.dto.js');
const passport = require("passport");
const { CustomError } = require('../error/CustomError.js');
const { generateUserErrorInfo } = require('../error/info.js');
const ErrorCodes = require('../error/enums.js');
const transporter = require('../utils/nodemailer.js')
const cartDao = require('../dao/classes/cart.dao');

const daoCart = new cartDao()
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

        const user = await userDao.findUserByEmail(email);

        const cart = await daoCart.createCart(user._id);

        user.cart = cart._id;
        await user.save();
       

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

        const user = await userDao.updateLastConnection(req.user._id);
        const populatedCartUser = await userDao.populateUserCart(user);

        req.session.user = {
            first_name: populatedCartUser.first_name,
            last_name: populatedCartUser.last_name,
            email: populatedCartUser.email,
            age: populatedCartUser.age,
            role: populatedCartUser.role,
            cart: populatedCartUser.cart
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
            req.session.user = result.updatedUser;
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error("Error al cambiar el role del usuario:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};


exports.postFiles = async (req, res) => {
    try {
      const { uid } = req.params;
      const { name } = req.body;
      const file = req.file;
  
      const result = await userDao.postFiles(uid, name, file);
  
      if (result) {
        res.status(200).send({ result: "Success" });
      } else {
        res.status(500).send({ error: 'Error al procesar la carga de archivos en el servidor.' });
      }
    } catch (error) {
      console.error("Error al procesar la carga de archivos:", error);
      res.status(500).send({ error: 'Error interno del servidor.' });
    }
  };
  
  
  exports.getAllUsers = async (req, res) => {
    try {
        const users = await userDao.getAllUsers();
        res.render('users', { users }); 
    } catch (error) {
        req.logger.error("Error al obtener todos los usuarios:", error);
        res.status(500).json({ result: "error", error: "Error interno del servidor" });
    }
};




  exports.deleteUserInactive = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userDao.findUserById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

       
        const currentDate = new Date();
        const lastConnectionDate = user.last_connection || new Date();

        const timeDifference = currentDate - lastConnectionDate;

        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

       
        const inactiveDaysLimit = 2;

       
        if (daysDifference > inactiveDaysLimit) {
           
            const mailOptions = {
                from: 'mariomastroviti1@gmail.com',
                to: user.email,
                subject: 'Aviso de eliminación de cuenta por inactividad',
                text: `Hola ${user.first_name}, tu cuenta será eliminada en breve debido a inactividad.`,
            };

            await transporter.sendMail(mailOptions);

            const result = await userDao.deleteUser(uid);
            return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } else {
            return res.status(200).json({ message: 'El usuario no está inactivo' });
        }
    } catch (error) {
        console.error('Error al eliminar usuario inactivo:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userDao.findUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const result = await userDao.deleteUser(userId);

        if (result.status === 'success') {
            return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } else {
            return res.status(500).json({ result: 'error', error: 'Error al eliminar el usuario' });
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ result: 'error', error: 'Error interno del servidor' });
    }
};



exports.getLoginGit = async(req, res) => {
    req.session.user = req.user;
    const user = await userDao.findUserByEmail(req.user.email);

     await daoCart.createCart(user._id);

    const cartId = req.session.user.cart._id;
    console.log(cartId)

    await user.save();
    console.log(`/api/product?cartId=${cartId}`);

    res.redirect(`/api/product?cartId=${cartId}`);
}
