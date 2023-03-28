import express from "express";

export class HomeController {
    public static index(req: express.Request, res: express.Response) {
        //Render ejs file
         res.status(200).json('Hello World From the Typescript API!')
        //res.render("index", { title: "Home" });
    }


}