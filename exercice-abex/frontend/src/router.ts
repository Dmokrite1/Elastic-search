import { indexController } from './controllers/index.controller';
import { searchController } from './controllers/search-result.controller';
import { indexView } from './views/index.view';
import { searchResultsView } from './views/search-results.view';

export interface Route {
    view:(data:Record<string,unknown>)=> Promise<string> | string;
    /**
     * La nouvelle URL qui sera accédée
     */
    controller:(url : URL)=>Promise<void> | void;
}

const routes:{[key:string ]: Route} = {
    '/':{view :indexView, controller:indexController},
    '/search-results':{ view :searchResultsView, controller:searchController}
};

export {routes};