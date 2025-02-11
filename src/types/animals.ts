import { Observable } from 'rxjs'

export enum Species {
    Appy = 'Appy',
    Bengali = 'Bengali',
    Poodle = 'Poodle',
}

export type Rates = {
    readonly happinessDecay: number
    readonly hungerIncrease: number
    readonly sleepinessIncrease: number
    readonly acceleratedDecayFactor: number
}

export type Animal = {
    id: string
    name: string
    species: Species

    initialHappinessPercent: number
    initialHungerPercent: number
    initialSleepinessPercent: number

    rates: Rates

    feed$: Observable<void>
    feed: () => void
    sleep$: Observable<void>
    rest: () => void
    happiness$: Observable<void>
    makeHappy: () => void
}

export type Appy = Animal & { species: Species.Appy }
export type Poodle = Animal & { species: Species.Poodle }
export type Bengali = Animal & { species: Species.Bengali }
