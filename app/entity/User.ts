export class User {
    id: number;
    username: string;
    passwordHash: string;
    email: string;
    constructor(id: number, username: string, passwordHash: string, email: string) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
    }
}