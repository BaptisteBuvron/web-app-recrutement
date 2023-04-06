import express from "express";

export class AdminController {
    public static index(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        res.render("admin/index", { title: "home" });
    }
    public static utilisateurs(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        res.render("admin/utilisateurs", { title: "utilisateurs" });
    }
    public static demandes(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        res.render("admin/demandes", { title: "demandes" });
    }
    public static offres(req: express.Request, res: express.Response) {
        //Render ejs file
        //res.status(200).json('Hello World From the Typescript API!')
        res.render("admin/offres", { title: "offres" });
    }
}
