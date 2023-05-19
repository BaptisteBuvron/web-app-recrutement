export class User {
    email: string;
    nom: string;
    prenom: string;
    telephone: string;
    dateCreation: Date;
    statut: boolean;
    passwordHash: string;
    role: string;
    demande_organisation: string;
    //TODO replace siren by organisation
    siren: string;

    constructor(email: string, nom: string, prenom: string, telephone: string, dateCreation: Date, statut: boolean, passwordHash: string, role: string, demande_organisation: string, siren: string) {
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.dateCreation = dateCreation;
        this.statut = statut;
        this.passwordHash = passwordHash;
        this.role = role;
        this.demande_organisation = demande_organisation;
        this.siren = siren;
    }

}