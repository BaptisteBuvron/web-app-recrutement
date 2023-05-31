// @ts-nocheck
import {Router} from "express";
import {AdminController} from "../controllers/AdminController";
import {defaultRouter} from "./MainRouter";

const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const { passport, loggedIn } = require("../passport/passportFunctions");
const users = require("../passport/users.json");

export const adminRouter = Router();

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
    })
);
defaultRouter.use(passport.initialize());
defaultRouter.use(passport.session());

//Vérification de la connexion pour toutes les routes
defaultRouter.use(loggedIn);

adminRouter.get("/", AdminController.index);
adminRouter.get("/utilisateurs", AdminController.utilisateurs);
adminRouter.get("/demandes", AdminController.demandes);
adminRouter.get("/accepterDemande/:email", AdminController.accepterDemande);
adminRouter.get("/refuserDemande/:email", AdminController.refuserDemande);
adminRouter.get("/offres", AdminController.offres);
adminRouter.get("/offre/:numero", AdminController.offre);

