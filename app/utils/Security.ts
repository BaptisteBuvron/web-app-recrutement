import {Request} from "express";

export function csrfValidation(req: Request, csrfToken: string) {
    return req.session.csrfSecret === csrfToken;
}