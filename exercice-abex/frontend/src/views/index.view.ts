interface indexData {}

const indexView = (_datas: indexData) => {
    return `
        <div class="flex flex-col  items-center mt-10 justify-center">    
            <h1  id="search-title" class="font-semibold text-2xl"></h1>
            <form class="my-10 flex flex-col w-full items-center" id="search-bar">
                <input class="w-1/2 h-10 border-blue-400 border pl-2" value="" placeholder="search" />
                <button id="search-btn" class="p-2 w-1/4 mt-4 bg-blue-400" type="submit">
                    
                </button>
            </form>
        </div>
        `;
};
export { indexView };