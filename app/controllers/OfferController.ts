import express from "express";
import {UserRepository} from "../repository/UserRepository";
import {User} from "../entity/User";

export class OfferController {


    public static create(req: express.Request, res: express.Response) {
        res.render("offer/create", { title: "Create Offer" });
    }
}