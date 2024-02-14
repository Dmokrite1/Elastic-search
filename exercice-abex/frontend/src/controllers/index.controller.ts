import { render } from '../renderer';
import { SearchService } from '../services/search.service';

function switchLang(lang: 'fr' | 'nl') {
    const subscribeFunction = () =>  {
        SearchService.lang = lang;
        /**
         * On doit arrêter d'écouter l'évènement, sinon ils vont s'accumuler
         */
        render('/');
    };
    return subscribeFunction;
}

const indexController = async ()=>{
    const bar = document.querySelector('#search-bar') as HTMLFormElement;
    const frBtn = document.querySelector('#fr-btn') as HTMLButtonElement;
    const nlBtn = document.querySelector('#nl-btn') as HTMLButtonElement;
    const searchTitle = document.querySelector('#search-title') as HTMLHeadingElement;
    const searchBtn = document.querySelector('#search-btn' ) as HTMLButtonElement;

    const loadTranslation = (lang : 'fr' | 'nl')  => {
        searchTitle.textContent = lang === 'fr' ? 'Rechercher un expert' : 'Zoek in de deskundingen';
        searchBtn.textContent = lang === 'fr' ? 'Rechercher' : 'Zoeken';
    };

    frBtn.addEventListener('click', switchLang('fr'));
    nlBtn.addEventListener('click', switchLang('nl'));

    loadTranslation(SearchService.lang);

    bar?.addEventListener('submit',async (e) => {
        e.preventDefault();
        const searchBar = bar.elements.item(0) as HTMLInputElement;
        const searchResult   = await SearchService.search(searchBar.value);
        render(`/search-results?q=${searchBar.value}`, {
            results : searchResult
        });
    });
};

export {indexController};