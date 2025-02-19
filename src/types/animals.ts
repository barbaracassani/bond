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

export enum ReplenishAction {
    'feed' = 'feed',
    'makeHappy' = 'makeHappy',
    'sleep' = 'sleep',
}

export enum DepletingAction {
    'time' = 'time',
}

export type Animal = {
    id: string
    name: string
    species: Species

    initialHappinessPercent: number
    initialHungerPercent: number
    initialSleepinessPercent: number

    rates: Rates

    readonly replenish$: Observable<ReplenishAction>
    readonly makeReplenish: (key: ReplenishAction) => void
}
