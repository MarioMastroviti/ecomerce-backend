const passport = require("passport");
const local = require("passport-local");
const { usersModel } = require('../models/users.model.js');
const GitHubStrategy = require("passport-github2");
const { createHash, isValidatePassword } = require('../../utils.js');
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
                    return done(null, false);
                    }

                    if (!first_name || !last_name || !email || !age || !password) {
                        console.log("Faltan campos obligatorios");
                        return done(null, false);
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                    };
                    let result = await usersModel.create(newUser);
                    return done(null, result);
                } catch (error) {
                    return done("Error al obtener el usuario " + error);
                }
            }
        )
    );

    passport.use(
        "login",
        new localStrategy({ usernameField: "email" }, async (username, password, done) => {
          try {
            const user = await usersModel.findOne({ email: username });
            if (!user) {
              return done(null, false);
           }
   
             if (!isValidatePassword(password, user.password)) { 
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
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
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
