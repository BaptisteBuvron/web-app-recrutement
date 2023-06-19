import {OfferRepository} from "../repository/OfferRepository";
import {OffreDePoste} from "../entity/OffreDePoste";
import express from "express";
import {FilterOffer} from "../utils/FilterOffer";
import {UserRepository} from "../repository/UserRepository";
import {User} from "../entity/User";

export class ApiController {
    static getOffers(req: express.Request, res: express.Response) {
        //get filters from request
        let minSalary = req.query.salary;
        let region = req.query.region;
        let filterOffer;
        if (minSalary || region) {
            filterOffer = new FilterOffer(Number(minSalary), region ? String(region) : undefined);
        }
        OfferRepository.getAll(filterOffer).then((offers: OffreDePoste[]) => {
            res.json(offers);
        });
    }

    static getUser(req: express.Request, res: express.Response) {
        console.log("there");
        let email = req.query.email;
        UserRepository.getById(String(email)).then((user: User[]) => {
            res.json(user);
        });
    }
}
