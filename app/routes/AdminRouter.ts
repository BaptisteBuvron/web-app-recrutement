import {Router} from "express";
import {AdminController} from "../controllers/AdminController";

const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const adminRouter = Router();
adminRouter.use(passport.initialize());
adminRouter.use(passport.session());
adminRouter.get("/", checkRole("Administrateur"), AdminController.index);
adminRouter.get("/utilisateurs", checkRole("Administrateur"), AdminController.utilisateurs);
adminRouter.get("/demandes", checkRole("Administrateur"), AdminController.demandes);
adminRouter.get("/accepterDemande/:email", checkRole("Administrateur"), AdminController.accepterDemande);
adminRouter.get("/refuserDemande/:email", checkRole("Administrateur"), AdminController.refuserDemande);
adminRouter.get("/offres", checkRole("Administrateur"), AdminController.offres);
adminRouter.get("/offre/:numero", checkRole("Administrateur"), AdminController.offre);

