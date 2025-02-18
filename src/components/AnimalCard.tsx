import { FC } from 'react'
import { bind } from '@react-rxjs/core'
import { Animal, ReplenishAction } from '../types/animals.ts'
import { combinedLoop$ } from '../state/observables.ts'
import AnimalStat from './AnimalStat.tsx'

const [useAnimalState] = bind(combinedLoop$, {
    hunger: 0,
    sleep: 0,
    happiness: 0,
})

const AnimalCard: FC<{ animal: Animal; removeHandler: () => void }> = ({
    animal,
    removeHandler,
}) => {
    const { hunger, sleep, happiness } = useAnimalState(animal)
    const { name, species } = animal

    return (
        <div className="animal-container">
            <button className="remove-button" onClick={removeHandler}>
                x
            </button>

            <h1>{species}</h1>
            <div className="animal-animal">
                <img
                    src={`src/${species}.svg`}
                    alt="Your animal"
                    className="animal-image"
                />
                <h2>{name}</h2>
            </div>
            <div className="animal-stats">
                <AnimalStat
                    animal={animal}
                    parameter={hunger}
                    parameterName="Hunger"
                    action={ReplenishAction.feed}
                />
                <AnimalStat
                    animal={animal}
                    parameter={sleep}
                    parameterName="Sleep"
                    action={ReplenishAction.sleep}
                />
                <AnimalStat
                    animal={animal}
                    parameter={happiness}
                    parameterName="Happiness"
                    action={ReplenishAction.makeHappy}
                />
            </div>
        </div>
    )
}

export default AnimalCard
