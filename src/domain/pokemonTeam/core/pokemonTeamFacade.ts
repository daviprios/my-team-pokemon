import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { PokemonTeamManager } from './models/PokemonTeamManager'
import { PokemonTeam } from './models/PokemonTeam'

import { AddPokemon } from './ports/incoming/addPokemon'
import { CreatePokemonTeamManager } from './ports/incoming/createPokemonTeamManager'
import { CreateTeam } from './ports/incoming/createTeam'
import { DeleteTeam } from './ports/incoming/deleteTeam'
import { LoadTeams } from './ports/incoming/loadTeams'
import { RemovePokemon } from './ports/incoming/removePokemon'
import { StoreTeams } from './ports/incoming/storeTeams'

import { PokemonTeamStorage } from './ports/outgoing/pokemonTeamStorage'

export const pokemonTeamFacade = (pokemonTeamStorage: PokemonTeamStorage): AddPokemon & CreatePokemonTeamManager & CreateTeam & DeleteTeam & LoadTeams & RemovePokemon & StoreTeams => ({
	createPokemonTeamManager() {
		return {} as PokemonTeamManager
	},

	createTeam(pokemonTeamManager: PokemonTeamManager, name: string): PokemonTeam {
		const team: PokemonTeam = { name, pokemons: [] }
		if(pokemonTeamManager[name]) return pokemonTeamManager[name]
		pokemonTeamManager[name] = team
		return team
	},
  
	deleteTeam(pokemonTeamManager: PokemonTeamManager, teamName: string): boolean {
		delete pokemonTeamManager[teamName]
		return true
	},

	addPokemon(pokemonTeamManager: PokemonTeamManager, team: string, pokemon: Pokemon) {
		if(pokemonTeamManager[team].pokemons.length === 6) return
		pokemonTeamManager[team].pokemons.push(pokemon)
	},

	removePokemon(pokemonTeamManager: PokemonTeamManager, teamName: string, pokemon: Pokemon): boolean {
		const originalLength = pokemonTeamManager[teamName].pokemons.length
		pokemonTeamManager[teamName].pokemons.filter((storedPokemon: Pokemon) => storedPokemon !== pokemon)
		return originalLength !== pokemonTeamManager[teamName].pokemons.length
	},

	storeTeams(pokemonTeamManager: PokemonTeamManager): Promise<boolean> {
		return pokemonTeamStorage.store(pokemonTeamManager)
	},

	loadTeams(): Promise<PokemonTeamManager | undefined> {
		return pokemonTeamStorage.load()
	}
})