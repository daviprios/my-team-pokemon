import { Pokemon } from '../../models/Pokemon'
import { PokemonBasicEntity } from '../../models/PokemonBasicEntity'

export interface PokemonHTTP {
  findUniquePokemon: (nameOrId: string) => Promise<Pokemon>
  findManyPokemon: (filter: { limit: number, offset: number }) => Promise<PokemonBasicEntity[]>
}