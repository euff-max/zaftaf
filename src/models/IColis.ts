import { EtatAvancement } from "../enumsCargaison/EtatAvancement";
import { EtatColis } from "../enumsColis/EtatColis";
import { TypeColis } from "../enums/TypeColis";

export interface IColis {
  id?: string;
  libelle: string;
  poids: number;
  type: TypeColis;
  codeDeSuivi?: string;
  etatAvancement: EtatAvancement;
  etatColis: EtatColis;
  dateCreation?: Date;
}