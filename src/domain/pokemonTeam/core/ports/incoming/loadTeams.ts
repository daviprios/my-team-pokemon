import { PokemonTeamManager } from '../../models/PokemonTeamManager'

export interface LoadTeams {
  loadTeams: () => Promise<PokemonTeamManager | undefined>
}