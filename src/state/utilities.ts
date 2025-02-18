import { Animal, Rates, ReplenishAction, Species } from '../types/animals.ts'
import { createSignal } from '@react-rxjs/utils'

const rates: Record<Species, Rates> = {
    [Species.Poodle]: {
        happinessDecay: 50,
        hungerIncrease: 90,
        sleepinessIncrease: 10,
        acceleratedDecayFactor: 1.5,
    },
    [Species.Appy]: {
        happinessDecay: 10,
        hungerIncrease: 40,
        sleepinessIncrease: 70,
        acceleratedDecayFactor: 1.4,
    },
    [Species.Bengali]: {
        happinessDecay: 5,
        hungerIncrease: 85,
        sleepinessIncrease: 80,
        acceleratedDecayFactor: 1.2,
    },
}

export const createAnimal = ({
    species,
    name,
    id,
}: Pick<Animal, 'name' | 'id' | 'species'>): Animal => {
    const [replenish$, makeReplenish] = createSignal<ReplenishAction>()
    return {
        id,
        name,
        species,
        rates: rates[species!],
        initialSleepinessPercent: 50,
        initialHappinessPercent: 50,
        initialHungerPercent: 50,
        replenish$,
        makeReplenish,
    }
}
