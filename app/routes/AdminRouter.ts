import {Router} from "express";
import {AdminController} from "../controllers/AdminController";

const { passport, loggedIn, checkRole } = require("../passport/passportFunctions");

export const adminRouter = Router();

adminRouter.use(passport.initialize());
adminRouter.use(passport.session());

//Vérification de la connexion pour toutes les routes
adminRouter.use(checkRole("Administrateur"));
//adminRouter.get("/demandes", loggedIn(), AdminController.demandes);

adminRouter.get("/", AdminController.index);
adminRouter.get("/utilisateurs", AdminController.utilisateurs);
adminRouter.get("/utilisateur/:email", AdminController.utilisateur);
adminRouter.get("/modifierUtilisateur/:email", AdminController.modifierUtilisateur);
adminRouter.post("/modifierUtilisateur/:email", AdminController.modifierUtilisateur);

adminRouter.get("/demandes", AdminController.demandes);
adminRouter.get("/demande/:email", AdminController.demande);
adminRouter.get("/accepterDemande/:email", AdminController.accepterDemande);
adminRouter.get("/refuserDemande/:email", AdminController.refuserDemande);
adminRouter.get("/offres", AdminController.offres);
adminRouter.get("/offre/:numero", AdminController.offre);

