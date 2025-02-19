import { FC } from 'react'
import { Animal, ReplenishAction } from '../types/animals'

const AnimalStat: FC<{
    animal: Animal
    actionLabel: string
    parameter: number
    parameterName: string
    action: ReplenishAction
}> = ({ animal, actionLabel, parameter, parameterName, action }) => {
    return (
        <div className="stat">
            <strong>
                <span>{parameterName}:</span> {parameter.toFixed(2)}
            </strong>
            <div
                className={
                    action === ReplenishAction.makeHappy
                        ? `meter happiness${parameter < 10 ? ' alarm' : ''}`
                        : 'meter'
                }
            >
                <div
                    className={
                        action === ReplenishAction.makeHappy
                            ? 'meter-fill'
                            : `meter-fill${parameter > 70 ? ' alarm' : ''}`
                    }
                    style={{ width: `${parameter}%` }}
                ></div>
            </div>
            <button
                className="action-button"
                onClick={() => {
                    animal.makeReplenish(action)
                }}
            >
                {actionLabel}
            </button>
        </div>
    )
}
export default AnimalStat
