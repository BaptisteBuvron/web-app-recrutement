import express from "express";
import {OfferRepository} from "../repository/OfferRepository";
import {OffreDePoste} from "../entity/OffreDePoste";
import {UserRepository} from "../repository/UserRepository";
import {User} from "../entity/User";

export class AdminController {
    static index(req: express.Request, res: express.Response) {
        res.render("admin/index", { title: "Home" });
    }

    static utilisateurs(req: express.Request, res: express.Response) {
        res.render("admin/utilisateurs", { title: "Utilisateurs" });
    }

    static demandes(req: express.Request, res: express.Response) {
        UserRepository.getRecruiterDemand().then((users: User[]) => {
            console.log(users);
            res.render("admin/demandes", {title: "Demandes", users: users});
        });
    }

    static accepterDemande(req: express.Request, res: express.Response) {
        let email = req.params.email;
        UserRepository.setDemandAccepted(email).then((email) => {
            console.log(email);
        });
        res.redirect("/admin/demandes");
    }

    static refuserDemande(req: express.Request, res: express.Response) {
        let email = req.params.email;
        UserRepository.setDemandRefused(email).then((email) => {
            console.log(email);
        });
        res.redirect("/admin/demandes");
    }

    static offres(req: express.Request, res: express.Response) {
        OfferRepository.getAll().then((offers: OffreDePoste[]) => {
            console.log(offers);
            res.render("admin/offres", {title: "Offres", offers: offers});
        });
    }

    static offre(req: express.Request, res: express.Response) {
        let numero = req.params.numero;
        OfferRepository.getById(Number.parseInt(numero)).then((offer: OffreDePoste) => {
            console.log(offer);
            res.render("admin/offre", {title: "Offres", offers: offer});
        })
    }
}

