import { Pokemon } from '../../models/Pokemon'

export interface FindManyPokemon {
  findManyPokemon: (filter: { limit: number, offset: number }) => Promise<Pokemon[]>
}