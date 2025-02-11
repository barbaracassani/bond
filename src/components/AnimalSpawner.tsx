import { ChangeEvent, FC, useState } from 'react'
import { Animal, Species } from '../types/animals.ts'
import AnimalCard from './AnimalCard.tsx'
import { createAnimal } from '../state/utilities.ts'

const AnimalSpawner: FC = () => {
    // todo remove partial
    const [animals, setAnimals] = useState<Partial<Animal>[]>([])

    const [species, setSpecies] = useState<Species | null>()
    const [name, setName] = useState<string>('')

    const addAnimal = () => {
        const newAnimal = createAnimal({ name, species } as Partial<Animal>)
        setAnimals((prev) => [...prev, newAnimal])
        setName('')
        setSpecies(null)
    }
    return (
        <div>
            <h1>Animal Manager</h1>I want to create a
            <select
                value={species || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setSpecies(e.target.value as Species)
                }}
            >
                <option value="">Choose species</option>
                <option value={Species.Appy}>{Species.Appy}</option>
                <option value={Species.Poodle}>{Species.Poodle}</option>
                <option value={Species.Bengali}>{Species.Bengali}</option>
            </select>
            called
            <input
                type="text"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value)
                }}
            />
            <button disabled={!species || !name} onClick={() => addAnimal()}>
                Add
            </button>
            <div className="animal-list">
                {animals.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                ))}
            </div>
        </div>
    )
}

export default AnimalSpawner
