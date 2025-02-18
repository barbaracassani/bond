import { interval, merge, Observable, share, Subject } from 'rxjs'
import { Animal, ReplenishAction } from '../types/animals.ts'
import { scan, startWith } from 'rxjs/operators'
import {
    calculateFeedDecay,
    calculateHappinessDecay,
    calculateRestDecay,
} from './calculations.ts'

const TIME_TICK = 3000

export const BASE_DECAY_PER_INTERVAL = 5
export const BASE_REPLENISH = 25
export const ACCELERATED_DECAY_FROM = 70

export const tick$ =
    import.meta.env.MODE === 'test'
        ? new Subject<number>()
        : interval(TIME_TICK).pipe(share())

const updateHunger = (
    animal: Animal,
    previous: number,
    event: number | ReplenishAction
) => {
    if (
        event === ReplenishAction.makeHappy ||
        event === ReplenishAction.sleep
    ) {
        return previous
    }
    const hungerChange =
        typeof event === 'number' ? calculateFeedDecay(animal) : -BASE_REPLENISH
    return Math.min(100, Math.max(0, previous + hungerChange))
}

const updateSleep = (
    animal: Animal,
    previous: number,
    event: number | ReplenishAction
) => {
    if (event === ReplenishAction.makeHappy || event === ReplenishAction.feed) {
        return previous
    }
    const sleepChange =
        typeof event === 'number' ? calculateRestDecay(animal) : -BASE_REPLENISH
    return Math.min(100, Math.max(0, previous + sleepChange))
}

const updateHappiness = (
    animal: Animal,
    previous: number,
    event: number | ReplenishAction,
    hunger: number,
    sleep: number
) => {
    if (event === ReplenishAction.sleep || event === ReplenishAction.feed) {
        return previous
    }
    const happinessChange =
        typeof event === 'number'
            ? -calculateHappinessDecay(animal, hunger, sleep)
            : BASE_REPLENISH
    return Math.min(100, Math.max(0, previous + happinessChange))
}

export const combinedLoop$ = (
    animal: Animal
): Observable<{ hunger: number; sleep: number; happiness: number }> => {
    return merge(tick$, animal.replenish$).pipe(
        scan(
            (state, event) => {
                const newSleep = updateSleep(animal, state.sleep, event)
                const newHunger = updateHunger(animal, state.hunger, event)
                // todo too many params!
                const newHappiness = updateHappiness(
                    animal,
                    state.happiness,
                    event,
                    state.hunger,
                    state.sleep
                )
                return {
                    hunger: newHunger,
                    sleep: newSleep,
                    happiness: newHappiness,
                }
            },
            {
                hunger: animal.initialHungerPercent,
                sleep: animal.initialSleepinessPercent,
                happiness: animal.initialHappinessPercent,
            }
        ),
        startWith({
            hunger: animal.initialHungerPercent,
            sleep: animal.initialSleepinessPercent,
            happiness: animal.initialHappinessPercent,
        })
    )
}
