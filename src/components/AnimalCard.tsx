import { FC } from 'react'
import { merge, Observable, tap, withLatestFrom } from 'rxjs'
import { scan, map, startWith } from 'rxjs/operators'
import { bind } from '@react-rxjs/core'
import { Animal } from '../types/animals.ts'
import {
    BASE_DECAY_PER_INTERVAL,
    BASE_REPLENISH,
    tick$,
} from '../state/observables.ts'

const calculateFeedDecay = (animal: Animal): number => {
    return (BASE_DECAY_PER_INTERVAL / 100) * animal.rates.hungerIncrease
}
const calculateRestDecay = (animal: Animal): number => {
    return (BASE_DECAY_PER_INTERVAL / 100) * animal.rates.sleepinessIncrease
}

const calculateHappinessDecay = (
    animal: Animal,
    hunger: number,
    sleep: number
): number => {
    const hungerFactor = hunger >= 70 ? 1.3 : 1
    const sleepFactor = sleep >= 70 ? 1.2 : 1

    return (
        (BASE_DECAY_PER_INTERVAL / 100) *
        animal.rates.happinessDecay *
        hungerFactor *
        sleepFactor
    )
}

const feedLoop$ = (animal: Animal): Observable<number> => {
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

const sleepLoop$ = (animal: Animal): Observable<number> => {
    return merge(
        tick$.pipe(map(() => calculateRestDecay(animal))),
        animal.sleep$.pipe(map(() => -BASE_REPLENISH))
    ).pipe(
        tap((a) => {
            console.info('sleep diff', a)
        }),
        scan(
            (level, change) => Math.min(100, Math.max(0, level + change)),
            animal.initialSleepinessPercent
        ),
        startWith(animal.initialSleepinessPercent)
    )
}

const happinessLoop$ = (animal: Animal): Observable<number> => {
    return merge(
        tick$.pipe(
            withLatestFrom(feedLoop$(animal), sleepLoop$(animal)),
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

const [useFeedLoop] = bind(feedLoop$, 0)
const [useSleepLoop] = bind(sleepLoop$, 0)
const [useHappinessLoop] = bind(happinessLoop$, 0)

const AnimalCard: FC<{
    animal: Animal
    removeHandler: () => void
}> = ({ animal, removeHandler }) => {
    const hunger = useFeedLoop(animal)
    const sleep = useSleepLoop(animal)
    const happiness = useHappinessLoop(animal)
    const { name, species } = animal
    return (
        <div>
            {name} {species}
            <button onClick={() => removeHandler()}>Remove</button>
            Current hunger: {hunger.toFixed(2)}
            Current sleepiness level: {sleep.toFixed(2)}
            Current happiness level: {happiness.toFixed(2)}
            <button onClick={animal.feed}>Feed</button>
            <button onClick={animal.rest}>Rest</button>
            <button onClick={animal.makeHappy}>Play</button>
        </div>
    )
}

export default AnimalCard
