import { render } from './renderer';
import './style.css';

const init=(e:Event)=>{
    e.preventDefault();

    const homePage = document.querySelector('#home-page') as HTMLAnchorElement;

    homePage.addEventListener('click', (e) => {
        e.preventDefault();
        render('/');
    });

    /**
     * On doit passer les query params en plus lors de la transition initiale
     */
    render(window.location.pathname + window.location.search);
};

window.addEventListener('load',init);