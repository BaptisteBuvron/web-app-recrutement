import {User} from "../entity/User";
import {UserRepository} from "../repository/UserRepository";

const passport = require('passport');
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

passport.serializeUser((user:User, done:any) => {
    //console.log("in serialize user: ", user);
    done(null, user);
});

passport.deserializeUser((user:User, done:any) => {
    //console.log("in deserialize user: ", user);
    done(null, user);
});


passport.use(
    "register",
    new localStrategy(
        {usernameField: "email", passwordField: "password", passReqToCallback: true},
        async (req:any, email:string, password:string, done:any, res:any)=>{
            const { nom, prenom, telephone} = req.body;
            try{
                const regex = /^(?=.*[a-z].*[a-z])(?=.*[A-Z].*[A-Z])(?=.*\d.*\d)(?=.*[$@!%*?&#].*[$@!%*?&#])[A-Za-z\d$@!%*?&#]{12,}$/;

                if(!email){
                    done(null, false, {
                        message: "Veuillez saisir une adresse email",
                    })
                }else if(!regex.test(password)){
                    done(null, false, {
                        message: "Veuillez saisir un mot de passe de 12 caractères minimum comprenant des majuscules, des minuscules, des chiffres et des caractères spéciaux",
                    })
                }else{
                    const hashedPass = await bcrypt.hash(password, 10);
                    let user: User = new User(email, nom, prenom, telephone, new Date(), true, hashedPass, 'Candidat', null, null);
                    UserRepository.create(user)
                        .then(() => {
                            return done(null, user, { message: "Inscription effectuée !" });
                        })
                        .catch((err) => {
                            return done(null, false, { message: "Inscription impossible" });
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
        async (email:string, password:string, done:any, res:any) => {
            try {
                if (email === "apperror") {
                    throw new Error(
                        "Erreur application"
                    );
                }
                if (!email || !password) {
                    return done(null, false, { message: "Identifiant ou mot de passe manquant" });
                }
                UserRepository.getById(email)
                    .then(async(user) => {
                        if (!user) {
                            return done(null, false, { message: "Vérifiez vos identifiants et mot de passe" });
                        }
                        let userLogged: User = new User(user.email, user.nom, user.prenom, user.telephone, user.dateCreation, user.statut, user.passwordHash, user.role, user.demande_organisation, user.organisation);
                        const passwordMatches = await bcrypt.compare(password, userLogged.passwordHash);

                        if (!passwordMatches) {
                            return done(null, false, { message: "Mot de passe incorrect" });
                        }

                        return done(null, user, { message: "Vous êtes connecté!" });
                    })
                    .catch((err) => {
                        console.log(err);
                        return done(null, false, {message: "Erreur lors de la connexion"});
                    });
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Middleware pour vérifier la connexion de l'utilisateur
function loggedIn() {
    return function (req:any, res:any, next:any) {
        console.log(req);
        if (req.isAuthenticated()) {
            next();
        } else {
            let message = "Vous n'êtes pas connecté";
            res.redirect(`/login?message=${message}`);
        }
    };
}

// Middleware pour vérifier la connexion de l'utilisateur sans redirection
export function loggedInNoRedirection(req:any, res:any) {
    if (req.isAuthenticated()) {
        return req.user;
    } else {
        return false;
    }
}

// Middleware pour vérifier la connexion + le rôle de l'utilisateur pouvant être de 2 profils différents
function checkRoleTwoProfile(role:any, role2:any) {
    return function (req:any, res:any, next:any) {
        if (req.isAuthenticated() && (req.user.role === role || req.user.role === role2)) {
            return next();
        }
        let message;
        if (!(req.isAuthenticated())) {
            message ="Vous n'êtes pas connecté";
        }
        else if (!(req.user.role === role || req.user.role === role2)) {
            message = "Vous n'avez pas les accès nécéssaires pour cet onglet";
        }
        res.redirect(`/login?message=${message}`);

    };
}

// Middleware pour vérifier la connexion + le rôle de l'utilisateur
function checkRole(role:any) {
    return function (req:any, res:any, next:any) {
        if (req.isAuthenticated() && req.user.role === role) {
            return next();
        }
        let message;
        if (!(req.isAuthenticated())) {
            message ="Vous n'êtes pas connecté";
        }
        else if (!(req.user.role === role)) {
            message = "Vous n'avez pas les accès nécéssaires pour cet onglet";
        }
        res.redirect(`/login?message=${message}`);

    };
}

module.exports = {
    passport,
    loggedIn,
    checkRole,
    loggedInNoRedirection,
    checkRoleTwoProfile
};
