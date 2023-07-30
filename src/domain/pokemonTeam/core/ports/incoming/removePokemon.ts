import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { PokemonTeamManager } from '../../models/PokemonTeamManager'

export interface RemovePokemon {
  removePokemon: (pokemonTeamManager: PokemonTeamManager, teamName: string, pokemon: Pokemon) => boolean
}