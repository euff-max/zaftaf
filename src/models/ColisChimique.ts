import { EtatAvancement } from "@/ApiLeaflet";
import { Colis } from "./Colis";
import { EtatColis } from "@/enumsColis/EtatColis";

export class ColisChimique extends Colis {

    private degreToxicite: number
  constructor(libelle: string, poids: number, codeDeSuivi: string, lieuDepart: string, lieuArrivee: string, etatAvancement: EtatAvancement, etatColis: EtatColis, dateDepart: Date, dateArrivee: Date, degreToxicite: number ) {
    super(libelle, poids, codeDeSuivi, lieuDepart, lieuArrivee, etatAvancement, etatColis, dateDepart, dateArrivee)
    if (degreToxicite < 1 || degreToxicite > 10) {
        throw new Error("Le degré de toxicité doit être entre 1 et 10.")
    }

    this.degreToxicite = degreToxicite
  }

  public getDegreToxicite(): number {
    return this.degreToxicite
  }

  public setDegreToxicite(degreToxicite: number): void {
    if (degreToxicite < 1 || degreToxicite > 10) {
      throw new Error("Le degré de toxicité doit être entre 1 et 10.")
    }
    this.degreToxicite = degreToxicite
  }

  
  
}