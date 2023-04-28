export class Organisation
{
    siren: number;
    nom: string;
    type: string;
    siege: string;



    constructor(siren:number, nom:string, type:string, siege:string) {
        this.siren = siren;
        this.nom = nom;
        this.type = type;
        this.siege = siege;
    }



}
