import { FC } from 'react'
import { bind } from '@react-rxjs/core'
import { Animal } from '../types/animals.ts'
import { combinedLoop$ } from '../state/observables.ts'

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
                <div className="stat">
                    <strong>
                        <span>Hunger:</span> {hunger.toFixed(2)}
                    </strong>
                    <div className="meter">
                        <div
                            className={`meter-fill${hunger > 70 ? ' alarm' : ''}`}
                            style={{ width: `${hunger}%` }}
                        ></div>
                    </div>
                    <button className="action-button" onClick={animal.feed}>
                        Feed
                    </button>
                </div>
                <div className="stat">
                    <strong>
                        <span>Happiness:</span> {happiness.toFixed(2)}
                    </strong>
                    <div
                        className={`meter happiness${happiness < 10 ? ' alarm' : ''}`}
                    >
                        <div
                            className="meter-fill"
                            style={{ width: `${happiness}%` }}
                        ></div>
                    </div>
                    <button
                        className="action-button"
                        onClick={animal.makeHappy}
                    >
                        Play
                    </button>
                </div>
                <div className="stat">
                    <strong>
                        <span>Sleep:</span> {sleep.toFixed(2)}
                    </strong>
                    <div className="meter">
                        <div
                            className={`meter-fill${sleep > 70 ? ' alarm' : ''}`}
                            style={{ width: `${sleep}%` }}
                        ></div>
                    </div>
                    <button className="action-button" onClick={animal.rest}>
                        Rest
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AnimalCard
