import { Colis } from "./Colis";
export class ColisChimique extends Colis {
    constructor(libelle, poids, codeDeSuivi, lieuDepart, lieuArrivee, etatAvancement, etatColis, dateDepart, dateArrivee, degreToxicite) {
        super(libelle, poids, codeDeSuivi, lieuDepart, lieuArrivee, etatAvancement, etatColis, dateDepart, dateArrivee);
        if (degreToxicite < 1 || degreToxicite > 10) {
            throw new Error("Le degré de toxicité doit être entre 1 et 10.");
        }
        this.degreToxicite = degreToxicite;
    }
    getDegreToxicite() {
        return this.degreToxicite;
    }
    setDegreToxicite(degreToxicite) {
        if (degreToxicite < 1 || degreToxicite > 10) {
            throw new Error("Le degré de toxicité doit être entre 1 et 10.");
        }
        this.degreToxicite = degreToxicite;
    }
}
