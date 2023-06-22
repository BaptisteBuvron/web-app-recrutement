import express from "express";
import {RecruteurController} from "../controllers/RecruteurController";
import {AdminController} from "../controllers/AdminController";

const {passport, checkRole} = require("../passport/passportFunctions");

export const recruterRouter = express.Router();
recruterRouter.use(passport.initialize());
recruterRouter.use(passport.session());

recruterRouter.get("/", checkRole("Recruteur"), RecruteurController.index);
recruterRouter.get("/candidatures", checkRole("Recruteur"), RecruteurController.candidatures);
recruterRouter.get("/offres", RecruteurController.offres);
recruterRouter.get("/modifierOffre/:numero", AdminController.modifierOffre);
recruterRouter.post("/modifierOffre/:numero", AdminController.modifierOffre);
recruterRouter.get("/supprimerOffre/:numero", AdminController.supprimerOffre);

