export class Offer {
    numero: number;
    etat: string;
    date_validite: Date;
    nb_piece: number;
    liste_piece: string;
    siren: string;
    ficheDePoste: string;

    constructor(numero: number, etat: string, date_validite: Date, nb_piece: number, liste_piece: string, siren: string, ficheDePoste: string) {
        this.numero = numero;
        this.etat = etat;
        this.date_validite = date_validite;
        this.nb_piece = nb_piece;
        this.liste_piece = liste_piece;
        this.siren = siren;
        this.ficheDePoste = ficheDePoste;
    }
}