const passport = require("passport");
const local = require("passport-local");
const { usersModel } = require('../dao/mongo/models/users.model.js');
const GitHubStrategy = require("passport-github2");
const { createHash, isValidatePassword } = require('../utils/utils.js');
const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new localStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                try {
                    let user = await usersModel.findOne({ email: username });
                    if (user) {
                    return done(null, false,  { message: "Usuario ya registrado" });
                    }

                    if (!first_name || !last_name || !email || !age || !password) {
                        return done(null, false,  { message: "Falta completar datos" });
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    let result = await usersModel.create(newUser);
                    return done(null, result, { message: "Usuario registrado con exito" });
                } catch (error) {
                    return done("Error al obtener el usuario " + error);
                }
            }
        )
    );

    passport.use(
        "login",
        new localStrategy({ usernameField: "email", passReqToCallback: true,}, async (req, username, password, done) => {
            try {
                const user = await usersModel.findOne({ email: username });
                if (!user) {
                    req.session.error = "Usuario no registrado";
                    return done(null, false);
                }
    
                if (!isValidatePassword(password, user)) {
                    req.session.error = "Contraseña incorrecta"; 
                    return done(null, false);
                }
    
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );




    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.e0fad190055cf2a3",
        clientSecret: "1971a8ec95d4a391bd5d3c61bbe4298e2f001cdb",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await usersModel.findOne({ email: profile._json.email });

          
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: "github",
                    age: 18,
                    email: profile._json.email,
                    password: "github"
                };
               
                let result = await usersModel.create(newUser);
             
                done(null, result);
            }
            else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id);
        done(null, user);
    });
};

module.exports = initializePassport;