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

    readonly feed$: Observable<void>
    readonly feed: () => void
    readonly sleep$: Observable<void>
    readonly rest: () => void
    readonly happiness$: Observable<void>
    readonly makeHappy: () => void
}
