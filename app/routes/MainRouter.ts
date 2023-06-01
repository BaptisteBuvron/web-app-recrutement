import {Router} from "express";
import {HomeController} from "../controllers/HomeController";

export const defaultRouter = Router();

defaultRouter.get("/", HomeController.index);

defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);
defaultRouter.get("/devenir-recruteur", HomeController.demandeRecruteur);
defaultRouter.post("/devenir-recruteur", HomeController.demandeRecruteur);

