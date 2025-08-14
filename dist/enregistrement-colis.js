import { ColisManager } from "./services/ColisManager";
class EnregistrementColis {
    constructor() {
        this.colisManager = new ColisManager();
        this.selectedCargaisonData = null;
        this.currentColisData = null;
        this.modal = null;
        this.confirmButton = null;
        this.initializeEventListeners();
        this.initializeModals();
    }
    initializeEventListeners() {
        const form = document.getElementById('register-package-form');
        form?.addEventListener('submit', this.handleSubmit.bind(this));
    }
    initializeModals() {
        this.modal = document.getElementById('select-cargaison-modal');
        this.confirmButton = document.getElementById('confirm-selection');
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
    closeModal() {
        this.modal?.classList.add('opacity-0', 'pointer-events-none');
        this.selectedCargaisonData = null;
        if (this.confirmButton) {
            this.confirmButton.disabled = true;
        }
    }
    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const colisData = {
            type: formData.get('package-product-type'),
            poids: Number(formData.get('package-weight')),
            libelle: formData.get('libelle-produit')
        };
        // Validation des données
        if (!this.validateColisData(colisData)) {
            return;
        }
        await this.showCargaisonModal(colisData);
    }
    validateColisData(data) {
        if (!Object.values(TypeColis).includes(data.type)) {
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
    async handleCargaisonSelection() {
        if (!this.selectedCargaisonData || !this.currentColisData)
            return;
        try {
            const result = await this.colisManager.ajouterColisACargaison(this.selectedCargaisonData.id, this.currentColisData);
            if (result) {
                this.showSuccessModal("Colis ajouté avec succès", `Le colis a été ajouté à la cargaison ${this.selectedCargaisonData.id}`);
                this.closeModal();
                // Réinitialiser le formulaire
                document.getElementById('register-package-form')?.reset();
            }
        }
        catch (error) {
            this.showError(error instanceof Error ? error.message : "Erreur lors de l'ajout du colis");
        }
    }
    async showCargaisonModal(colisData) {
        this.currentColisData = colisData;
        if (!this.modal)
            return;
        try {
            const cargaisons = await this.colisManager.getCargaisonsDisponibles(colisData.type);
            if (cargaisons.length === 0) {
                this.showError("Aucune cargaison compatible disponible");
                return;
            }
            document.getElementById('colis-type-display').textContent = colisData.type;
            document.getElementById('colis-poids-display').textContent = `${colisData.poids} kg`;
            this.renderCargaisons(cargaisons);
            this.modal.classList.remove('opacity-0', 'pointer-events-none');
        }
        catch (error) {
            this.showError("Erreur lors du chargement des cargaisons");
        }
    }
    renderCargaisons(cargaisons) {
        const list = document.getElementById('cargaisons-list');
        if (!list)
            return;
        list.innerHTML = cargaisons.map(cargaison => `
            <div class="cargaison-item bg-gray-600/30 p-3 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
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
            item.addEventListener('click', () => this.selectCargaison(item));
        });
    }
    selectCargaison(item) {
        const id = item.dataset.id;
        const type = item.dataset.type;
        if (!id || !type)
            return;
        document.querySelectorAll('.cargaison-item').forEach(el => el.classList.remove('bg-cyan-500/20', 'border-cyan-400'));
        item.classList.add('bg-cyan-500/20', 'border-cyan-400');
        this.selectedCargaisonData = { id, type: type };
        if (this.confirmButton) {
            this.confirmButton.disabled = false;
        }
    }
    showSuccessModal(title, message) {
        const modal = document.getElementById('status-modal');
        if (!modal)
            return;
        const titleEl = modal.querySelector('#status-message');
        const messageEl = modal.querySelector('#status-details');
        if (titleEl)
            titleEl.textContent = title;
        if (messageEl)
            messageEl.textContent = message;
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            modal.classList.add('opacity-0', 'pointer-events-none');
        }, 3000);
    }
    showError(message) {
        // Implémenter l'affichage des erreurs ici
        console.error(message);
    }
}
// Initialiser la classe quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new EnregistrementColis();
});
