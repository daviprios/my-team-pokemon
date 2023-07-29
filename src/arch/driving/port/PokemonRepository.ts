import { Pokemon } from '../../models/PokemonModel'

export interface PokemonRepository {
  findManyPokemon: (filter: { page: number, limit: number, name: string }) => Promise<Pokemon[]>
}