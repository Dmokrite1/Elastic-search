import { render } from '../renderer';
import { SearchService } from '../services/search.service';

function switchLang(lang: 'fr' | 'nl',q: string | null) {
    const subscribeFunction = () =>  {
        SearchService.lang = lang;
        render(`/search-results?q=${q}`, {
            results : SearchService.results
        });
    };
    return subscribeFunction;
}

const searchController = async (newURL: URL)=>{
    /**
     * Pas de paramètre q ? recherche incorrecte => on redirige
     */
    if (!newURL.searchParams.get('q')) {
        render('/');
        return;
    }

    /**
     * Si les données de recherche n'ont pas été chargées précédemment, l'on charge les données et l'on recharge la vue
     */
    if (SearchService.results === undefined) {
        const searchResult   = await SearchService.search(newURL.searchParams.get('q')!);
        render(`/search-results?q=${newURL.searchParams.get('q')}`, {
            results : searchResult
        });
        return;
    }

    const frBtn = document.querySelector('#fr-btn') as HTMLButtonElement;
    const nlBtn = document.querySelector('#nl-btn') as HTMLButtonElement;
    const header = document.querySelector('h1') as HTMLHeadingElement;
    const specHeader = document.querySelectorAll('#spec-header') as NodeListOf<HTMLHeadingElement>;
    const contactHeader = document.querySelectorAll('#contact-header') as NodeListOf<HTMLHeadingElement>;
    

    const loadTranslation = (lang : 'fr' | 'nl')  => {
        header.textContent = lang === 'fr' ? 'Résultats' : 'Zoekresultaat';
        specHeader.forEach((e) => 
            e.textContent = lang === 'fr' ? 'Spécialités' : 'Specialiteiten'
        );
        contactHeader.forEach((e) => {
            e.textContent = lang === 'fr' ? 'Contact' : 'Contact';
        });
    };

    /**
     * RELOAD THE VIEW FOR TRANSLATIONS, HTML CANNOT BE TRANSLATED FROM CONTROLLER
     */
    frBtn.addEventListener('click', switchLang('fr', newURL.searchParams.get('q')));
    nlBtn.addEventListener('click', switchLang('nl', newURL.searchParams.get('q')));

    loadTranslation(SearchService.lang);

};

export {searchController};