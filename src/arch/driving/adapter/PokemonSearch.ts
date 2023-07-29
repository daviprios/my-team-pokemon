import { HTTP } from '../../driven/port/HTTP'
import { Pokemon } from '../../models/PokemonModel'
import { PokemonRepository } from '../port/PokemonRepository'

export const pokemonSearch = (http: HTTP, options?: { abortSignal?: AbortSignal }): PokemonRepository => ({
	findManyPokemon: async ({ limit, page, name }): Promise<Pokemon[]> => {
		const list = await http.get<{
      results: {
        name: string,
        url: string
      }[]
    }>(`https://pokeapi.co/api/v2/pokemon/${name}?offset=${(page - 1) * limit}&limit=${limit}`, { abortSignal: options?.abortSignal })
		const pokemons = Promise.all(list.results.map(async ({ url }) => {
			const { id, name, sprites: { front_default } } = await http.get<{
        id: string
        name: string
        sprites: {
          front_default: string
        }
      }>(url, { abortSignal: options?.abortSignal })
			return {
				id,
				name,
				sprite: front_default
			}
		}))
		return pokemons
	}
})