import { describe, expect, it } from 'vitest'

import { BASE_DECAY_PER_INTERVAL } from './observables.ts'
import { Animal, Rates, Species } from '../types/animals'
import {
    calculateFeedDecay,
    calculateRestDecay,
    calculateHappinessDecay,
} from './calculations.ts'

const createMockAnimal = ({
    sleepinessIncrease,
    hungerIncrease,
    happinessDecay,
    acceleratedDecayFactor,
}: Partial<Rates>): Partial<Animal> => ({
    id: '1',
    name: 'TestAnimal',
    species: Species.Appy,
    initialHungerPercent: 50,
    initialSleepinessPercent: 50,
    initialHappinessPercent: 50,
    rates: {
        hungerIncrease: hungerIncrease ?? 1,
        sleepinessIncrease: sleepinessIncrease ?? 1,
        happinessDecay: happinessDecay ?? 1,
        acceleratedDecayFactor: acceleratedDecayFactor ?? 1,
    },
})

describe('#calculateRestDecay', () => {
    it('should correctly calculate rest decay based on sleepinessIncrease', () => {
        const animal = createMockAnimal({ sleepinessIncrease: 2 })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 2
        expect(calculateRestDecay(animal as Animal)).toBe(expectedDecay)
    })

    it('should correctly calculate a floating point decay', () => {
        const animal = createMockAnimal({ sleepinessIncrease: 5.5 })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 5.5
        expect(calculateRestDecay(animal as Animal)).toBe(expectedDecay)
    })

    it('should return 0 decay if sleepinessIncrease is 0', () => {
        const animal = createMockAnimal({ sleepinessIncrease: 0 })
        expect(calculateRestDecay(animal as Animal)).toBe(0)
    })

    it('should return a larger decay when sleepinessIncrease is high', () => {
        const animalLow = createMockAnimal({ sleepinessIncrease: 1 })
        const animalHigh = createMockAnimal({ sleepinessIncrease: 5 })

        expect(calculateRestDecay(animalHigh as Animal)).toBeGreaterThan(
            calculateRestDecay(animalLow as Animal)
        )
    })
})

describe('#calculateFeedDecay', () => {
    it('should correctly calculate feed decay based on hungerIncrease', () => {
        const animal = createMockAnimal({ hungerIncrease: 3 })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 3
        expect(calculateFeedDecay(animal as Animal)).toBe(expectedDecay)
    })

    it('should correctly calculate a floating point decay', () => {
        const animal = createMockAnimal({ hungerIncrease: 3.75 })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 3.75
        expect(calculateFeedDecay(animal as Animal)).toBe(expectedDecay)
    })

    it('should return 0 decay if hungerIncrease is 0', () => {
        const animal = createMockAnimal({ hungerIncrease: 0 })
        expect(calculateFeedDecay(animal as Animal)).toBe(0)
    })

    it('should return a larger decay when hungerIncrease is high', () => {
        const animalLow = createMockAnimal({ hungerIncrease: 3 })
        const animalHigh = createMockAnimal({ hungerIncrease: 5 })

        expect(calculateFeedDecay(animalHigh as Animal)).toBeGreaterThan(
            calculateFeedDecay(animalLow as Animal)
        )
    })
})

describe('#calculateHappinessDecay', () => {
    it('should correctly calculate happinessDecay based on happinessDecay - 1', () => {
        const animal = createMockAnimal({ happinessDecay: 1 })
        const expectedDecay = BASE_DECAY_PER_INTERVAL / 100
        expect(calculateHappinessDecay(animal as Animal, 1, 1)).toBe(
            expectedDecay
        )
    })
    it('should correctly calculate happinessDecay based on happinessDecay - 2', () => {
        const animal = createMockAnimal({ happinessDecay: 2 })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 2
        expect(calculateHappinessDecay(animal as Animal, 1, 1)).toBe(
            expectedDecay
        )
    })
    it('should be compounded by hunger', () => {
        const animal = createMockAnimal({
            happinessDecay: 50,
            acceleratedDecayFactor: 2,
        })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 50 * 2
        expect(calculateHappinessDecay(animal as Animal, 100, 1)).toBe(
            expectedDecay
        )
    })
    it('should be compounded by sleep', () => {
        const animal = createMockAnimal({
            happinessDecay: 50,
            acceleratedDecayFactor: 2,
        })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 50 * 2
        expect(calculateHappinessDecay(animal as Animal, 1, 100)).toBe(
            expectedDecay
        )
    })
    it('should be compounded by sleep and hunger together', () => {
        const animal = createMockAnimal({
            happinessDecay: 50,
            acceleratedDecayFactor: 2,
        })
        const expectedDecay = (BASE_DECAY_PER_INTERVAL / 100) * 50 * 4
        expect(calculateHappinessDecay(animal as Animal, 100, 100)).toBe(
            expectedDecay
        )
    })
    it('should differentiate for different happiness decay', () => {
        const animalLow = createMockAnimal({
            happinessDecay: 1,
            acceleratedDecayFactor: 2,
        })
        const animalHigh = createMockAnimal({
            happinessDecay: 4,
            acceleratedDecayFactor: 2,
        })
        expect(
            calculateHappinessDecay(animalLow as Animal, 100, 100)
        ).toBeLessThan(calculateHappinessDecay(animalHigh as Animal, 100, 100))
    })
})
