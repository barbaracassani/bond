export enum Species {
    Appy = 'Appy',
    Bengali = 'Bengali',
    Poodle = 'Poodle',
}

export type Rates = {
    happinessDecay: number
    hungerIncrease: number
    sleepinessIncrease: number
    acceleratedDecayFactor: number
}

export type Animal = {
    id: string
    name: string
    species: Species

    happinessPercent: number
    hungerPercent: number
    sleepinessPercent: number

    rates: Rates

    play: () => void
    feed: () => void
    rest: () => void
}

export type Appy = Animal & { species: Species.Appy }
export type Poodle = Animal & { species: Species.Poodle }
export type Bengali = Animal & { species: Species.Bengali }
