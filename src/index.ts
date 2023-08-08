import { Episode, Character, Location } from './types/interfaces';
declare var bootstrap: any;

let currentPage = 1;

async function loadEpisodes(page: number): Promise<Episode[]> {
    const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
    const data = await response.json();
    return data.results as Episode[];
}

async function loadCharacter(url: string): Promise<Character> {
    const response = await fetch(url);
    const data = await response.json();
    return data as Character;
}

async function loadLocation(url: string): Promise<Location> {
    const response = await fetch(url);
    const data = await response.json();
    return data as Location;
}


function scrollToTopSmoothly(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

function renderEpisodes(episodes: Episode[]): void {
    const episodeList = document.getElementById('episodeList');
    episodes.forEach(episode => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${episode.episode} - ${episode.name}`;
        listItem.addEventListener('click', () => renderEpisodeDetail(episode));
        if (episodeList) episodeList.appendChild(listItem);
    });
}

async function renderEpisodeDetail(episode: Episode, characterPage: number = 1): Promise<void> {
    const mainContent = document.getElementById('mainContent');
    const charactersPerPage = 8;


    if(mainContent) {
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
            const character = await loadCharacter(characterUrl);
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
    
        if(mainContent) {
            mainContent.appendChild(buttonContainer);
        }

        scrollToTopSmoothly();
    }
}


function createCharacterCard(character: Character, parentDiv: HTMLElement): void {
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

    characterDiv.appendChild(card); // Agregar la tarjeta al characterDiv

    characterDiv.addEventListener('click', () => {
        showCharacterDetailsModal(character);
    });

    parentDiv.appendChild(characterDiv);
}


function showModal(id: string): void {
    const modal = new bootstrap.Modal(document.getElementById(id), {
      keyboard: false
    });
    modal.show();
  }
  
  function hideModal(id: string): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById(id));
    modal.hide();
  }
  

  function showCharacterDetailsModal(character: Character, showLocationButton: boolean = true): void {
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
                renderLocation(character.location.url);
            });
            modalBody.appendChild(viewLocationButton);
        }

        // Mostrar el modal
        showModal('characterModal');
    }
}
    document.querySelector('#characterModal .btn-close')?.addEventListener('click', () => {
    hideModal('characterModal');
  });


  async function renderLocation(url: string): Promise<void> {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        const location = await loadLocation(url);
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

        location.residents.forEach(async residentUrl => {
            const resident = await loadCharacter(residentUrl);
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#'; // Make the link do nothing when clicked
            a.textContent = resident.name;
            a.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent the link from following the href
                showCharacterDetailsModal(resident, false);
            });
            li.appendChild(a);
            residentsList.appendChild(li);
        });
        scrollToTopSmoothly();
    }
}


const loadMoreButton = document.getElementById('loadMoreButton');
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        loadEpisodes(currentPage).then(renderEpisodes);
    });
}

const headerVideo = document.getElementById('headerVideo') as HTMLVideoElement;

headerVideo.addEventListener('click', () => {
    window.location.href = 'index.html';
});


// load initial set of episodes
loadEpisodes(currentPage).then(renderEpisodes);