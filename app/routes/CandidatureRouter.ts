import {Router} from "express";
import {CandidatureController} from "../controllers/CandidatureController";
const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const candidatureRouter = Router();

candidatureRouter.use(passport.initialize());
candidatureRouter.use(passport.session());

//Vérification de la connexion pour toutes les routes
candidatureRouter.use(checkRole("Candidat"));

candidatureRouter.get("/canditatures", CandidatureController.candidatures);
candidatureRouter.get("/canditature/:numero", CandidatureController.candidature);
candidatureRouter.post("/canditature/:numero", CandidatureController.candidature);

