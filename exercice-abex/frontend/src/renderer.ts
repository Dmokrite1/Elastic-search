import { routes } from './router';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;
const render =async (route:string,datas:Record<string,unknown>={}) =>{
    /**
     * Fix un peu bourrin, on doit reset tous les event listeners sur les boutons de changement de langue
     */
    const frBtn = document.querySelector('#fr-btn') as HTMLButtonElement;
    const nlBtn = document.querySelector('#nl-btn') as HTMLButtonElement;

    frBtn.replaceWith(frBtn.cloneNode(true));
    nlBtn.replaceWith(nlBtn.cloneNode(true));

    /**
     * Normal routing
     */
    const url = new URL(route, window.location.protocol + window.location.host);
    app.innerHTML = await routes[url.pathname].view(datas);
    await routes[url.pathname].controller(url);
    window.history.pushState({},route,window.location.origin + route);
};


export {render};