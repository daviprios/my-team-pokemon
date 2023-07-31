import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Flex, Image, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text, UnorderedList, useDisclosure } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
import { useMainColor } from '@/ui/hooks/useMainColor'
import { pokemonHandler } from '@/domain/pokemon/app/pokemonHandler'
import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { usePokemonManagerContext } from '@/ui/contexts/PokemonManagerContext'
import { PokemonTeam } from '@/domain/pokemonTeam/core/models/PokemonTeam'

interface FilterForm {
	page: number
	limit: number
	name?: string
}

export default function PokemonList() {
	const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
	const [isLoading, setLoading] = useState(false)
	const { register, getValues, setValue } = useForm<FilterForm>({
		values: {
			page: 1,
			limit: 10
		}
	})
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>({ id: '0', name: '', sprite: '' })
	const borderColor = useMainColor('text')
	const { state, dispatch } = usePokemonManagerContext()
	const { register: registerTeam, getValues: getValuesTeam, setValue: setValuesTeam } = useForm<{ team: string }>()
	const pokemonAutocompleteListRef = useRef<HTMLDataListElement>(null)
	const [isSearchingSinglePokemon, setIsSearchingSinglePokemon] = useState(false)
	const [pokemonAutocompleteList, setPokemonAutocompleteList] = useState<string[]>([])
	useMemo(async () => (
		setPokemonAutocompleteList((await pokemonHandler.findAllPokemon()).map(({ name }) => name))
	), [])
	const [pokemonTeams, setPokemonTeams] = useState<PokemonTeam[]>([])
	const isNoneTeamAvailable = pokemonTeams.every((pokemonTeam) => pokemonTeam.pokemons.length >= 6)

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

	const basicSearch = () => search({ limit: getValues().limit, page: getValues().page })

	useEffect(() => {
		basicSearch()
	}, [])

	useEffect(() => {
		setPokemonTeams(Object.values(state))
	}, [state])

	return (
		<Flex flexDir={'column'}>
			<Flex justifyContent={'center'} my='8' wrap={'wrap'} gap={'4'}>
				<Flex>
					<Flex mx='2'>
						<Input onChange={(e) => {
							if(pokemonAutocompleteListRef.current?.options.namedItem(e.target.value)) {
								search({ limit: 1, name: e.target.value, page: 1 })
								setValue('page', 1)
								setIsSearchingSinglePokemon(true)
							} else if(isSearchingSinglePokemon) {
								basicSearch()
								setIsSearchingSinglePokemon(false)
							}
						}} placeholder='Procurando alguem?' borderColor={borderColor} list={'pokemonList'}/>
						<datalist id='pokemonList' ref={pokemonAutocompleteListRef}>
							{pokemonAutocompleteList.map((pokemonName: string) => (
								<option key={pokemonName} id={pokemonName} value={pokemonName}/>
							))}
						</datalist>
					</Flex>
				</Flex>
				<Flex>
					<Flex alignItems={'baseline'} mr='4'>
						<Button px='0' borderWidth={1} borderColor={borderColor} disabled={isLoading} onClick={() => {
							getValues().page > 1 && setValue('page', getValues().page - 1)
							basicSearch()
						}}>
							<AiFillCaretLeft/>
						</Button>
						<Text h='full' px='3'>
							{getValues().page}
						</Text>
						<Button px='0' borderWidth={1} borderColor={borderColor} disabled={isLoading} onClick={() => {
							setValue('page', getValues().page + 1)
							basicSearch()
						}}>
							<AiFillCaretRight/>
						</Button>
					</Flex>
					<Flex>
						<Select {...register('limit')} onChange={(e) => {
							search({ limit: Number(e.target.value), page: getValues().page })
						}} borderColor={borderColor}>
							<option value={10}>10</option>
							<option value={20}>20</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
						</Select>
					</Flex>
				</Flex>
			</Flex>
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
							<Select { ...registerTeam('team') } mr='2' isDisabled={isNoneTeamAvailable}>
								<option value={''} disabled={true}>
									-
								</option>
								{pokemonTeams.map((pokemonTeam) => (
									<option key={pokemonTeam.name} value={pokemonTeam.name} disabled={pokemonTeam.pokemons.length >= 6}>
										{pokemonTeam.name}
									</option>
								))}
							</Select>
							<Button flexBasis={'550px'} onClick={() => {
								if(!getValuesTeam().team) return
								dispatch({ type: 'addPokemon', payload: { pokemon: selectedPokemon, teamName: getValuesTeam().team } })
								setValuesTeam('team', '')
								onClose()
							}} isDisabled={isNoneTeamAvailable}>
								{isNoneTeamAvailable ? 'Nenhum time livre' : `Adicionar ${selectedPokemon.name} ao time`}
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	)
}
