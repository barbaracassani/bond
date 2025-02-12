import {
    combineLatest,
    interval,
    merge,
    Observable,
    Subject,
    withLatestFrom,
} from 'rxjs'
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

export const tick$ =
    import.meta.env.MODE === 'test'
        ? new Subject<number>()
        : interval(TIME_TICK)

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

export const happinessLoop$ = (
    animal: Animal,
    hunger$: Observable<number>,
    sleep$: Observable<number>
): Observable<number> => {
    return merge(
        tick$.pipe(
            withLatestFrom(hunger$, sleep$),
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

export const combinedLoop$ = (animal: Animal) => {
    const hunger$ = feedLoop$(animal)
    const sleep$ = sleepLoop$(animal)
    const happiness$ = happinessLoop$(animal, hunger$, sleep$)
    // note of the author: it should be possible to subscribe to tick$ here instead of inside the single observables
    // This would reduce the number of emissions and therefore the performance.
    return combineLatest([hunger$, sleep$, happiness$]).pipe(
        map(([hunger, sleep, happiness]) => ({ hunger, sleep, happiness }))
    )
}
