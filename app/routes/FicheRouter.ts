import express from "express";
import {FicheController} from "../controllers/FicheController";
const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const ficheRouter = express.Router();

ficheRouter.use(passport.initialize());
ficheRouter.use(passport.session());

//Vérification de la connexion pour toutes les routes
ficheRouter.use(checkRole("Recruteur"));

ficheRouter.get("/creation", FicheController.creation);
ficheRouter.post("/creation", FicheController.creation);
