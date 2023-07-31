import { useEffect, useState } from 'react'
import { Button, Flex, Image, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text, UnorderedList, useDisclosure } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
import { useMainColor } from '@/ui/hooks/useMainColor'
import { pokemonHandler } from '@/domain/pokemon/app/pokemonHandler'
import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { usePokemonManagerContext } from '@/ui/contexts/PokemonManagerContext'

interface FilterForm {
	page: number
	limit: number
	name: string
}

export default function PokemonList() {
	const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
	const [isLoading, setLoading] = useState(false)
	const { register, handleSubmit, getValues, setValue } = useForm<FilterForm>({
		values: {
			page: 1,
			limit: 10,
			name: ''
		}
	})
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>({ id: '0', name: '', sprite: '' })
	const borderColor = useMainColor('text')
	const { state, dispatch } = usePokemonManagerContext()
	const { register: registerTeam, getValues: getValuesTeam } = useForm<{ team: string }>()

	async function search({ limit, page, name }: FilterForm) {
		try {
			setLoading(true)

			name
				? setPokemonList([await pokemonHandler.findUniquePokemon(name.toLocaleLowerCase('en-US'))])
				: setPokemonList(await pokemonHandler.findManyPokemon({ limit, page }))

		} catch(err) {
			console.log(err)
			setPokemonList([])

		} finally {
			setLoading(false)
		}
	}

	function setPage(page: number) {
		setValue('page', page)
		search({ limit: getValues().limit, name: getValues().name, page: getValues().page })
	}

	useEffect(() => {
		search({ limit: getValues().limit, name: getValues().name, page: getValues().page })
	}, [])

	return (
		<Flex flexDir={'column'}>
			<form onSubmit={handleSubmit(search)}>
				<Flex justifyContent={'center'} my='8' wrap={'wrap'} gap={'4'}>
					<Flex>
						<Flex mr='4'>
							<Input {...register('name')} placeholder='Procurando alguem?' borderColor={borderColor}/>
						</Flex>
					</Flex>
					<Flex>
						<Flex alignItems={'baseline'} mr='4'>
							<Button px='0' borderWidth={1} borderColor={borderColor} disabled={isLoading} onClick={() => getValues().page > 1 && setPage(getValues().page - 1)}>
								<AiFillCaretLeft/>
							</Button>
							<Text h='full' px='3'>
								{getValues().page}
							</Text>
							<Button px='0' borderWidth={1} borderColor={borderColor} disabled={isLoading} onClick={() => setPage(getValues().page + 1)}>
								<AiFillCaretRight/>
							</Button>
						</Flex>
						<Flex>
							<Select {...register('limit')} borderColor={borderColor}>
								<option value={10}>10</option>
								<option value={20}>20</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</Select>
						</Flex>
					</Flex>
					<Flex ml='4'>
						<Button type='submit' borderWidth={1} borderColor={borderColor}>
							Procurar
						</Button>
					</Flex>
				</Flex>
			</form>
			<Flex justifyContent={'center'}>
				{isLoading ? <Spinner /> : pokemonList.length ?
					<UnorderedList listStyleType={'none'} display={'flex'} flexWrap={'wrap'} m='0' justifyContent={'center'}>
						{pokemonList.map((pokemon) => {
							return (
								<ListItem key={pokemon.id} onClick={() => {
									setSelectedPokemon(pokemon)
									onOpen()
								}} cursor={'pointer'}>
									<Flex w={'32'} h={'32'} flexDir={'column'} borderWidth={'1px'} borderColor={borderColor} alignItems={'center'} m='4' borderRadius={'md'}>
										<Text w='full' textAlign={'center'}>{pokemon.id} - <Text as='span' display={'inline-block'} _firstLetter={{ textTransform: 'uppercase' }}>{pokemon.name}</Text></Text>
										<Image boxSize='24' src={pokemon.sprite}/>
									</Flex>
								</ListItem>
							)
						})}
					</UnorderedList>
					: <Flex><Text>Nenhum Pokemon encontrado</Text></Flex>}
			</Flex>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{selectedPokemon.id} - <Text as='span' display={'inline-block'} _firstLetter={{ textTransform: 'uppercase' }}>{selectedPokemon.name}</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display={'flex'} justifyContent={'center'}>
						<Image w='full' src={selectedPokemon.sprite}/>
					</ModalBody>
	
					<ModalFooter px={4}>
						<Flex justifyContent={'space-between'} w='full' flexShrink={1}>
							<Select { ...registerTeam('team') } mr='2'>
								{Object.values(state).map((pokemonTeam) => (
									<option key={pokemonTeam.name} value={pokemonTeam.name} disabled={pokemonTeam.pokemons.length >= 6}>
										{pokemonTeam.name}
									</option>
								))}
							</Select>
							<Button flexBasis={'550px'} onClick={() => {
								dispatch({ type: 'addPokemon', payload: { pokemon: selectedPokemon, teamName: getValuesTeam().team } })
								onClose()
							}} disabled={Object.values(state).every((pokemonTeam) => pokemonTeam.pokemons.length >= 6)}>
								Adicionar {selectedPokemon.name} ao time
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	)
}
