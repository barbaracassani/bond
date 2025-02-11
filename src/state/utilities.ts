import {Animal, Rates, Species} from '../types/animals.ts'

const rates: Record<Species, Rates> = {
    [Species.Poodle]: {
        happinessDecay: 50,
        hungerIncrease: 90,
        sleepinessIncrease: 10,
        acceleratedDecayFactor: 50
    },
    [Species.Appy]: {
        happinessDecay: 10,
        hungerIncrease: 40,
        sleepinessIncrease: 70,
        acceleratedDecayFactor: 40
    },
    [Species.Bengali]: {
        happinessDecay: 5,
        hungerIncrease: 85,
        sleepinessIncrease: 80,
        acceleratedDecayFactor: 20
    }
}

export const createAnimal = ({ species, name, id }: Partial<Animal>): Partial<Animal> => {
    return {
        id,
        name,
        species,
        rates: rates[species!],
        initialSleepinessPercent: 50,
        initialHappinessPercent: 50,
        initialHungerPercent: 50,
    }
}
