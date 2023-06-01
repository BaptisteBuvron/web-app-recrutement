export class Organisation
{
    siren: string;
    nom: string;
    type: string;
    siege: string;

    constructor(siren: string, nom: string, type: string, siege: string) {
        this.siren = siren;
        this.nom = nom;
        this.type = type;
        this.siege = siege;
    }

}
