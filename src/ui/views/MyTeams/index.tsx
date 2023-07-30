import { Box, Button, Center, Flex, Image, Input, Text, UnorderedList } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import { useForm } from 'react-hook-form'
import { useMainColor } from '@/ui/hooks/useMainColor'
import { usePokemonManagerContext } from '@/ui/contexts/PokemonManagerContext'

export default function MyTeams() {
	const { register, getValues } = useForm<{ teamName: string }>()
	const { dispatch, state } = usePokemonManagerContext()

	const borderColor = useMainColor('text')

	return (
		<Flex flexDirection={'column'} p='2'>
			<Flex mb='4'>
				<Input { ...register('teamName') } mx='1' flexShrink={1}/>
				<Button flexBasis={'350px'} onClick={() => dispatch({ type: 'createTeam', payload: { teamName: getValues().teamName } })}>
					<FaPlus style={{ marginRight: '2' }}/>
					Criar um novo time
				</Button>
			</Flex>
			{Object.entries(state).length ? (
				<UnorderedList m='0'>
					{Object.values(state).map((pokemonTeam) => {
						return (
							<Box key={pokemonTeam.name} borderWidth={1} borderColor={borderColor} minH='28' mb='4'>
								<Flex h='10' alignItems={'center'} p='1.5' justifyContent={'space-between'}>
									<Text>{pokemonTeam.name}</Text>
									<Button h='full' onClick={() => dispatch({ type: 'deleteTeam', payload: { teamName: pokemonTeam.name } })}>Excluir</Button>
								</Flex>
								<Flex>
									{pokemonTeam.pokemons.map((pokemon) => {
										return (
											<Image key={pokemon.id} src={pokemon.sprite} boxSize={'16%'}/>
										)
									})}
								</Flex>
							</Box>
						)
					})}
				</UnorderedList>
			) : <Center>Sem times. Crie seu primeiro time acima.</Center>}
		</Flex>
	)
}
