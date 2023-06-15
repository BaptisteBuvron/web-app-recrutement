export {};

declare global {
    namespace Express {
        interface Request {
            logout: any;
            login: any;
        }
    }
}
