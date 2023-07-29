import { Pokemon } from '../models/PokemonModel'
import { PokemonRepository } from '../driving/port/PokemonRepository'

export interface PokemonService {
  findManyPokemon: (filter: { page: number, limit: number, name: string }) => Promise<Pokemon[]>
}

export const pokemonService = (pokemonRepository: PokemonRepository): PokemonService => ({
	findManyPokemon: async ({ page, limit, name }): Promise<Pokemon[]> => {
		return await pokemonRepository.findManyPokemon({ page, limit, name })
	}
})