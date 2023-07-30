import { PokemonTeamManager } from '../../models/PokemonTeamManager'

export interface StoreTeams {
  storeTeams: (pokemonTeamManager: PokemonTeamManager) => Promise<boolean>
}