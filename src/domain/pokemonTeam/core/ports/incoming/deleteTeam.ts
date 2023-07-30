import { PokemonTeamManager } from '../../models/PokemonTeamManager'

export interface DeleteTeam {
  deleteTeam: (pokemonTeamManager: PokemonTeamManager, teamName: string) => boolean
}