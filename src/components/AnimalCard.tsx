import { FC } from 'react'
import { bind } from '@react-rxjs/core'
import { Animal } from '../types/animals.ts'
import { feedLoop$, happinessLoop$, sleepLoop$ } from '../state/observables.ts'

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
