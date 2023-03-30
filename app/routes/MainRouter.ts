import express, {Router} from "express";
import {HomeController} from "../controllers/HomeController";

export const defaultRouter = Router();

defaultRouter.get("/", HomeController.index);



