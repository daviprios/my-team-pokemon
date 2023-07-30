import { PokemonTeam } from '../../models/PokemonTeam'
import { PokemonTeamManager } from '../../models/PokemonTeamManager'

export interface CreateTeam {
  createTeam: (pokemonTeamManager: PokemonTeamManager, name: string) => PokemonTeam
}