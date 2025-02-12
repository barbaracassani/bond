import { describe, expect, it } from 'vitest'
import { Subject } from 'rxjs'
import { combinedLoop$, tick$ } from './observables'
import { Animal, Species } from '../types/animals'
import { isSubject } from '../types/tests.ts'

const tick = () => {
    if (isSubject(tick$)) {
        return tick$.next()
    }
}

const createMockAnimal = (): Partial<
    Omit<Animal, 'feed$' | 'sleep$' | 'happiness$'> & {
        feed$: Subject<void>
        sleep$: Subject<void>
        happiness$: Subject<void>
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
    feed$: new Subject<void>(),
    sleep$: new Subject<void>(),
    happiness$: new Subject<void>(),
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
})
