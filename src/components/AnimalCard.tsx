import { FC } from 'react'
import { merge } from 'rxjs'
import { scan, map, startWith } from 'rxjs/operators'
import { createSignal } from '@react-rxjs/utils'
import { bind } from '@react-rxjs/core'
import { Animal } from '../types/animals.ts'
import { tick$ } from '../state/observables.ts'

const [feed$, feed] = createSignal()

const feedLoop$ = (initial: number) => {
    return merge(tick$.pipe(map(() => 5)), feed$.pipe(map(() => -15))).pipe(
        scan((level, change) => Math.max(0, level + change), initial),
        startWith(initial)
    )
}

const [useFeedLoop] = bind(feedLoop$, 0)

const AnimalCard: FC<{
    animal: Partial<Animal>
    removeHandler: () => void
}> = ({
    animal: {
        name,
        species,
        hungerPercent,
        happinessPercent,
        sleepinessPercent,
    },
    removeHandler,
}) => {
    const hunger = useFeedLoop(hungerPercent ?? 50)

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
