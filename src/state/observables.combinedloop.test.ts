import { describe, expect, it } from 'vitest'
import { Subject } from 'rxjs'
import { combinedLoop$, tick$ } from './observables'
import {
    Animal,
    DepletingAction,
    ReplenishAction,
    Species,
} from '../types/animals'
import { isSubject } from '../types/tests.ts'

const tick = () => {
    if (isSubject(tick$)) {
        return tick$.next(DepletingAction.time)
    }
}

const createMockAnimal = (): Partial<
    Omit<Animal, 'replenish$' | 'sleep$' | 'happiness$'> & {
        replenish$: Subject<ReplenishAction>
    }
> => ({
    id: '1',
    name: 'TestAnimal',
    species: Species.Bengali,
    initialSleepinessPercent: 80,
    initialHungerPercent: 80,
    initialHappinessPercent: 80,
    rates: {
        hungerIncrease: 10,
        sleepinessIncrease: 10,
        happinessDecay: 1,
        acceleratedDecayFactor: 1,
    },
    replenish$: new Subject<ReplenishAction>(),
})

describe('combinedLoop$', () => {
    it('should emit on ticks', async () => {
        const animal = createMockAnimal()

        const emittedValues: {
            hunger: number
            sleep: number
            happiness: number
        }[] = []

        const subscription = combinedLoop$(animal as Animal).subscribe(
            (values) => {
                emittedValues.push(values)
            }
        )
        expect(emittedValues.length).toBe(1)
        tick()
        subscription.unsubscribe()
        expect(emittedValues.length).toBeGreaterThan(1)
    })
    it('should emit all the values straight away', async () => {
        const animal = createMockAnimal()
        const emittedValues: {
            hunger: number
            sleep: number
            happiness: number
        }[] = []

        const subscription = combinedLoop$(animal as Animal).subscribe(
            (values) => {
                emittedValues.push(values)
            }
        )
        expect(emittedValues).toEqual([
            {
                happiness: 80,
                hunger: 80,
                sleep: 80,
            },
        ])
        subscription.unsubscribe()
    })
    it('should decrease sleep when sleep is triggered', async () => {
        const animal = createMockAnimal()
        const emittedValues: {
            hunger: number
            sleep: number
            happiness: number
        }[] = []

        const subscription = combinedLoop$(animal as Animal).subscribe(
            (values) => {
                emittedValues.push(values)
            }
        )

        expect(emittedValues.length).toBe(1)

        animal.replenish$?.next(ReplenishAction.sleep)
        expect(emittedValues).toEqual([
            { hunger: 80, sleep: 80, happiness: 80 },
            { hunger: 80, sleep: 55, happiness: 80 },
        ])

        subscription.unsubscribe()
    })
    it('should decrease hunger when feed is triggered', async () => {
        const animal = createMockAnimal()
        const emittedValues: {
            hunger: number
            sleep: number
            happiness: number
        }[] = []

        const subscription = combinedLoop$(animal as Animal).subscribe(
            (values) => {
                emittedValues.push(values)
            }
        )

        expect(emittedValues.length).toBe(1)

        animal.replenish$?.next(ReplenishAction.feed)

        expect(emittedValues).toEqual([
            { hunger: 80, sleep: 80, happiness: 80 },
            { hunger: 55, sleep: 80, happiness: 80 },
        ])

        subscription.unsubscribe()
    })
    it('should increase happiness when makeHappy is triggered', async () => {
        const animal = createMockAnimal()
        const emittedValues: {
            hunger: number
            sleep: number
            happiness: number
        }[] = []

        const subscription = combinedLoop$(animal as Animal).subscribe(
            (values) => {
                emittedValues.push(values)
            }
        )

        expect(emittedValues.length).toBe(1)

        animal.replenish$?.next(ReplenishAction.makeHappy)

        expect(emittedValues).toEqual([
            { hunger: 80, sleep: 80, happiness: 80 },
            { hunger: 80, sleep: 80, happiness: 100 },
        ])

        subscription.unsubscribe()
    })
})
