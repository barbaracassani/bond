import {Animal} from '../types/animals.ts';

export const createAnimal = ({name, species}: Partial<Animal>) => {
    return  {
        name,
        species
    }
}
