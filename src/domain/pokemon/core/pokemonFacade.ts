import { Pokemon } from './models/Pokemon'
import { FindAllPokemon } from './ports/incoming/findAllPokemon'
import { FindManyPokemon } from './ports/incoming/findManyPokemon'
import { FindUniquePokemon } from './ports/incoming/findUniquePokemon'
import { PokemonHTTP } from './ports/outgoing/pokemonHTTP'

export const pokemonFacade = (pokemonHTTP: PokemonHTTP): FindManyPokemon & FindUniquePokemon & FindAllPokemon => ({
	findAllPokemon: async () => {
		return await pokemonHTTP.findManyPokemon({
			limit: 9999,
			offset: 0
		})
	},

	findManyPokemon: async (filter: {
    limit: number
    offset: number
  }) => {
		const pokemons = await pokemonHTTP.findManyPokemon(filter)
		return Promise.all(pokemons.map(async (pokemon): Promise<Pokemon> => {
			const pokemonData = await pokemonHTTP.findUniquePokemon(pokemon.name)
			return {
				id: pokemonData.id,
				name: pokemonData.name,
				sprite: pokemonData.sprite
			}
		}))
	},
	
	findUniquePokemon: async (nameOrId: string) => {
		return await pokemonHTTP.findUniquePokemon(nameOrId)
	}
})