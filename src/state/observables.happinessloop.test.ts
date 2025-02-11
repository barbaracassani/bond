import { describe, expect, it } from 'vitest'
import { Subject } from 'rxjs'
import { happinessLoop$, BASE_REPLENISH, tick$ } from './observables'
import { Animal, Species } from '../types/animals'

const createMockAnimal = ({
    initialSleepinessPercent,
    initialHappinessPercent,
    initialHungerPercent,
}: {
    initialSleepinessPercent?: number
    initialHappinessPercent?: number
    initialHungerPercent?: number
}): Partial<
    Omit<Animal, 'feed$' | 'sleep$' | 'happiness$'> & {
        feed$: Subject<void>
        sleep$: Subject<void>
        happiness$: Subject<void>
    }
> => ({
    id: '1',
    name: 'TestAnimal',
    species: Species.Poodle,
    initialHappinessPercent: initialHappinessPercent ?? 50,
    initialSleepinessPercent: initialSleepinessPercent ?? 50,
    initialHungerPercent: initialHungerPercent ?? 50,
    rates: {
        hungerIncrease: 10,
        sleepinessIncrease: 10,
        happinessDecay: 10,
        acceleratedDecayFactor: 1.5,
    },
    feed$: new Subject<void>(),
    sleep$: new Subject<void>(),
    happiness$: new Subject<void>(),
})

describe('happinessLoop$', () => {
    it('should start from the baseline', async () => {
        const animal = createMockAnimal({ initialHappinessPercent: 30 })
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()

        expect(happinessValues).toEqual([30])
    })
    it('should decrease happiness over time', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )

        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()

        expect(happinessValues).toEqual([50, 49.5, 49])
    })
    it('should decrease faster if sleepiness is above 70', async () => {
        const animal = createMockAnimal({
            initialSleepinessPercent: 69,
        })
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )

        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()
        const diffBeforeTipping = happinessValues[0] - happinessValues[1]
        const diffAfterTipping =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]
        expect(diffAfterTipping).toBeGreaterThan(diffBeforeTipping)
    })
    it('should decrease faster if hunger is above 70', async () => {
        const animal = createMockAnimal({
            initialHungerPercent: 69,
        })
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )

        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()
        const diffBeforeTipping = happinessValues[0] - happinessValues[1]
        const diffAfterTipping =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]
        expect(diffAfterTipping).toBeGreaterThan(diffBeforeTipping)
    })
    it('should decrease even faster if hunger and sleep are above 70', async () => {
        const animal = createMockAnimal({
            initialHungerPercent: 69,
            initialSleepinessPercent: 68,
        })
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )

        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()

        await new Promise((resolve) => setTimeout(resolve, 100))

        const diffBeforeTippingHunger = happinessValues[0] - happinessValues[1]
        const diffAfterTippingHunger =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]

        expect(diffAfterTippingHunger).toBeGreaterThan(diffBeforeTippingHunger)
        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()
        ;(tick$ as unknown as Subject<void>).next()
        subscription.unsubscribe()
        const diffAfterTippingBoth =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]
        expect(diffAfterTippingBoth).toBeGreaterThan(diffAfterTippingHunger)
    })
    it('should not increase beyond 100', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )

        new Array(30).fill('').forEach(() => {
            ;(animal.happiness$ as Subject<void>).next()
        })

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()
        expect(happinessValues[happinessValues.length - 1]).toEqual(100)
    })
    it('should not decrease past 0', async () => {
        const animal = createMockAnimal({ initialHappinessPercent: 5 })
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )
        new Array(15).fill('').forEach(() => {
            ;(tick$ as unknown as Subject<void>).next()
        })

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()
        expect(happinessValues[happinessValues.length - 1]).toEqual(0)
    })
    it('should increase happiness when replenished', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(animal as Animal).subscribe(
            (happiness) => {
                happinessValues.push(happiness)
            }
        )

        animal.happiness$!.next()

        await new Promise((resolve) => setTimeout(resolve, 100))

        expect(happinessValues[happinessValues.length - 1]).toEqual(
            animal.initialHappinessPercent! + BASE_REPLENISH
        )
        ;(tick$ as unknown as Subject<void>).next()
        subscription.unsubscribe()
        expect(happinessValues[happinessValues.length - 1]).toEqual(
            animal.initialHappinessPercent! + BASE_REPLENISH - 0.5
        )
    })
})
