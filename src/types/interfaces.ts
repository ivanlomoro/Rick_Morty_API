import { CharacterStatus } from '../enums/characterStatus';

export interface Episode {
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
}

export interface Character {
    name: string;
    status: CharacterStatus;
    species: string;
    gender: string;
    image: string;
    origin: { name: string; };
    location: { name: string; url: string };
}

export interface Location {
    name: string;
    type: string;
    dimension: string;
    residents: string[];
}