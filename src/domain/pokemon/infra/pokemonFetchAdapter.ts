import { pokemonAPIEndpoint } from '@/utils/pokemonAPIEndpoint'
import { PokemonHTTP } from '../core/ports/outgoing/pokemonHTTP'
import { Pokemon } from '../core/models/Pokemon'
import { PokemonEntityList } from './entities'
import { PokemonBasicEntity } from '../core/models/PokemonBasicEntity'
import { PokemonEntity } from '../core/models/PokemonEntity'

export const pokemonFetchAdapter: PokemonHTTP = {
	findManyPokemon: async ({
		limit,
		page
	}: {
		limit: number
		page: number
	}): Promise<PokemonBasicEntity[]> => {
		const res = await fetch(`${pokemonAPIEndpoint}/pokemon?offset=${(page - 1) * limit}&limit=${limit}`)
		const pokemonList = await res.json() as PokemonEntityList
		return pokemonList.results.map((pokemon) => ({
			name: pokemon.name,
			url: pokemon.url
		}))
	},

	findUniquePokemon: async (nameOrId: string): Promise<Pokemon> => {
		const res = await fetch(`${pokemonAPIEndpoint}/pokemon/${nameOrId}`)
		const pokemon = await res.json() as PokemonEntity

		return {
			id: pokemon.id,
			name: pokemon.name,
			sprite: pokemon.sprites.front_default
		}
	}
}