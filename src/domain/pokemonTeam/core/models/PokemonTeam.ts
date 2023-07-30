import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'

export interface PokemonTeam {
  name: string
  pokemons: Pokemon[]
}