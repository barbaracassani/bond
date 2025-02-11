import { FC } from 'react'
import { Animal } from '../types/animals.ts'

// todo remove Partial
const AnimalCard: FC<{ animal: Partial<Animal> }> = ({
    animal: { name, species },
}) => {
    return (
        <div>
            {name} {species}
        </div>
    )
}

export default AnimalCard
