import express from "express";
import {OfferRepository} from "../repository/OfferRepository";
import {OffreDePoste} from "../entity/OffreDePoste";
import {UserRepository} from "../repository/UserRepository";
import {User} from "../entity/User";
import {loggedInNoRedirection} from "../passport/passportFunctions";
import {OrganisationRepository} from "../repository/OrganisationRepository";
import {Alert} from "../utils/Alert";

export class AdminController {
    static index(req: express.Request, res: express.Response) {
        res.render("admin/index", { title: "Home", userLogged: loggedInNoRedirection(req, res)});
    }

    static utilisateurs(req: express.Request, res: express.Response) {
        UserRepository.getAll().then((users: User[]) => {
            console.log(users);
            res.render("admin/utilisateurs", { title: "Utilisateurs", users, userLogged: loggedInNoRedirection(req, res)});
        });
    }

    static utilisateur(req: express.Request, res: express.Response) {
        let email = req.params.email;
        UserRepository.getById(email).then((user: User) => {
            console.log(user);
            res.render("admin/utilisateur", {title: "Utilisateur", user: user, userLogged: loggedInNoRedirection(req, res)});
        })
    }

    static async modifierUtilisateur(req: express.Request, res: express.Response) {
        if (req.method === "POST") {
            const alerts: Alert[] = [];
            let user = new User(
                req.body.email,
                req.body.nom,
                req.body.prenom,
                req.body.telephone,
                req.body.date_creation,
                req.body.statut,
                "",
                req.body.role,
                null,
                null,
                undefined,
            );

            await UserRepository.update(user).then((user: User) => {
                let alert = new Alert("success", "L'utilisateur a été modifié");
                alerts.push(alert);
            })
                .catch((err) => {
                    let alert = new Alert("danger", "L'utilisateur n'a pas été modifié");
                    alerts.push(alert);
                    console.log(err);
                });
            UserRepository.getById(req.body.email).then((user: User) => {
                console.log(user);
                res.render("admin/utilisateur", {title: "Utilisateur", user: user, alerts: alerts, userLogged: loggedInNoRedirection(req, res)});
            })
        }else{
            let email = req.params.email;
            UserRepository.getById(email).then((user: User) => {
                console.log(user);
                res.render("admin/modifierUtilisateur", {
                    title: "Modifier un utilisateur",
                    user: user,
                    userLogged: loggedInNoRedirection(req, res)
                });
            })
        }
    }

    static demandes(req: express.Request, res: express.Response) {
        UserRepository.getRecruiterDemand().then((users: User[]) => {
            //console.log(users);
            res.render("admin/demandes", {title: "Demandes", users: users, userLogged: loggedInNoRedirection(req, res)});
        });
    }

    static demande(req: express.Request, res: express.Response) {
        let email = req.params.email;
        UserRepository.getById(email).then((user: User) => {
            console.log(user);
            res.render("admin/demande", {title: "Demande", user: user, userLogged: loggedInNoRedirection(req, res)});
        })
    }

    static async accepterDemande(req: express.Request, res: express.Response) {
        let email = req.params.email;
        await UserRepository.setDemandAccepted(email).then((email) => {
            console.log(email);
        });
        res.redirect("/admin/demandes");
    }

    static async refuserDemande(req: express.Request, res: express.Response) {
        let email = req.params.email;
        await UserRepository.setDemandRefused(email).then((email) => {
            console.log(email);
        });
        res.redirect("/admin/demandes");
    }

    static offres(req: express.Request, res: express.Response) {
        OfferRepository.getAll().then((offers: OffreDePoste[]) => {
            console.log(offers);
            res.render("admin/offres", {title: "Offres", offers: offers, userLogged: loggedInNoRedirection(req, res)});
        });
    }

    static offre(req: express.Request, res: express.Response) {
        let numero = req.params.numero;
        OfferRepository.getById(Number.parseInt(numero)).then((offer: OffreDePoste) => {
            console.log(offer);
            res.render("admin/offre", {title: "Offre", offer: offer, userLogged: loggedInNoRedirection(req, res)});
        })
    }
}

