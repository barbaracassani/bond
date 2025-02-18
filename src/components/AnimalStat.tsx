import { FC } from 'react'
import { Animal, ReplenishAction } from '../types/animals'

const AnimalStat: FC<{
    animal: Animal
    parameter: number
    parameterName: string
    action: ReplenishAction
}> = ({ animal, parameter, parameterName, action }) => {
    return (
        <div className="stat">
            <strong>
                <span>{parameterName}:</span> {parameter.toFixed(2)}
            </strong>
            <div className="meter">
                <div
                    className={`meter-fill${parameter > 70 ? ' alarm' : ''}`}
                    style={{ width: `${parameter}%` }}
                ></div>
            </div>
            <button
                className="action-button"
                onClick={() => {
                    animal.makeReplenish(action)
                }}
            >
                Feed
            </button>
        </div>
    )
}
export default AnimalStat
