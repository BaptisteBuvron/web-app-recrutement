import {Organisation} from "./Organisation";

export class FicheDePoste
{
    id: number;
    status: string;
    responsable: string;
    typeMetier: string;
    lieu: string;
    teletravail: boolean;
    nbHeures: number;
    salaire: string;
    description: string;
    siren: string;
    organisation?: Organisation;


    constructor(id: number, status: string, responsable: string, typeMetier: string, lieu: string, teletravail: boolean, nbHeures: number, salaire: string, description: string, siren: string, organisation?: Organisation) {
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
        this.organisation = organisation;
    }



}
