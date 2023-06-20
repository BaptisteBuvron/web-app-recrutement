import {User} from "./User";
import {OffreDePoste} from "./OffreDePoste";

export class Piece {
    id: number | undefined;
    nom: string;
    url: string;
    candidat: User;
    offre: OffreDePoste;

    constructor(nom: string, url: string, candidat: User, offre: OffreDePoste, id ?: number) {
        this.nom = nom;
        this.url = url;
        this.candidat = candidat;
        this.offre = offre;
        this.id = id;
    }
}