import express, {Router} from "express";
import {AdminController} from "../controllers/AdminController";

export const adminRouter = Router();

adminRouter.get("/truc", AdminController.index);



