import {interval, mapTo, merge, Observable, share, Subject} from 'rxjs'
import { Animal, DepletingAction, ReplenishAction } from '../types/animals.ts'
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
        ? new Subject<DepletingAction>()
        : interval(TIME_TICK).pipe(mapTo(DepletingAction.time), share())

export const combinedLoop$ = (
    animal: Animal
): Observable<{ hunger: number; sleep: number; happiness: number }> => {
    return merge(tick$, animal.replenish$).pipe(
        scan(
            (state, event) => {
                const stateCopy = { ...state }
                switch (event) {
                    case DepletingAction.time:
                        stateCopy.sleep = Math.min(
                            100,
                            Math.max(
                                0,
                                stateCopy.sleep + calculateRestDecay(animal)
                            )
                        )
                        stateCopy.hunger = Math.min(
                            100,
                            Math.max(
                                0,
                                stateCopy.hunger + calculateFeedDecay(animal)
                            )
                        )
                        stateCopy.happiness = Math.min(
                            100,
                            Math.max(
                                0,
                                stateCopy.happiness -
                                    calculateHappinessDecay(
                                        animal,
                                        stateCopy.hunger,
                                        stateCopy.sleep
                                    )
                            )
                        )
                        break
                    case ReplenishAction.sleep:
                        stateCopy.sleep = Math.min(
                            100,
                            Math.max(0, stateCopy.sleep - BASE_REPLENISH)
                        )
                        break
                    case ReplenishAction.feed:
                        stateCopy.hunger = Math.min(
                            100,
                            Math.max(0, stateCopy.hunger - BASE_REPLENISH)
                        )
                        break
                    case ReplenishAction.makeHappy:
                        stateCopy.happiness = Math.min(
                            100,
                            Math.max(0, stateCopy.happiness + BASE_REPLENISH)
                        )
                }
                return stateCopy
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
