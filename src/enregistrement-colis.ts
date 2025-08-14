import { ColisManager } from "./services/ColisManager";
import { TypeColis } from "./enums/TypeColis";

interface ColisData {
    type: string;
    poids: number;
    libelle: string;
}

interface CargaisonSelection {
    id: string;
    type: string;
}

class EnregistrementColis {
    private colisManager: ColisManager;
    private selectedCargaisonData: CargaisonSelection | null = null;
    private currentColisData: ColisData | null = null;
    private modal: HTMLElement | null = null;
    private confirmButton: HTMLButtonElement | null = null;

    constructor() {
        this.colisManager = new ColisManager();
        this.initializeEventListeners();
        this.initializeModals();
    }

    private initializeEventListeners(): void {
        const form = document.getElementById('register-package-form') as HTMLFormElement;
        form?.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private initializeModals(): void {
        this.modal = document.getElementById('select-cargaison-modal');
        this.confirmButton = document.getElementById('confirm-selection') as HTMLButtonElement;

        // Écouteur pour fermer le modal
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Écouteur pour le bouton annuler
        document.getElementById('cancel-selection')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Écouteur pour le bouton confirmer
        this.confirmButton?.addEventListener('click', () => {
            this.handleCargaisonSelection();
        });
    }

    private closeModal(): void {
        this.modal?.classList.add('opacity-0', 'pointer-events-none');
        this.selectedCargaisonData = null;
        if (this.confirmButton) {
            this.confirmButton.disabled = true;
        }
    }

    private async handleSubmit(e: Event): Promise<void> {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const colisData: ColisData = {
            type: formData.get('package-product-type') as string,
            poids: Number(formData.get('package-weight')),
            libelle: formData.get('libelle-produit') as string
        };

        // Validation des données
        if (!this.validateColisData(colisData)) {
            return;
        }

        await this.showCargaisonModal(colisData);
    }

    private validateColisData(data: ColisData): boolean {
        const validTypes = ['alimentaire', 'chimique', 'materiel-fragile', 'materiel-incassable'];
        
        if (!validTypes.includes(data.type)) {
            this.showError("Type de colis invalide");
            return false;
        }

        if (!data.type || !data.poids || !data.libelle) {
            this.showError("Veuillez remplir tous les champs obligatoires");
            return false;
        }

        if (data.poids <= 0) {
            this.showError("Le poids doit être supérieur à 0");
            return false;
        }

        return true;
    }

    private async handleCargaisonSelection(): Promise<void> {
        if (!this.selectedCargaisonData || !this.currentColisData) return;

        try {
            const result = await this.colisManager.ajouterColisACargaison(
                this.selectedCargaisonData.id, 
                this.currentColisData
            );

            if (result) {
                this.showSuccessModal(
                    "Colis ajouté avec succès", 
                    `Le colis a été ajouté à la cargaison ${this.selectedCargaisonData.id}`
                );
                this.closeModal();
                
                // Réinitialiser le formulaire
                const form = document.getElementById('register-package-form') as HTMLFormElement;
                form?.reset();
            }
        } catch (error) {
            this.showError(error instanceof Error ? error.message : "Erreur lors de l'ajout du colis");
        }
    }

    private async showCargaisonModal(colisData: ColisData): Promise<void> {
        this.currentColisData = colisData;
        
        if (!this.modal) return;

        try {
            const cargaisons = await this.colisManager.getCargaisonsDisponibles(colisData.type);
            
            if (cargaisons.length === 0) {
                this.showError("Aucune cargaison compatible disponible");
                return;
            }

            const typeDisplay = document.getElementById('colis-type-display');
            const poidsDisplay = document.getElementById('colis-poids-display');
            
            if (typeDisplay) typeDisplay.textContent = colisData.type.toUpperCase();
            if (poidsDisplay) poidsDisplay.textContent = `${colisData.poids} kg`;

            this.renderCargaisons(cargaisons);
            this.modal.classList.remove('opacity-0', 'pointer-events-none');
        } catch (error) {
            this.showError("Erreur lors du chargement des cargaisons");
        }
    }

    private renderCargaisons(cargaisons: any[]): void {
        const list = document.getElementById('cargaisons-list');
        if (!list) return;

        list.innerHTML = cargaisons.map(cargaison => `
            <div class="cargaison-item bg-gray-600/30 p-3 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer border border-transparent hover:border-cyan-400/50"
                 data-id="${cargaison.numero}" data-type="${cargaison.type}">
                <div class="flex items-center justify-between">
                    <span class="text-cyan-400 font-semibold">${cargaison.numero}</span>
                    <span class="text-sm text-gray-400">${cargaison.type}</span>
                </div>
                <div class="text-sm text-gray-300 mt-1">
                    ${cargaison.lieuDepart.pays} → ${cargaison.lieuArrivee.pays}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                    ${cargaison.colis.length}/10 colis - ${cargaison.poidsMax}kg max
                </div>
            </div>
        `).join('');

        // Ajouter les écouteurs d'événements
        list.querySelectorAll('.cargaison-item').forEach(item => {
            item.addEventListener('click', () => this.selectCargaison(item as HTMLElement));
        });
    }

    private selectCargaison(item: HTMLElement): void {
        const id = item.dataset.id;
        const type = item.dataset.type;
        
        if (!id || !type) return;

        // Désélectionner tous les autres éléments
        document.querySelectorAll('.cargaison-item').forEach(el => {
            el.classList.remove('bg-cyan-500/20', 'border-cyan-400');
        });

        // Sélectionner l'élément actuel
        item.classList.add('bg-cyan-500/20', 'border-cyan-400');

        this.selectedCargaisonData = { id, type };
        
        if (this.confirmButton) {
            this.confirmButton.disabled = false;
        }
    }

    private showSuccessModal(title: string, message: string): void {
        const modal = document.getElementById('status-modal');
        if (!modal) return;

        const titleEl = modal.querySelector('#status-message');
        const messageEl = modal.querySelector('#status-details');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;

        modal.classList.remove('opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
        }, 3000);
    }

    private showError(message: string): void {
        // Créer un toast d'erreur
        const toastContainer = document.getElementById('toast-root') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'bg-red-600 border-l-4 border-red-800 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in';
        toast.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-triangle text-red-200"></i>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-bold">Erreur</h3>
                    <p class="text-sm mt-1">${message}</p>
                </div>
                <button onclick="this.parentElement?.parentElement?.remove()" class="ml-auto text-red-200 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    private createToastContainer(): HTMLElement {
        let container = document.getElementById('toast-root');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-root';
            container.className = 'fixed top-4 right-4 z-50 space-y-3';
            document.body.appendChild(container);
        }
        return container;
    }
}

// Initialiser la classe quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new EnregistrementColis();
});