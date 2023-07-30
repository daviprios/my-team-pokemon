import { pokemonTeamFacade } from '../core/pokemonTeamFacade'
import { pokemonTeamManagerStorage } from '../infra/pokemonTeamManagerStorage'

export const pokemonTeamHandler = pokemonTeamFacade(pokemonTeamManagerStorage)