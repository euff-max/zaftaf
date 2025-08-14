import { TypeCargaison } from "../enumsCargaison/TypeCargaison";
import { TypeColis } from "../enums/TypeColis";
import { EtatAvancement } from "../enumsCargaison/EtatAvancement";
import { EtatColis } from "../enumsColis/EtatColis";
export class ColisManager {
    constructor() {
        this.endpoint = 'http://localhost:3000/cargaisons';
    }
    async getCargaisonsDisponibles(typeColis) {
        try {
            const response = await fetch(this.endpoint);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des cargaisons');
            }
            const cargaisons = await response.json();
            return cargaisons.filter(cargaison => {
                // Vérifier si la cargaison est ouverte
                if (cargaison.etatGlobal !== 'OUVERT')
                    return false;
                // Vérifier la limite de colis
                if (cargaison.colis.length >= 10)
                    return false;
                // Vérifier la compatibilité selon le type
                return this.verifierCompatibilite(typeColis, cargaison.type);
            });
        }
        catch (error) {
            console.error("Erreur:", error);
            throw error;
        }
    }
    async ajouterColisACargaison(cargaisonId, colisData) {
        try {
            // D'abord récupérer la cargaison
            const response = await fetch(`${this.endpoint}/${cargaisonId}`);
            if (!response.ok) {
                throw new Error('Cargaison non trouvée');
            }
            const cargaison = await response.json();
            // Vérifier si la cargaison peut accepter le colis
            if (cargaison.colis.length >= 10) {
                throw new Error('La cargaison est pleine (maximum 10 colis)');
            }
            if (cargaison.etatGlobal !== 'OUVERT') {
                throw new Error('La cargaison est fermée');
            }
            // Créer le nouveau colis
            const nouveauColis = {
                id: this.genererCodeSuivi(),
                libelle: colisData.libelle,
                poids: colisData.poids,
                type: this.mapperTypeColis(colisData.type),
                codeDeSuivi: this.genererCodeSuivi(),
                etatAvancement: EtatAvancement.EN_ATTENTE,
                etatColis: EtatColis.ARCHIVE,
                dateCreation: new Date()
            };
            // Ajouter le colis à la cargaison
            cargaison.colis.push(nouveauColis);
            // Mettre à jour la cargaison
            const updateResponse = await fetch(`${this.endpoint}/${cargaisonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cargaison)
            });
            if (!updateResponse.ok) {
                throw new Error('Erreur lors de la mise à jour de la cargaison');
            }
            return true;
        }
        catch (error) {
            console.error("Erreur lors de l'ajout du colis:", error);
            throw error;
        }
    }
    mapperTypeColis(typeString) {
        switch (typeString.toLowerCase()) {
            case 'alimentaire':
                return TypeColis.ALIMENTAIRE;
            case 'chimique':
                return TypeColis.CHIMIQUE;
            case 'materiel-fragile':
                return TypeColis.MATERIEL_FRAGILE;
            case 'materiel-incassable':
                return TypeColis.MATERIEL_INCASSABLE;
            default:
                return TypeColis.ALIMENTAIRE;
        }
    }
    genererCodeSuivi() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `COL-${timestamp.slice(-6)}-${random}`;
    }
    verifierCompatibilite(typeColis, typeCargaison) {
        // Règles de compatibilité
        if (typeColis === 'materiel-fragile' && typeCargaison === TypeCargaison.MARITIME) {
            return false;
        }
        if (typeColis === 'chimique' && typeCargaison !== TypeCargaison.MARITIME) {
            return false;
        }
        return true;
    }
}
