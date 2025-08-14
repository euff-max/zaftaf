export class ApiFetcher {
    async fetchData() {
        try {
            const response = await fetch(this.endpoint);
            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Erreur lors de la récupération:", error);
            return [];
        }
    }
}
