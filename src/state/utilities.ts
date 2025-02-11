import { Animal } from '../types/animals.ts'

export const createAnimal = ({ name, species, id }: Partial<Animal>) => {
    return {
        name,
        species,
        id,
    }
}
