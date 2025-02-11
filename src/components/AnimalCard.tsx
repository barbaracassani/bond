import { FC } from 'react'
import { merge } from 'rxjs'
import { scan, map, startWith } from 'rxjs/operators'
import { createSignal } from '@react-rxjs/utils'
import { bind } from '@react-rxjs/core'
import { Animal } from '../types/animals.ts'
import {
    BASE_DECAY_PER_INTERVAL,
    BASE_REPLENISH,
    tick$,
} from '../state/observables.ts'

const [feed$, feed] = createSignal()

const feedLoop$ = (animal: Animal) => {
    return merge(
        tick$.pipe(map(() => BASE_DECAY_PER_INTERVAL)),
        feed$.pipe(map(() => -BASE_REPLENISH))
    ).pipe(
        scan(
            (level, change) => Math.max(0, level + change),
            animal.initialHungerPercent
        ),
        startWith(animal.initialHungerPercent)
    )
}

const [useFeedLoop] = bind(feedLoop$, 0)

const AnimalCard: FC<{
    animal: Animal
    removeHandler: () => void
}> = ({ animal, removeHandler }) => {
    const hunger = useFeedLoop(animal)
    const { name, species } = animal
    return (
        <div>
            {name} {species}
            <button onClick={() => removeHandler()}>Remove</button>
            Current hunger: {hunger}
            <button onClick={feed}>Feed</button>
        </div>
    )
}

export default AnimalCard
