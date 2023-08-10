var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import * as Api from '../api/index';
let currentPage = 1;
export function scrollToTopSmoothly() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
export function scrollToBottomSmoothly() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}
export function createSeasonDiv(seasonNumber) {
    const seasonDiv = document.createElement('div');
    const seasonTitle = document.createElement('h3');
    seasonDiv.classList.add('mb-3');
    seasonTitle.textContent = `Season ${seasonNumber}`;
    seasonDiv.appendChild(seasonTitle);
    return seasonDiv;
}
export function addEpisodeToList(seasonDiv, episode) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.textContent = `${episode.episode} - ${episode.name}`;
    listItem.addEventListener('click', () => renderEpisodeDetail(episode));
    seasonDiv.appendChild(listItem);
}
export function renderEpisodes(episodes) {
    const episodesBySeason = {};
    episodes.forEach(episode => {
        const seasonCode = episode.episode.substring(0, 3);
        const seasonNumber = parseInt(seasonCode.substring(1), 10).toString();
        if (!episodesBySeason[seasonNumber]) {
            episodesBySeason[seasonNumber] = [];
        }
        episodesBySeason[seasonNumber].push(episode);
    });
    const episodeList = document.getElementById('episodeList');
    Object.keys(episodesBySeason).forEach(seasonNumber => {
        let seasonDiv = episodeList === null || episodeList === void 0 ? void 0 : episodeList.querySelector(`.season-${seasonNumber}`);
        if (!seasonDiv) {
            seasonDiv = createSeasonDiv(seasonNumber);
            seasonDiv.classList.add(`season-${seasonNumber}`);
            if (episodeList)
                episodeList.appendChild(seasonDiv);
        }
        const seasonEpisodes = episodesBySeason[seasonNumber];
        seasonEpisodes.forEach(episode => addEpisodeToList(seasonDiv, episode));
    });
}
export function renderEpisodeDetail(episode, characterPage = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        const mainContent = document.getElementById('mainContent');
        const charactersPerPage = 8;
        const totalPages = Math.ceil(episode.characters.length / charactersPerPage);
        if (mainContent) {
            mainContent.textContent = '';
            mainContent.style.background = 'none';
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
                const character = yield Api.loadCharacter(characterUrl);
                createCharacterCard(character, rowDiv);
            }
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'd-flex justify-content-center align-items-center';
            mainContent.appendChild(paginationContainer);
            if (characterPage > 1) {
                const previousPageButton = document.createElement('button');
                previousPageButton.className = 'btn btn-warning mb-3 mx-1';
                previousPageButton.textContent = 'Previous Page';
                previousPageButton.addEventListener('click', () => {
                    renderEpisodeDetail(episode, characterPage - 1);
                });
                paginationContainer.appendChild(previousPageButton);
            }
            if (characterPage < totalPages) {
                const loadMoreCharactersButton = document.createElement('button');
                loadMoreCharactersButton.className = 'btn btn-primary mb-3 mx-1';
                loadMoreCharactersButton.textContent = 'Load More Characters';
                loadMoreCharactersButton.addEventListener('click', () => {
                    renderEpisodeDetail(episode, characterPage + 1);
                });
                paginationContainer.appendChild(loadMoreCharactersButton);
            }
            const pageIndicator = document.createElement('span');
            pageIndicator.className = 'mx-3 mb-3';
            pageIndicator.textContent = `${characterPage} / ${totalPages}`;
            paginationContainer.appendChild(pageIndicator);
            scrollToTopSmoothly();
        }
        if (window.innerWidth <= 768) {
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}
export function showEpisodesModal(character) {
    return __awaiter(this, void 0, void 0, function* () {
        const episodesList = document.getElementById('episodesList');
        if (episodesList) {
            episodesList.textContent = '';
            for (const episodeUrl of character.episode) {
                const episode = yield Api.loadEpisodeByUrl(episodeUrl);
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = `${episode.name} - ${episode.episode}`;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    hideModal('episodesModal');
                    renderEpisodeDetail(episode);
                });
                li.appendChild(a);
                episodesList.appendChild(li);
            }
        }
        showModal('episodesModal');
    });
}
export function createCharacterCard(character, parentDiv) {
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
    const episodesButton = document.createElement('button');
    episodesButton.textContent = 'Episodes in which appears';
    episodesButton.className = 'btn btn-secondary d-block mx-auto';
    episodesButton.addEventListener('click', (e) => {
        e.stopPropagation();
        showEpisodesModal(character);
    });
    cardBody.appendChild(episodesButton);
    characterDiv.appendChild(card);
    characterDiv.addEventListener('click', () => {
        showCharacterDetailsModal(character);
    });
    parentDiv.appendChild(characterDiv);
}
export function showModal(id) {
    const modal = new bootstrap.Modal(document.getElementById(id), {
        keyboard: false
    });
    modal.show();
}
export function hideModal(id) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(id));
    modal.hide();
}
export function showCharacterDetailsModal(character, showLocationButton = true) {
    const modalBody = document.getElementById('characterModalBody');
    if (modalBody) {
        modalBody.textContent = '';
        modalBody.className = 'text-center';
        const name = document.createElement('h5');
        name.textContent = character.name;
        modalBody.appendChild(name);
        const image = document.createElement('img');
        image.src = character.image;
        image.alt = character.name;
        image.className = 'mx-auto d-block';
        modalBody.appendChild(image);
        const status = document.createElement('p');
        status.textContent = `Status: ${character.status}`;
        modalBody.appendChild(status);
        const species = document.createElement('p');
        species.textContent = `Species: ${character.species}`;
        modalBody.appendChild(species);
        const gender = document.createElement('p');
        gender.textContent = `Gender: ${character.gender}`;
        modalBody.appendChild(gender);
        const origin = document.createElement('p');
        origin.textContent = `Origin: ${character.origin.name}`;
        modalBody.appendChild(origin);
        if (showLocationButton) {
            const viewLocationButton = document.createElement('button');
            viewLocationButton.textContent = 'View Location';
            viewLocationButton.className = 'btn btn-primary d-block mx-auto';
            viewLocationButton.addEventListener('click', () => {
                hideModal('characterModal');
                const mainContent = document.getElementById('mainContent');
                if (mainContent) {
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                }
                renderLocation(character.location.url);
            });
            modalBody.appendChild(viewLocationButton);
        }
        showModal('characterModal');
    }
}
console.log("View Location button clicked");
console.log("Scrolling to mainContent");
(_a = document.querySelector('#characterModal .btn-close')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    hideModal('characterModal');
});
export function renderLocation(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            const location = yield Api.loadLocation(url);
            mainContent.textContent = '';
            const header = document.createElement('h2');
            header.textContent = location.name;
            mainContent.appendChild(header);
            const type = document.createElement('p');
            type.textContent = `Type: ${location.type}`;
            mainContent.appendChild(type);
            const dimension = document.createElement('p');
            dimension.textContent = `Dimension: ${location.dimension}`;
            mainContent.appendChild(dimension);
            const tittleResidents = document.createElement('h4');
            tittleResidents.textContent = `Residents:`;
            mainContent.appendChild(tittleResidents);
            const residentsList = document.createElement('ul');
            residentsList.className = 'list-unstyled';
            mainContent.appendChild(residentsList);
            location.residents.forEach((residentUrl) => __awaiter(this, void 0, void 0, function* () {
                const resident = yield Api.loadCharacter(residentUrl);
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = resident.name;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    showCharacterDetailsModal(resident, false);
                });
                li.appendChild(a);
                residentsList.appendChild(li);
            }));
            scrollToTopSmoothly();
        }
    });
}
export function setupLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreButton');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            currentPage++;
            const { episodes: newEpisodes, totalPages } = yield Api.loadEpisodes(currentPage);
            renderEpisodes(newEpisodes);
            if (currentPage >= totalPages) {
                loadMoreButton.style.display = 'none';
            }
            if (window.innerWidth > 768) {
                scrollToBottomSmoothly();
            }
            else {
                const episodeContainer = document.getElementById('episodeList');
                if (episodeContainer) {
                    episodeContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            }
        }));
    }
}
export function setupHeaderVideo() {
    const headerVideo = document.getElementById('headerVideo');
    headerVideo.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
//# sourceMappingURL=index.js.map