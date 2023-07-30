import { PokemonTeamManager } from '../../models/PokemonTeamManager'

export interface PokemonTeamStorage {
  store: (pokemonTeamManager: PokemonTeamManager) => Promise<boolean>
  load: () => Promise<PokemonTeamManager | undefined>
}