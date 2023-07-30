import { Pokemon } from '../../models/Pokemon'

export interface FindManyPokemon {
  findManyPokemon: (filter: { limit: number, page: number }) => Promise<Pokemon[]>
}