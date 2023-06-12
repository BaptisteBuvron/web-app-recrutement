import {Router} from "express";
import {HomeController} from "../controllers/HomeController";

const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const { passport, loggedInNoRedirection, checkRole} = require("../passport/passportFunctions");

export const defaultRouter = Router();

defaultRouter.use(
    session({
        genid: (req) => {
            console.log("1. in genid req.sessionID: ", req.sessionID);
            return uuidv4();
        },
        store: new FileStore(),
        secret: "a private key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000
        }
    })
);
defaultRouter.use(passport.initialize());
defaultRouter.use(passport.session());

defaultRouter.get("/", HomeController.index);
defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);
defaultRouter.get("/devenir-recruteur", checkRole("Candidat"), HomeController.demandeRecruteur);
defaultRouter.post("/devenir-recruteur", checkRole("Candidat"), HomeController.demandeRecruteur);

defaultRouter.post(
    "/login",
    function (req, res, next) {
        passport.authenticate("login", async (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.redirect(`/login?message=${info.message}`);
            }
            req.login(user, async (error) => {
                let role = user[0].role;
                let url;
                if (role == "Administrateur") {
                    url="admin";
                } else if(role == "Recruteur"){
                    url="offre";
                }else{
                    url="";
                }

                return res.redirect(`/${url}`);
            });
        })(req, res, next);
    }
);

defaultRouter.post("/register", async(req, res, next)=>{
    // @ts-ignore
    passport.authenticate("register", async function(error, user, info){
        if(error){
            return next(error.message);
        }

        if(!user){
            res.redirect(`/register?message=${info.message}`);
        }
        req.login(user, async (error) => {
            if (error) {
                return next(error);
            }
            return res.redirect(`/`);
        });
    })(req, res, next)
});

defaultRouter.get("/logout", async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});
