import { EtatAvancement } from "@/ApiLeaflet";
import { EtatColis } from "@/enumsColis/EtatColis";

export abstract class Colis {
    private libelle: string;
    private poids: number;
    private codeDeSuivi: string;
    private lieuDepart: string;
    private lieuArrivee: string;
    private etatAvancement: EtatAvancement;
    private etatColis: EtatColis;
    private dateDepart: Date;
    private dateArrivee: Date;

    constructor(
        libelle: string,
        poids: number,
        codeDeSuivi: string,
        lieuDepart: string,
        lieuArrivee: string,
        etatAvancement: EtatAvancement = EtatAvancement.EN_COURS,
        etatColis: EtatColis = EtatColis.ARCHIVE,
        dateDepart: Date = new Date(),
        dateArrivee: Date = new Date()
    ) {
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

    get getLibelle(): string { return this.libelle; }
    get getPoids(): number { return this.poids; }
    get getCodeDeSuivi(): string { return this.codeDeSuivi; }
    get getLieuDepart(): string { return this.lieuDepart; }
    get getLieuArrivee(): string { return this.lieuArrivee; }
    get getEtatAvancement(): EtatAvancement { return this.etatAvancement; }
    get getEtatColis(): EtatColis { return this.etatColis; }
    get getDateDepart(): Date { return this.dateDepart; }
    get getDateArrivee(): Date { return this.dateArrivee; }

    set setLibelle(libelle: string) { this.libelle = libelle; }
    set setPoids(poids: number) { this.poids = poids; }
    set setCodeDeSuivi(code: string) { this.codeDeSuivi = code; }
    set setLieuDepart(lieu: string) { this.lieuDepart = lieu; }
    set setLieuArrivee(lieu: string) { this.lieuArrivee = lieu; }
    set setEtatAvancement(etat: EtatAvancement) { this.etatAvancement = etat; }
    set setEtatColis(etat: EtatColis) { this.etatColis = etat; }
    set setDateDepart(date: Date) { this.dateDepart = date; }
    set setDateArrivee(date: Date) { this.dateArrivee = date; }
}
