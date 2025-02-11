import { describe, expect, it } from 'vitest';
import { createAnimal } from './utilities.ts';
import { Species } from '../types/animals';

describe('createAnimal', () => {
    it('should copy the correct rates for each species', () => {
        const animal1 = createAnimal({ species: Species.Poodle, name: 'Fido', id: 'a' });
        const animal2 = createAnimal({ species: Species.Appy, name: 'Mario', id: 'b' });
        const animal3 = createAnimal({ species: Species.Bengali, name: 'Spot', id: 'c' });

        expect(animal1.rates).toEqual({
            happinessDecay: 50,
            hungerIncrease: 90,
            sleepinessIncrease: 10,
            acceleratedDecayFactor: 1.5,
        });
        expect(animal2.rates).toEqual({
            happinessDecay: 10,
            hungerIncrease: 40,
            sleepinessIncrease: 70,
            acceleratedDecayFactor: 1.4,
        });
        expect(animal3.rates).toEqual({
            happinessDecay: 5,
            hungerIncrease: 85,
            sleepinessIncrease: 80,
            acceleratedDecayFactor: 1.2,
        });
    });
});
