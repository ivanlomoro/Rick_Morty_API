import { Episode, Character, Location } from '../types/interfaces';
const API_URL = 'https://rickandmortyapi.com/api/episode';

export async function loadEpisodes(page: number): Promise<{episodes: Episode[], totalPages: number}> {
    const response = await fetch(`${API_URL}?page=${page}`);
    const data = await response.json();
    return {
        episodes: data.results as Episode[],
        totalPages: data.info.pages
    };
}

export async function loadCharacter(url: string): Promise<Character> {
    const response = await fetch(url);
    const data = await response.json();
    return data as Character;
}

export async function loadLocation(url: string): Promise<Location> {
    const response = await fetch(url);
    const data = await response.json();
    return data as Location;
}

export async function loadEpisodeByUrl(url: string): Promise<Episode> {
    const response = await fetch(url);
    const data = await response.json();
    return data as Episode;
}