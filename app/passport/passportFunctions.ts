// @ts-nocheck
import {User} from "../entity/User";
import {UserRepository} from "../repository/UserRepository";
import {Alert} from "../utils/Alert";

const passport = require('passport');
const localStrategy = require("passport-local").Strategy;
const {v4:uuidv4} = require("uuid");
const bcrypt = require("bcrypt");
const fs = require("fs");

passport.serializeUser((user, done) => {
    console.log("in serialize user: ", user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("in deserialize user: ", user);
    done(null, user);
});


passport.use(
    "register",
    new localStrategy(
        {usernameField: "email", passwordField: "password"},
        // @ts-ignore
        async (email, password, done, res)=>{
            try{
                if(password.length <= 6 || !email){
                    done(null, false, {
                        message: "Veuillez saisir un mot de passe de 7 caractères minimum",
                    })
                }else{
                    const hashedPass = await bcrypt.hash(password, 10);
                    let user: User = new User(email, 'Doe', 'John', '123456789', new Date(), true, hashedPass, 'Candidat', null, null);
                    UserRepository.create(user)
                        .then(() => {
                            return done(null, user, { message: "Inscription effectuée !" });
                        })
                        .catch((err) => {
                            //console.log(err);
                            return res.redirect("/register");
                        });
                }
            }catch (err){
                return done(err);
            }
        })
);

passport.use(
    "login",
    new localStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done, res) => {
            try {
                if (email === "apperror") {
                    throw new Error(
                        "Erreur application"
                    );
                }
                UserRepository.getById(email)
                    .then(async(user) => {
                        if (user.length==0) {
                            return done(null, false, { message: "Vérifiez vos identifiants et mot de passe" });
                        }
                        let userLogged: User = new User(user[0].email, user[0].nom, user[0].prenom, user[0].telephone, user[0].date_creation, user[0].statut, user[0].password, user[0].role, user[0].demande_organisation, user[0].siren);
                        const passwordMatches = await bcrypt.compare(password, userLogged.passwordHash);

                        if (!passwordMatches) {
                            return done(null, false, { message: "Mot de passe incorrect" });
                        }

                        return done(null, user, { message: "Vous êtes connecté!" });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Middleware pour vérifier la connexion de l'utilisateur
function loggedIn() {
    return function (req, res, next) {
        console.log(req);
       if (req.isAuthenticated()) {
            next();
        } else {
            let message = "Vous n'êtes pas connecté";
            res.redirect(`/login?message=${message}`, {title: "Connexion"});
        }
    };
}

// Middleware pour vérifier la connexion + le rôle de l'utilisateur
function checkRole(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && req.user[0].role === role) {
            return next();
        }
        let message;
        if (!(req.isAuthenticated())) {
            message ="Vous n'êtes pas connecté";
        }
        else if (!(req.user[0].role === role)) {
            message = "Vous n'avez pas les accès nécéssaires pour cet onglet";
        }
        res.redirect(`/login?message=${message}`, {title: "Connexion"});

    };
}

module.exports = {
    passport,
    loggedIn,
    checkRole
};
