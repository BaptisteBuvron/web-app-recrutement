import express from "express";
import {OfferRepository} from "../repository/OfferRepository";
import {OrganisationRepository} from "../repository/OrganisationRepository";
import {Organisation} from "../entity/Organisation";
import {OffreDePoste} from "../entity/OffreDePoste";
import {UserRepository} from "../repository/UserRepository";
import {Alert} from "../utils/Alert";

export class HomeController {

    static index(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        OfferRepository.getAll().then((offers: OffreDePoste[]) => {
            res.render("index", {title: "Home", offers: offers});
        });
    }

    static applications(req: express.Request, res: express.Response) {
        res.render("applications", {title: "Mes candidatures"});
    }

    static login(req: express.Request, res: express.Response) {
        res.render("login", {title: "Login"});
    }

    static register(req: express.Request, res: express.Response) {
        res.render("register", {title: "register"});
    }

    static application(req: express.Request, res: express.Response) {
        let numero = req.params.numero;
        if (!Number.isInteger(numero)) {
            //TODO redirect
        }
        OfferRepository.getById(Number.parseInt(numero))
            .then((offer: OffreDePoste) => {
                    res.render("application", {title: "Candidater", offer: offer});
                }
            )
            .catch(
            (reason) => {
                res.redirect('/');
            }
        )
    }

    static async recruiter(req: express.Request, res: express.Response) {
        const alerts: Alert[] = [];
        if (req.method === "POST") {
            let siren = req.body.siren;
            let mail = "tsoudar21@gmail.com"; //TO DO get mail from session variable
            if(req.body.siege){
                let organisation: Organisation = new Organisation(
                    req.body.siren,
                    req.body.nom,
                    req.body.type,
                    req.body.siege
                );
                await OrganisationRepository.create(organisation).then((organisation) => {
                    let alert = new Alert("success", "L'organisation a été créée.");
                    alerts.push(alert);
                })
                    .catch((err) => {
                        let alert = new Alert("danger", "L'organisation n'a pas été créée.");
                        alerts.push(alert);
                        console.log(err);
                        return res.redirect("/recruiter");
                    });


                await UserRepository.setSiren(siren, mail).then((siren) => {
                    let alert = new Alert("success", "Votre demande à rejoindre cette organisation est bien prise en compte.");
                    alerts.push(alert);
                })
                    .catch((err) => {
                        let alert = new Alert("danger", "Attention, votre demande n'a pas été prise en compte.");
                        alerts.push(alert);
                        console.log(err);
                        return res.redirect("/recruiter");
                    });
            }else{
                await UserRepository.setSiren(siren, mail).then((siren) => {
                    let alert = new Alert("success", "Votre demande à rejoindre cette organisation est bien prise en compte.");
                    alerts.push(alert);
                });
            }
        }

        OrganisationRepository.getAll().then((organisations: Organisation[]) => {
            res.render("recruiter", {title: "Recruteur", organisations: organisations, alerts: alerts});
        });
    }
}



