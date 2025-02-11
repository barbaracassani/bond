import { ChangeEvent, FC, useState } from 'react'
import { Animal, Species } from '../types/animals.ts'
import AnimalCard from './AnimalCard.tsx'
import { createAnimal } from '../state/utilities.ts'

import { v4 as uuid } from 'uuid'

const AnimalSpawner: FC = () => {
    const [animals, setAnimals] = useState<Animal[]>([])

    const [species, setSpecies] = useState<Species | null>()
    const [name, setName] = useState<string>('')

    const addAnimal = () => {
        const newAnimal = createAnimal({
            name,
            species,
            id: uuid(),
        } as Pick<Animal, 'name' | 'id' | 'species'>)
        setAnimals((prev) => [...prev, newAnimal])
        setName('')
        setSpecies(null)
    }

    const removeAnimal = (id: string) => {
        setAnimals((prevState) => {
            return prevState.filter((a) => a.id !== id)
        })
    }

    return (
        <div>
            <div className="animal-spawner">
                <h1>Animal Manager</h1>
                <div className="create-animal">
                    I want to create a
                    <select
                        value={species || ''}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            setSpecies(e.target.value as Species)
                        }}
                    >
                        <option value="">Choose species</option>
                        <option value={Species.Appy}>{Species.Appy}</option>
                        <option value={Species.Poodle}>{Species.Poodle}</option>
                        <option value={Species.Bengali}>
                            {Species.Bengali}
                        </option>
                    </select>
                    called
                    <input
                        type="text"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setName(e.target.value)
                        }}
                    />
                    <button
                        disabled={!species || !name}
                        onClick={() => addAnimal()}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="animal-list">
                {animals.map((animal) => (
                    <AnimalCard
                        removeHandler={() => {
                            removeAnimal(animal.id!)
                        }}
                        key={animal.id}
                        animal={animal}
                    />
                ))}
            </div>
        </div>
    )
}

export default AnimalSpawner
