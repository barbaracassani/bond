import { describe, expect, it } from 'vitest'
import { Subject } from 'rxjs'
import { feedLoop$, BASE_REPLENISH, tick$ } from './observables'
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
    initialHungerPercent: 50,
    rates: {
        hungerIncrease: 10,
        sleepinessIncrease: 1,
        happinessDecay: 1,
        acceleratedDecayFactor: 1,
    },
    feed$: new Subject<void>(),
    sleep$: new Subject<void>(),
    happiness$: new Subject<void>(),
})

describe('feedLoop$', () => {
    it('should start from the baseline', async () => {
        const animal = createMockAnimal()
        const hungerValues: number[] = []

        const subscription = feedLoop$(animal as Animal).subscribe((hunger) => {
            hungerValues.push(hunger)
        })

        subscription.unsubscribe()

        expect(hungerValues).toEqual([50])
    })
    it('should increase hunger over time', async () => {
        const animal = createMockAnimal()
        const hungerValues: number[] = []

        const subscription = feedLoop$(animal as Animal).subscribe((hunger) => {
            hungerValues.push(hunger)
        })

        tick()
        tick()

        subscription.unsubscribe()

        expect(hungerValues.length).toBeGreaterThan(1)
        expect(hungerValues).toEqual([50, 50.5, 51])
    })
    it('should not increase beyond 100', async () => {
        const animal = createMockAnimal()
        const hungerValues: number[] = []

        const subscription = feedLoop$(animal as Animal).subscribe((hunger) => {
            hungerValues.push(hunger)
        })

        new Array(110).fill('').forEach(() => {
            tick()
        })

        await new Promise((resolve) => setTimeout(resolve, 100))

        subscription.unsubscribe()
        expect(hungerValues[hungerValues.length - 1]).toEqual(100)
    })
    it('should not decrease past 0', async () => {
        const animal = createMockAnimal()
        const hungerValues: number[] = []

        const subscription = feedLoop$(animal as Animal).subscribe((hunger) => {
            hungerValues.push(hunger)
        })
        animal.feed$!.next()
        animal.feed$!.next()
        animal.feed$!.next()
        animal.feed$!.next()
        animal.feed$!.next()
        animal.feed$!.next()

        subscription.unsubscribe()
        expect(hungerValues[hungerValues.length - 1]).toEqual(0)
    })
    it('should decrease hunger when feeding', async () => {
        const animal = createMockAnimal()
        const hungerValues: number[] = []

        const subscription = feedLoop$(animal as Animal).subscribe((hunger) => {
            hungerValues.push(hunger)
        })

        animal.feed$!.next()

        expect(hungerValues[hungerValues.length - 1]).toEqual(
            animal.initialHungerPercent! - BASE_REPLENISH
        )
        tick()
        subscription.unsubscribe()
        expect(hungerValues[hungerValues.length - 1]).toEqual(
            animal.initialHungerPercent! - BASE_REPLENISH + 0.5
        )
    })
})
