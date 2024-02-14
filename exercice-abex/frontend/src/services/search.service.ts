export class SearchService {
    /**
     * La langue est session-wide
     */
    public static lang: 'fr' | 'nl' = 'fr';
    /**
     * Actuellement pas très utilise, sert juste de switch pour savoir si les données ont bien été récupérées
     */
    public static results?: Record<string, unknown>[];

    public static async search(q: string) {
        return (this.results = await fetch(
            `http://localhost:8000/api/search?lang=${this.lang}&q=${q}`
        )
            .then((e) => e.json())
            .then((e) => e.result));
    }
}
