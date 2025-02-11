import { FC } from 'react'
import { Animal } from '../types/animals.ts'

// todo remove Partial
const AnimalCard: FC<{
    animal: Partial<Animal>
    removeHandler: () => void
}> = ({ animal: { name, species }, removeHandler }) => {
    return (
        <div>
            {name} {species}
            <button onClick={() => removeHandler()}>Remove</button>
        </div>
    )
}

export default AnimalCard
