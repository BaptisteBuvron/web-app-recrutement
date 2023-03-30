import express, {Router} from "express";
import {AdminController} from "../controllers/AdminController";

export const adminRouter = Router();

adminRouter.get("/", AdminController.index);
adminRouter.get("/utilisateurs", AdminController.utilisateurs);
adminRouter.get("/demandes", AdminController.demandes);
adminRouter.get("/offres", AdminController.offres);



