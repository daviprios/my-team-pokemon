import { Pokemon } from '../../model/Pokemon'

export interface FindUniquePokemon {
  findUniquePokemon: (nameOrId: string) => Promise<Pokemon>
}