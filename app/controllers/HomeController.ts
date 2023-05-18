import express from "express";
import {OfferRepository} from "../repository/OfferRepository";
import {OrganisationRepository} from "../repository/OrganisationRepository";
import {Organisation} from "../entity/Organisation";
import {OffreDePoste} from "../entity/OffreDePoste";
import {UserRepository} from "../repository/UserRepository";

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

    static recruiter(req: express.Request, res: express.Response) {
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
                OrganisationRepository.create(organisation).then((organisation) => {
                    console.log(organisation);
                    UserRepository.setSiren(siren, mail).then((siren) => {
                        console.log(siren);
                    });
                });
            }else{
                console.log(siren);
                UserRepository.setSiren(siren, mail).then((siren) => {
                    console.log(siren);
                });
            }

            res.redirect("/recruiter");
        }else{
            OrganisationRepository.getAll().then((organisations: Organisation[]) => {
                res.render("recruiter", {title: "Recruteur", organisations: organisations});
            });
        }
    }
}



