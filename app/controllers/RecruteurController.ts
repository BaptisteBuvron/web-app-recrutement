import express from "express";
import {CandidatureRepository} from "../repository/CandidatureRepository";
import {Alert} from "../utils/Alert";
import {loggedInNoRedirection} from "../passport/passportFunctions";
import {OfferRepository} from "../repository/OfferRepository";
import {User} from "../entity/User";

export class RecruteurController {
    static index(req: express.Request, res: express.Response) {
        //Get candidatures by siren
        res.render("recruteur/index", {title: "Home", userLogged: loggedInNoRedirection(req, res)});
    }

    static candidatures(req: express.Request, res: express.Response) {
        //TODO get siren from user
        let user: User = req.user as User;
        let siren = user.organisation?.siren;

        let alerts: Alert[] = [];
        if (siren === undefined) {
            siren = String();
        }
        CandidatureRepository.getBySiren(siren).then((candidatures) => {
            res.render("recruteur/candidatures", {
                title: "Candidatures",
                candidatures: candidatures,
                userLogged: loggedInNoRedirection(req, res)
            });
        }).catch((err) => {
            alerts.push(new Alert("danger", "Erreur lors de la récupération des candidatures"));
            res.redirect("/recruteur");
        });

    }
    
    static offres(req: express.Request, res: express.Response) {
        let user: User = req.user as User;
        let siren = user.organisation?.siren;
        let alerts: Alert[] = [];
        if (siren === undefined) {
            siren = String();
        }
        OfferRepository.getBySiren(siren).then((offers) => {
            res.render("recruteur/offres", {
                title: "Offres",
                offers: offers,
                userLogged: loggedInNoRedirection(req, res)
            });
        });
    }
}
