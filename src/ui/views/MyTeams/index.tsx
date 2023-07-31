import { useState } from 'react'
import { Box, Button, Center, Container, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, UnorderedList, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import { useForm } from 'react-hook-form'

import { useMainColor } from '@/ui/hooks/useMainColor'
import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { usePokemonManagerContext } from '@/ui/contexts/PokemonManagerContext'

export default function MyTeams() {
	const { register, getValues } = useForm<{ teamName: string }>()
	const { dispatch, state } = usePokemonManagerContext()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [selectedPokemon, setSelectedPokemon] = useState<{ pokemon: Pokemon, team: string }>({ pokemon: { id: '0', name: '', sprite: '' }, team: '' })
	
	const imageBgColor = useColorModeValue('gray.300', 'gray.600')
	const borderColor = useMainColor('text')
	const baseColor = useMainColor('color')

	return (
		<Container maxW={'2xl'} mt='4'>
			<Flex mb='4'>
				<Input { ...register('teamName') } mx='1' flexShrink={1} borderColor={borderColor} placeholder='Nome do time novo'/>
				<Button flexBasis={'350px'} borderWidth={1} borderColor={borderColor} onClick={() => dispatch({ type: 'createTeam', payload: { teamName: getValues().teamName } })}>
					<FaPlus style={{ marginRight: '2' }}/>
					Criar time
				</Button>
			</Flex>
			{Object.entries(state).length ? (
				<UnorderedList m='0'>
					{Object.values(state).map((pokemonTeam) => {
						return (
							<Box key={pokemonTeam.name} borderWidth={1} borderColor={borderColor} minH='28' mb='4' borderRadius={'md'}>
								<Flex h='10' alignItems={'center'} p='1.5' justifyContent={'space-between'}>
									<Text>{pokemonTeam.name}</Text>
									<Button h='full' borderWidth={1} borderColor={borderColor} onClick={() => dispatch({ type: 'deleteTeam', payload: { teamName: pokemonTeam.name } })}>Excluir</Button>
								</Flex>
								<Flex px='1' pb='1.5' justifyContent={'space-evenly'}>
									{pokemonTeam.pokemons.length
										?  pokemonTeam.pokemons.map((pokemon, index) => {
											return (
												<Image key={index} src={pokemon.sprite} boxSize={'16%'} title={pokemon.name} cursor={'pointer'} bgColor={imageBgColor} borderRadius={'lg'} onClick={() => {
													setSelectedPokemon({ pokemon, team: pokemonTeam.name })
													onOpen()
												}}/>
											)
										})
										: <Center w={'full'} h={'full'} textAlign={'center'}>
												Sem Pokemons aqui. Vá até a seção Pokemon para adicionar alguns.
										</Center>}
								</Flex>
							</Box>
						)
					})}
				</UnorderedList>
			) : <Center>Sem times. Crie seu primeiro time acima.</Center>}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{selectedPokemon.pokemon.id} - <Text as='span' display={'inline-block'} _firstLetter={{ textTransform: 'uppercase' }}>{selectedPokemon.pokemon.name}</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display={'flex'} justifyContent={'center'}>
						<Image w='full' src={selectedPokemon.pokemon.sprite}/>
					</ModalBody>
	
					<ModalFooter px={4}>
						<Flex justifyContent={'space-between'} w='full' flexShrink={1}>
							<Button flexBasis={'550px'} onClick={() => {
								dispatch({ type: 'removePokemon', payload: { pokemon: selectedPokemon.pokemon, teamName: selectedPokemon.team } })
								onClose()
							}}>
								Retirar <Text as='span' display={'inline-block'} _firstLetter={{ textTransform: 'uppercase' }} px='0.5ch' textColor={baseColor}>{selectedPokemon.pokemon.name}</Text> do time
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Container>
	)
}
