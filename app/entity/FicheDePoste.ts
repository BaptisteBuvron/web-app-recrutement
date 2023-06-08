export class FicheDePoste
{
    id: number;
    status: string;
    responsable: string;
    typeMetier: string;
    lieu: string;
    teletravail: boolean;
    nbHeures: number;
    salaire: number;
    description: string;
    siren: string;


    constructor(id: number, status: string, responsable: string, typeMetier: string, lieu: string, teletravail: boolean, nbHeures: number, salaire: number, description: string, siren: string) {
        this.id = id;
        this.status = status;
        this.responsable = responsable;
        this.typeMetier = typeMetier;
        this.lieu = lieu;
        this.teletravail = teletravail;
        this.nbHeures = nbHeures;
        this.salaire = salaire;
        this.description = description;
        this.siren = siren;
    }



}