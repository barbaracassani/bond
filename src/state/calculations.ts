import { Animal } from '../types/animals.ts'
import {
    ACCELERATED_DECAY_FROM,
    BASE_DECAY_PER_INTERVAL,
} from './observables.ts'

export const calculateFeedDecay = (animal: Animal): number => {
    return (BASE_DECAY_PER_INTERVAL / 100) * animal.rates.hungerIncrease
}
export const calculateRestDecay = (animal: Animal): number => {
    return (BASE_DECAY_PER_INTERVAL / 100) * animal.rates.sleepinessIncrease
}

export const calculateHappinessDecay = (
    animal: Animal,
    hunger: number,
    sleep: number
): number => {
    const hungerFactor =
        hunger >= ACCELERATED_DECAY_FROM
            ? animal.rates.acceleratedDecayFactor
            : 1
    const sleepFactor =
        sleep >= ACCELERATED_DECAY_FROM
            ? animal.rates.acceleratedDecayFactor
            : 1
    return (
        (BASE_DECAY_PER_INTERVAL / 100) *
        animal.rates.happinessDecay *
        hungerFactor *
        sleepFactor
    )
}
