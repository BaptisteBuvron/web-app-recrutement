import express from "express";
import {OfferController} from "../controllers/OfferController";
const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const offerRouter = express.Router();

offerRouter.use(passport.initialize());
offerRouter.use(passport.session());

//Vérification de la connexion pour toutes les routes
offerRouter.use(checkRole("Recruteur"));

offerRouter.get("/creation", OfferController.creation);
offerRouter.post("/creation", OfferController.creation);
