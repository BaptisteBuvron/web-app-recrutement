import {User} from "./User";
import {OffreDePoste} from "./OffreDePoste";
import {StatutCandidatureEnum} from "../utils/StatutCandidatureEnum";

/**
 * Candidature
 * @param date
 * @param candidat
 * @param offre
 * //TODO Ajouter une liste de pièces jointes (CV, lettre de motivation, etc.)
 */
export class Candidature {
    date: Date;
    candidat: User;
    offre: OffreDePoste;
    statut: StatutCandidatureEnum;
    motivation: string;

    constructor(date: Date, candidat: User, offre: OffreDePoste, status: StatutCandidatureEnum, motivation: string) {
        this.date = date;
        this.candidat = candidat;
        this.offre = offre;
        this.statut = status;
        this.motivation = motivation;
    }

}