import {Router} from "express";
import {AdminController} from "../controllers/AdminController";

export const adminRouter = Router();

adminRouter.get("/", AdminController.index);
adminRouter.get("/utilisateurs", AdminController.utilisateurs);
adminRouter.get("/demandes", AdminController.demandes);
adminRouter.get("/accepterDemande/:email", AdminController.accepterDemande);
adminRouter.get("/refuserDemande/:email", AdminController.refuserDemande);
adminRouter.get("/offres", AdminController.offres);
adminRouter.get("/offre/:numero", AdminController.offre);



