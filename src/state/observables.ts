import { interval, merge, Observable, withLatestFrom } from 'rxjs'
import { Animal } from '../types/animals.ts'
import { map, scan, startWith } from 'rxjs/operators'
import {
    calculateFeedDecay,
    calculateHappinessDecay,
    calculateRestDecay,
} from './calculations.ts'

const TIME_TICK = 3000

export const BASE_DECAY_PER_INTERVAL = 5
export const BASE_REPLENISH = 25
export const ACCELLERATED_DECAY_FROM = 70

export const tick$ = interval(TIME_TICK)

export const feedLoop$ = (animal: Animal): Observable<number> => {
    return merge(
        tick$.pipe(map(() => calculateFeedDecay(animal))),
        animal.feed$.pipe(map(() => -BASE_REPLENISH))
    ).pipe(
        scan(
            (level, change) => Math.min(100, Math.max(0, level + change)),
            animal.initialHungerPercent
        ),
        startWith(animal.initialHungerPercent)
    )
}

export const sleepLoop$ = (animal: Animal): Observable<number> => {
    return merge(
        tick$.pipe(map(() => calculateRestDecay(animal))),
        animal.sleep$.pipe(map(() => -BASE_REPLENISH))
    ).pipe(
        scan(
            (level, change) => Math.min(100, Math.max(0, level + change)),
            animal.initialSleepinessPercent
        ),
        startWith(animal.initialSleepinessPercent)
    )
}

export const happinessLoop$ = (animal: Animal): Observable<number> => {
    return merge(
        tick$.pipe(
            withLatestFrom(feedLoop$(animal), sleepLoop$(animal)),
            map(([, hunger, sleep]) => {
                const decay = calculateHappinessDecay(animal, hunger, sleep)
                return -decay
            })
        ),
        animal.happiness$.pipe(map(() => BASE_REPLENISH))
    ).pipe(
        scan(
            (level, change) => Math.min(100, Math.max(0, level + change)),
            animal.initialHappinessPercent
        ),
        startWith(animal.initialHappinessPercent)
    )
}
