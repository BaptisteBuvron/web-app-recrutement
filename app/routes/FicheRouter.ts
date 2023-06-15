import express from "express";
import {FicheController} from "../controllers/FicheController";
const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const ficheRouter = express.Router();
ficheRouter.use(passport.initialize());
ficheRouter.use(passport.session());
ficheRouter.get("/creation", checkRole("Recruteur"), FicheController.creation);
ficheRouter.post("/creation", checkRole("Recruteur"), FicheController.creation);
