import { SearchService } from '../services/search.service';

interface searchResultsData {
    results: unknown[]
}

/**
 * You can also get the data from the service !
 */
const searchResultsView = (datas: searchResultsData) => {
    if (!datas.results) {
        return 'redirecting ...';
    }
    return `
            
            <h1 class="text-3xl text-center font-semibold mt-2"></h1>
            ${datas.results.map(({ _source }: any) => `
                <div class="mt-4 flex flex-col items-center justify-center w-3/5 m-auto border border-blue-400 p-2">
                    <h2 class="my-2 text-xl">${_source.first_name} ${_source.last_name}</h2>
                    <div class="flex flex-row justify-between w-full">
                        <div class="flex justify-between items-start flex-col w-1/2">
                            <h3 id="spec-header" class="my-2 text-lg">Spécialités</h3>
                            <div>
                                ${_source.specialties.map((s: any) => `<span class="bg-green-300">${SearchService.lang === 'fr' ? s.label : s.label_nl}`)}
                            </div>
                        </div>
                        <div class="flex flex-col  items-end w-1/2">
                            <h3 id="contact-header" class="my-2 text-lg"></h3>
                            <div>
                                <p> ${_source.email} </p>
                                <p> ${_source.cellphone} </p>
                                <p> ${_source.phone} </p>
                                <p> ${_source.address.number} ${_source.address.street}, ${_source.address.zip} ${_source.address.town} </p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
};
export { searchResultsView };
