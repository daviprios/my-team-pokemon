import { Pokemon } from '../../models/Pokemon'

export interface FindUniquePokemon {
  findUniquePokemon: (nameOrId: string) => Promise<Pokemon>
}