import {randomBytes} from 'crypto';
import {loggedInNoRedirection} from "../passport/passportFunctions";

export function createCSRFToken(req: any, res: any, next: any) {
    if (loggedInNoRedirection(req, res)) {
        if (req.session.csrfSecret === undefined) {
            req.session.csrfSecret = randomBytes(64).toString("hex");
            console.log("2. in createCSRFToken req.sessionID: ", req.sessionID);
        }
    }
    next();
}