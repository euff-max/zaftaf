import { TypeCargaison } from "@/enumsCargaison/TypeCargaison";

interface ICargaison {
    etatGlobal: string;
    type: string;
    colis: any[];
}



export class ColisManager {
    private endpoint = 'http://localhost:3000/cargaisons';

    async getCargaisonsDisponibles(typeColis: string): Promise<ICargaison[]> {
        try {
            const response = await fetch(this.endpoint);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des cargaisons');
            }

            const cargaisons: ICargaison[] = await response.json();
            
            return cargaisons.filter(cargaison => {
                // Vérifier si la cargaison est ouverte
                if (cargaison.etatGlobal !== 'OUVERT') return false;

                // Vérifier la limite de colis
                if (cargaison.colis.length >= 10) return false;

                // Vérifier la compatibilité selon le type
                return this.verifierCompatibilite(typeColis, cargaison.type);
            });
        } catch (error) {
            console.error("Erreur:", error);
            throw error;
        }
    }

    private verifierCompatibilite(typeColis: string, typeCargaison: string): boolean {
        // Règles de compatibilité
        if (typeColis === 'FRAGILE' && typeCargaison === TypeCargaison.MARITIME) {
            return false;
        }
        if (typeColis === 'CHIMIQUE' && typeCargaison !== TypeCargaison.MARITIME) {
            return false;
        }
        return true;
    }
}