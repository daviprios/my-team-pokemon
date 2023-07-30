import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { PokemonTeamManager } from '../../models/PokemonTeamManager'

export interface AddPokemon {
  addPokemon: (pokemonTeamManager: PokemonTeamManager, team: string, pokemon: Pokemon) => void
}