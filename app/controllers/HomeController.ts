import express from "express";
import {OfferRepository} from "../repository/OfferRepository";
import {Offer} from "../entity/Offer";

export class HomeController {

    static offerRepository: OfferRepository = new OfferRepository();


    static index(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')

        OfferRepository.getAll().then((offers: Offer[]) => {
            res.render("index", { title: "Home", offers: offers });
        });
    }

    static applications(req: express.Request, res: express.Response) {
        res.render("applications", { title: "Mes candidatures" });
    }

    static login(req: express.Request, res: express.Response) {
        res.render("login", { title: "Login" });
    }

    static register(req: express.Request, res: express.Response) {
        res.render("register", { title: "register" });
    }

    static application(req: express.Request, res: express.Response) {
        res.render("application", { title: "Candidater" });
    }
}