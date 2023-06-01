import express from "express";
import {CandidatureRepository} from "../repository/CandidatureRepository";
import {Alert} from "../utils/Alert";

export class RecruteurController {
    static index(req: express.Request, res: express.Response) {
        //Get candidatures by siren

        res.render("recruteur/index", {title: "Home"});
    }

    static candidatures(req: express.Request, res: express.Response) {
        //TODO get siren from user
        let siren = '123456';
        let alerts: Alert[] = [];

        CandidatureRepository.getBySiren(siren).then((candidatures) => {
            res.render("recruteur/candidatures", {title: "Candidatures", candidatures: candidatures});
        }).catch((err) => {
            alerts.push(new Alert("danger", "Erreur lors de la récupération des candidatures"));
            res.redirect("/recruteur");
        });
    }
}