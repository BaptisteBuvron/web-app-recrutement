import express, {Router} from "express";
import {HomeController} from "../controllers/HomeController";

export const defaultRoute = Router();

defaultRoute.get("/", HomeController.index);

