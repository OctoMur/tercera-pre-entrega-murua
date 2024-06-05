const passport = require("passport");
const local = require("passport-local");

//Importamos el UserModel y las funciones bcrypt

const UserModel = require("../models/user.model");
const {createHash, isValidPassword} = require("../utils/hashBcrypt");

const LocalStrategy = local.Strategy; //<-- Con esta declaracion podre instanciar distintas estrategias (login o register seran estrategias por ejemplo).

//Passport con github
const GitHubStrategy = require("passport-github2");


//Ahora hay que crear una funcion que permita inicializar passport
const initializePassport = () =>{

    //ahora creamos nuestra primer estrategia (REGISTRO):
    passport.use("register", new LocalStrategy({

        passReqToCallback: true, //<-- aca declaro que quiero acceder al objeto request.
        usernameField: "email" //<-- aca indico que quiero cambiar el campo identificador y que en lugar de buscar el nombre, busque el email del usuario

    }, 
    async (req, username, password, done)=>{
        const {firstName, lastName, email, age} = req.body;
        try {
            let user = await UserModel.findOne({email: username});

            //verifico si ya existe un usuario registrado con ese email:
            if(user) return done(null, false);
            //si no existe:

            let newUser = {
                firstName,
                lastName,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);

            //Si todo funciona bien podemos mandar el 'done' con el usuario generado
            return done(null, result);

        } catch (error) {
            return done(error)
        }
    }))

    //ahora creamos nuestra segunda estrategia (LOGIN):
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    },
    async (email, password, done) =>{
        try {
            const user = await UserModel.findOne({email});

            //Verifico si existe un usuario con dicho email:
            if(!user){
                console.log("Este usuario no existe.");
                return done(null,false);
            }

            //Si existe verifico la contraseña:
            if(!isValidPassword(password, user)){
                return done(null, false);
            }

            //Si existe Y la contraseña es correcta:
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser( async (id, done) =>{
        let user = await UserModel.findById({_id: id});
        done(null, user);
    })

    //Estrategia de login mediante GitHub
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liOu189KYCpJmwv5",
        clientSecret: "93a33956eec1f509eedcdd8c1c1e927cabf65f39",
        callback: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) =>{
        try {
            let user = await UserModel.findOne({email: profile._json.email});

            console.log("Profile", profile);

            if(!user){
                let newUser={
                    firstName: profile._json.name,
                    lastName: "",
                    age: 26,
                    email: profile._json.email,
                    password: "",
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }

            

        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport;