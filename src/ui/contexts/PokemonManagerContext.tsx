import { createContext, useContext, useEffect, useReducer } from 'react'

import { PokemonTeamManager } from '@/domain/pokemonTeam/core/models/PokemonTeamManager'
import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { pokemonTeamHandler } from '@/domain/pokemonTeam/app/pokemonTeamHandler'

type Action = {
	type: 'startup',
	payload: PokemonTeamManager
} | {
	type: 'createTeam',
	payload: { teamName: string }
} | {
	type: 'deleteTeam',
	payload: { teamName: string }
} | {
	type: 'addPokemon',
	payload: { teamName: string, pokemon: Pokemon }
} | {
	type: 'removePokemon',
	payload: { teamName: string, pokemon: Pokemon }
}

function reducer(state: PokemonTeamManager, action: Action): PokemonTeamManager {
	switch(action.type) {
	case 'startup':
		pokemonTeamHandler.storeTeams(action.payload)
		return action.payload
	case 'createTeam':
		if(!action.payload.teamName) return state
		pokemonTeamHandler.createTeam(state, action.payload.teamName)
		pokemonTeamHandler.storeTeams(state)
		return structuredClone(state)
	case 'deleteTeam':
		pokemonTeamHandler.deleteTeam(state, action.payload.teamName)
		pokemonTeamHandler.storeTeams(state)
		return structuredClone(state)
	case 'addPokemon':
		pokemonTeamHandler.addPokemon(state, action.payload.teamName, action.payload.pokemon)
		pokemonTeamHandler.storeTeams(state)
		return structuredClone(state)
	case 'removePokemon':
		pokemonTeamHandler.removePokemon(state, action.payload.teamName, action.payload.pokemon)
		pokemonTeamHandler.storeTeams(state)
		return structuredClone(state)
	default:
		return state
	}
}

const pokemonManagerContext = createContext<{
  state: PokemonTeamManager
  dispatch: React.Dispatch<Action>
}>({
	state: {},
	dispatch: () => {}
})

export const usePokemonManagerContext = () => useContext(pokemonManagerContext)

export default function PokemonManagerContext({
	children
}: {
  children: React.ReactNode
}) {
	const [state, dispatch] = useReducer<React.Reducer<PokemonTeamManager, Action>>(reducer, {})

	useEffect(() => {
		pokemonTeamHandler.loadTeams()
			.then((pokemonHandler) => {
				dispatch({
					type: 'startup',
					payload: pokemonHandler ?? pokemonTeamHandler.createPokemonTeamManager()
				})
			})
	}, [])

	return (
		<pokemonManagerContext.Provider value={{ state, dispatch }}>
			{children}
		</pokemonManagerContext.Provider>
	)
}