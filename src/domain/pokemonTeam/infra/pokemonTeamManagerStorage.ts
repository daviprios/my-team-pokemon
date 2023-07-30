import { PokemonTeamManager } from '../core/models/PokemonTeamManager'
import { PokemonTeamStorage } from '../core/ports/outgoing/pokemonTeamStorage'

const storageKey = 'PTM'

export const pokemonTeamManagerStorage: PokemonTeamStorage = {
	store: (pokemonTeamManager: PokemonTeamManager) => {
		localStorage.setItem(storageKey, JSON.stringify(pokemonTeamManager))
		return new Promise(resolve => resolve(true))
	},
	load: (): Promise<PokemonTeamManager | undefined> => {
		return new Promise((resolve) => {
			const pokemonTeamManager = localStorage.getItem(storageKey)

			if(!pokemonTeamManager) return resolve(undefined)
			resolve(JSON.parse(pokemonTeamManager) as PokemonTeamManager)
		})
	}
}