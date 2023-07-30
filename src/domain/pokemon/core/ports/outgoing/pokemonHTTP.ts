import { Pokemon } from '../../model/Pokemon'
import { PokemonBasicEntity } from '../../model/PokemonBasicEntity'

export interface PokemonHTTP {
  findUniquePokemon: (nameOrId: string) => Promise<Pokemon>
  findManyPokemon: (filter: { limit: number, page: number }) => Promise<PokemonBasicEntity[]>
}