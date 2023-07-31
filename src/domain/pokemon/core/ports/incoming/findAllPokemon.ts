import { PokemonBasicEntity } from '../../models/PokemonBasicEntity'

export interface FindAllPokemon {
  findAllPokemon: () => Promise<PokemonBasicEntity[]>
}