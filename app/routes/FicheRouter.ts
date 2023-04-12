import express from "express";
import {FicheController} from "../controllers/FicheController";

export const ficheRouter = express.Router();

ficheRouter.get("/creation", FicheController.creation);
ficheRouter.post("/creation", FicheController.creation);