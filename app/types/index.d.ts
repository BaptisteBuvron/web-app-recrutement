import {User} from "../entity/User";

export {};

declare global {
    namespace Express {
        interface Request {
            logout: any;
            login: any;
            session: any;
            user: User;
        }
    }
}
