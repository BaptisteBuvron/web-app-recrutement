import {User} from "./User";
import {OffreDePoste} from "./OffreDePoste";
import {StatutCandidatureEnum} from "../utils/StatutCandidatureEnum";
import {Piece} from "./Piece";

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
    pieces: Piece[] | undefined;

    constructor(date: Date, candidat: User, offre: OffreDePoste, status: StatutCandidatureEnum, motivation: string, pieces?: Piece[]) {
        this.date = date;
        this.candidat = candidat;
        this.offre = offre;
        this.statut = status;
        this.motivation = motivation;
        this.pieces = pieces;
    }

}