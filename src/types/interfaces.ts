import { CharacterStatus } from '../enums/characterStatus';
import { CharacterGender } from '../enums/characterGender';

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
    gender: CharacterGender;
    image: string;
    origin: { name: string; };
    location: { name: string; url: string };
    episode: string[];
}

export interface Location {
    name: string;
    type: string;
    dimension: string;
    residents: string[];
}