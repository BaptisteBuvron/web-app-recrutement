import {Router} from "express";
import {HomeController} from "../controllers/HomeController";

export const defaultRouter = Router();

defaultRouter.get("/", HomeController.index);

defaultRouter.get("/login", HomeController.login);
defaultRouter.get("/register", HomeController.register);
defaultRouter.get("/recruiter", HomeController.recruiter);
defaultRouter.post("/recruiter", HomeController.recruiter);

