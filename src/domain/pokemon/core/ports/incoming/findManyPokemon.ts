import { Pokemon } from '../../model/Pokemon'

export interface FindManyPokemon {
  findManyPokemon: (filter: { limit: number, page: number }) => Promise<Pokemon[]>
}