import { describe, expect, it, beforeEach } from 'vitest'
import { Subject, BehaviorSubject } from 'rxjs'
import { happinessLoop$, BASE_REPLENISH, tick$ } from './observables'
import { Animal, Species } from '../types/animals'
import { isSubject } from '../types/tests.ts'

const tick = () => {
    if (isSubject(tick$)) {
        return tick$.next()
    }
}

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
    let hunger$: BehaviorSubject<number>
    let sleep$: BehaviorSubject<number>

    beforeEach(() => {
        hunger$ = new BehaviorSubject(50)
        sleep$ = new BehaviorSubject(50)
    })

    it('should start from the baseline', async () => {
        const animal = createMockAnimal({ initialHappinessPercent: 30 })
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        subscription.unsubscribe()

        expect(happinessValues).toEqual([30])
    })

    it('should decrease happiness over time', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        tick()
        tick()

        subscription.unsubscribe()

        expect(happinessValues).toEqual([50, 49.5, 49])
    })

    it('should decrease faster if sleepiness is above 70', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        hunger$.next(30)
        sleep$.next(30)
        tick()
        tick()

        hunger$.next(30)
        sleep$.next(75)
        tick()
        tick()

        subscription.unsubscribe()

        const diffBefore = happinessValues[0] - happinessValues[1]
        const diffAfter =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]

        expect(diffAfter).toBeGreaterThan(diffBefore)
    })

    it('should decrease faster if hunger is above 70', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        hunger$.next(30)
        sleep$.next(30)
        tick()
        tick()

        hunger$.next(75)
        tick()
        tick()

        subscription.unsubscribe()

        const diffBefore = happinessValues[0] - happinessValues[1]
        const diffAfter =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]

        expect(diffAfter).toBeGreaterThan(diffBefore)
    })

    it('should decrease even faster if hunger and sleep are both above 70', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        hunger$.next(30)
        sleep$.next(30)
        tick()
        tick()

        const diffBefore = happinessValues[0] - happinessValues[1]

        hunger$.next(30)
        sleep$.next(75)
        tick()
        tick()

        const diffAfterOneTipping =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]

        hunger$.next(75)
        sleep$.next(75)
        tick()
        tick()

        const diffAfterBothTipping =
            happinessValues[happinessValues.length - 2] -
            happinessValues[happinessValues.length - 1]

        subscription.unsubscribe()

        expect(diffAfterOneTipping).toBeGreaterThan(diffBefore)
        expect(diffAfterBothTipping).toBeGreaterThan(diffAfterOneTipping)
    })

    it('should not increase beyond 100', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        new Array(30).fill('').forEach(() => animal.happiness$!.next())

        subscription.unsubscribe()

        expect(happinessValues[happinessValues.length - 1]).toEqual(100)
    })

    it('should not decrease past 0', async () => {
        const animal = createMockAnimal({ initialHappinessPercent: 5 })
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        new Array(15).fill('').forEach(() => {
            return tick()
        })

        subscription.unsubscribe()

        expect(happinessValues[happinessValues.length - 1]).toEqual(0)
    })

    it('should increase happiness when replenished', async () => {
        const animal = createMockAnimal({})
        const happinessValues: number[] = []

        const subscription = happinessLoop$(
            animal as Animal,
            hunger$,
            sleep$
        ).subscribe((happiness) => happinessValues.push(happiness))

        animal.happiness$!.next()

        expect(happinessValues[happinessValues.length - 1]).toEqual(
            animal.initialHappinessPercent! + BASE_REPLENISH
        )
        tick()
        subscription.unsubscribe()

        expect(happinessValues[happinessValues.length - 1]).toEqual(
            animal.initialHappinessPercent! + BASE_REPLENISH - 0.5
        )
    })
})
