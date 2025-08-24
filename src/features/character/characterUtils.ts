import type { Affinity } from '../../types/character';
import { AFFINITIES } from '../../constants/gameConstants';

const ALL_AFFINITIES = Object.keys(AFFINITIES) as Affinity[];

export const getRandomAffinities = (): Affinity[] => {
    const shuffled = [...ALL_AFFINITIES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
};

export const getRandomDormantAffinity = (awakened: Affinity): Affinity => {
    const potentialDormant = ALL_AFFINITIES.filter(a => a !== awakened);
    return potentialDormant[Math.floor(Math.random() * potentialDormant.length)];
};