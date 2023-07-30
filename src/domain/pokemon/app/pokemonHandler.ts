import { pokemonFacade } from '../core/pokemonFacade'
import { pokemonFetchAdapter } from '../infra/pokemonFetchAdapter'

export const pokemonHandler = pokemonFacade(pokemonFetchAdapter)