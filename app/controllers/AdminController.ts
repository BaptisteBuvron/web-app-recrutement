import express from "express";
import {OfferRepository} from "../repository/OfferRepository";
import {Offre} from "../entity/Offre";

export class AdminController {
    static index(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        res.render("admin/index", { title: "Home" });
    }
    static utilisateurs(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        res.render("admin/utilisateurs", { title: "Utilisateurs" });
    }
    static demandes(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        res.render("admin/demandes", { title: "Demandes" });
    }
    static offres(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        OfferRepository.getAll().then((offers: Offre[]) => {
            console.log(offers);
            res.render("admin/offres", {title: "Offres", offers: offers});
        });
    }
    static offre(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        let numero = req.params.numero;
        OfferRepository.getById(Number.parseInt(numero)).then((offer: Offre) => {
            console.log(offer);
            res.render("admin/offre", {title: "Offres", offers: offer});
        }).catch(
            (reason) => {
                res.redirect('/admin');
            }
        )
    }
}

