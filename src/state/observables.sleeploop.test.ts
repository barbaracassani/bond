import { describe, expect, it } from 'vitest'
import { Subject } from 'rxjs'
import { sleepLoop$, BASE_REPLENISH, tick$ } from './observables'
import { Animal, Species } from '../types/animals'

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
    initialSleepinessPercent: 50,
    rates: {
        hungerIncrease: 1,
        sleepinessIncrease: 10,
        happinessDecay: 1,
        acceleratedDecayFactor: 1,
    },
    feed$: new Subject<void>(),
    sleep$: new Subject<void>(),
    happiness$: new Subject<void>(),
})

describe('sleepLoop$', () => {
    it('should start from the baseline', async () => {
        const animal = createMockAnimal()
        const tirednessValues: number[] = []

        const subscription = sleepLoop$(animal as Animal).subscribe((tiredness) => {
            tirednessValues.push(tiredness)
        })

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()

        expect(tirednessValues).toEqual([50])
    })
    it('should increase tiredness over time', async () => {
        const animal = createMockAnimal()
        const tirednessValues: number[] = []

        const subscription = sleepLoop$(animal as Animal).subscribe((tiredness) => {
                tirednessValues.push(tiredness)
            })

        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()

        expect(tirednessValues).toEqual([50, 50.5, 51])
    })
    it('should not increase beyond 100', async () => {
        const animal = createMockAnimal()
        const tirednessValues: number[] = []

        const subscription = sleepLoop$(animal as Animal).subscribe((tiredness) => {
            tirednessValues.push(tiredness)
        })

        new Array(110).fill('').forEach(() => {
            ;(tick$ as unknown as Subject<void>).next()
        })

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()
        expect(tirednessValues[tirednessValues.length - 1]).toEqual(100)
    })
    it('should not decrease past 0', async () => {
        const animal = createMockAnimal()
        const tirednessValues: number[] = []

        const subscription = sleepLoop$(animal as Animal).subscribe((tiredness) => {
            tirednessValues.push(tiredness)
        })
        animal.sleep$!.next();
        animal.sleep$!.next();
        animal.sleep$!.next();
        animal.sleep$!.next();
        animal.sleep$!.next();
        animal.sleep$!.next();

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()
        expect(tirednessValues[tirednessValues.length - 1]).toEqual(0)
    })
    it('should decrease tiredness when resting', async () => {
        const animal = createMockAnimal()
        const tirednessValues: number[] = []

        const subscription = sleepLoop$(animal as Animal).subscribe((tiredness) => {
            tirednessValues.push(tiredness)
        })

        animal.sleep$!.next()

        await new Promise((resolve) => setTimeout(resolve, 100))

        expect(tirednessValues[tirednessValues.length - 1]).toEqual(
            animal.initialSleepinessPercent! - BASE_REPLENISH
        )
        ;(tick$ as unknown as Subject<void>).next()
        subscription.unsubscribe()
        expect(tirednessValues[tirednessValues.length - 1]).toEqual(
            animal.initialSleepinessPercent! - BASE_REPLENISH + 0.5
        )
    })
})
