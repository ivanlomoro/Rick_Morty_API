var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentPage = 1;
function loadEpisodes(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
        const data = yield response.json();
        return data.results;
    });
}
function loadCharacter(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const data = yield response.json();
        return data;
    });
}
function loadLocation(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const data = yield response.json();
        return data;
    });
}
function renderEpisodes(episodes) {
    const episodeList = document.getElementById('episodeList');
    episodes.forEach(episode => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${episode.episode} - ${episode.name}`;
        listItem.addEventListener('click', () => renderEpisodeDetail(episode));
        if (episodeList)
            episodeList.appendChild(listItem);
    });
}
function renderEpisodeDetail(episode, characterPage = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const mainContent = document.getElementById('mainContent');
        const charactersPerPage = 8;
        if (mainContent) {
            mainContent.textContent = '';
            mainContent.className = 'd-flex flex-column align-items-md-start align-items-center';
            const title = document.createElement('h2');
            title.textContent = episode.name;
            title.className = 'text-center text-md-start';
            mainContent.appendChild(title);
            const airDate = document.createElement('p');
            airDate.textContent = `Air Date: ${episode.air_date}`;
            airDate.className = 'text-center text-md-start';
            mainContent.appendChild(airDate);
            const episodeCode = document.createElement('p');
            episodeCode.textContent = `Episode: ${episode.episode}`;
            episodeCode.className = 'text-center text-md-start';
            mainContent.appendChild(episodeCode);
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row d-flex justify-content-center justify-content-md-center';
            mainContent.appendChild(rowDiv);
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'text-center';
            mainContent.appendChild(buttonContainer);
            const start = (characterPage - 1) * charactersPerPage;
            const end = start + charactersPerPage;
            const characterSlice = episode.characters.slice(start, end);
            for (let characterUrl of characterSlice) {
                const character = yield loadCharacter(characterUrl);
                createCharacterCard(character, rowDiv);
            }
            if (end < episode.characters.length) {
                const loadMoreCharactersButton = document.createElement('button');
                loadMoreCharactersButton.className = 'btn btn-primary mb-3 mx-1';
                loadMoreCharactersButton.textContent = 'Load More Characters';
                loadMoreCharactersButton.addEventListener('click', () => {
                    renderEpisodeDetail(episode, characterPage + 1);
                });
                buttonContainer.appendChild(loadMoreCharactersButton);
            }
            if (characterPage > 1) {
                const previousPageButton = document.createElement('button');
                previousPageButton.className = 'btn btn-secondary mb-3 mx-1';
                previousPageButton.textContent = 'Previous Page';
                previousPageButton.addEventListener('click', () => {
                    renderEpisodeDetail(episode, characterPage - 1);
                });
                buttonContainer.appendChild(previousPageButton);
            }
            if (mainContent) {
                mainContent.appendChild(buttonContainer);
            }
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}
function createCharacterCard(character, parentDiv) {
    const characterDiv = document.createElement('div');
    characterDiv.className = 'character-card col-12 col-sm-6 col-md-4 col-lg-3 mb-3';
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = character.image;
    img.alt = character.name;
    card.appendChild(img);
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    card.appendChild(cardBody);
    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = character.name;
    cardBody.appendChild(cardTitle);
    const cardTextStatus = document.createElement('p');
    cardTextStatus.className = 'card-text';
    cardTextStatus.textContent = `Status: ${character.status}`;
    cardBody.appendChild(cardTextStatus);
    const cardTextSpecies = document.createElement('p');
    cardTextSpecies.className = 'card-text';
    cardTextSpecies.textContent = `Species: ${character.species}`;
    cardBody.appendChild(cardTextSpecies);
    const viewLocationButton = document.createElement('button');
    viewLocationButton.textContent = 'View Location';
    viewLocationButton.addEventListener('click', () => {
        renderLocation(character.location.url);
    });
    cardBody.appendChild(viewLocationButton);
    characterDiv.appendChild(card);
    parentDiv.appendChild(characterDiv);
}
function renderLocation(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            const location = yield loadLocation(url);
            mainContent.textContent = '';
            const header = document.createElement('h3');
            header.textContent = location.name;
            mainContent.appendChild(header);
            const type = document.createElement('p');
            type.textContent = `Type: ${location.type}`;
            mainContent.appendChild(type);
            const dimension = document.createElement('p');
            dimension.textContent = `Dimension: ${location.dimension}`;
            mainContent.appendChild(dimension);
            const residentsList = document.createElement('ul');
            residentsList.className = 'list-unstyled';
            location.residents.forEach(resident => {
                const li = document.createElement('li');
                li.textContent = resident;
                residentsList.appendChild(li);
            });
            mainContent.appendChild(residentsList);
        }
    });
}
const loadMoreButton = document.getElementById('loadMoreButton');
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        loadEpisodes(currentPage).then(renderEpisodes);
    });
}
loadEpisodes(currentPage).then(renderEpisodes);
export {};
//# sourceMappingURL=index.js.map