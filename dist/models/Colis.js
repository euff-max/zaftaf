import { EtatAvancement } from "@/ApiLeaflet";
import { EtatColis } from "@/enumsColis/EtatColis";
export class Colis {
    constructor(libelle, poids, codeDeSuivi, lieuDepart, lieuArrivee, etatAvancement = EtatAvancement.EN_COURS, etatColis = EtatColis.ARCHIVE, dateDepart = new Date(), dateArrivee = new Date()) {
        this.libelle = libelle;
        this.poids = poids;
        this.codeDeSuivi = codeDeSuivi;
        this.lieuDepart = lieuDepart;
        this.lieuArrivee = lieuArrivee;
        this.etatAvancement = etatAvancement;
        this.etatColis = etatColis;
        this.dateDepart = dateDepart;
        this.dateArrivee = dateArrivee;
    }
    get getLibelle() { return this.libelle; }
    get getPoids() { return this.poids; }
    get getCodeDeSuivi() { return this.codeDeSuivi; }
    get getLieuDepart() { return this.lieuDepart; }
    get getLieuArrivee() { return this.lieuArrivee; }
    get getEtatAvancement() { return this.etatAvancement; }
    get getEtatColis() { return this.etatColis; }
    get getDateDepart() { return this.dateDepart; }
    get getDateArrivee() { return this.dateArrivee; }
    set setLibelle(libelle) { this.libelle = libelle; }
    set setPoids(poids) { this.poids = poids; }
    set setCodeDeSuivi(code) { this.codeDeSuivi = code; }
    set setLieuDepart(lieu) { this.lieuDepart = lieu; }
    set setLieuArrivee(lieu) { this.lieuArrivee = lieu; }
    set setEtatAvancement(etat) { this.etatAvancement = etat; }
    set setEtatColis(etat) { this.etatColis = etat; }
    set setDateDepart(date) { this.dateDepart = date; }
    set setDateArrivee(date) { this.dateArrivee = date; }
}
