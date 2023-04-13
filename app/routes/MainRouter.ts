import {Router} from "express";
import {HomeController} from "../controllers/HomeController";

export const defaultRouter = Router();

defaultRouter.get("/", HomeController.index);
defaultRouter.get("/applications", HomeController.applications);

defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);
defaultRouter.get("/application/:numero", HomeController.application);

