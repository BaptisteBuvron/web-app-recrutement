import {FicheDePoste} from "./FicheDePoste";

export class OffreDePoste {
    numero: number;
    etat: string;
    dateValidite: Date;
    nbPiece: number;
    listePiece: string;
    ficheDePoste: FicheDePoste;

    constructor(numero: number, etat: string, date_validite: Date, nb_piece: number, liste_piece: string, ficheDePoste: FicheDePoste) {
        this.numero = numero;
        this.etat = etat;
        this.dateValidite = date_validite;
        this.nbPiece = nb_piece;
        this.listePiece = liste_piece;
        this.ficheDePoste = ficheDePoste;
    }
}