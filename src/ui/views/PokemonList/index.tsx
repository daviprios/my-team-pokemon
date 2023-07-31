import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Center, Flex, Image, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text, UnorderedList, useDisclosure } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { useMainColor } from '@/ui/hooks/useMainColor'
import { pokemonHandler } from '@/domain/pokemon/app/pokemonHandler'
import { Pokemon } from '@/domain/pokemon/core/models/Pokemon'
import { usePokemonManagerContext } from '@/ui/contexts/PokemonManagerContext'
import { PokemonTeam } from '@/domain/pokemonTeam/core/models/PokemonTeam'
import { FaArrowUp } from 'react-icons/fa'

function PokemonCard({ pokemon, onClick }: { pokemon: Pokemon, onClick: () => void }) {
	const borderColor = useMainColor('text')

	return (
		<ListItem onClick={onClick} cursor={'pointer'}>
			<Flex w={'32'} h={'32'} flexDir={'column'} borderWidth={'1px'} borderColor={borderColor} alignItems={'center'} m='4' borderRadius={'md'}>
				<Text w='full' textAlign={'center'}>{pokemon.id} - <Text as='span' display={'inline-block'} _firstLetter={{ textTransform: 'uppercase' }}>{pokemon.name}</Text></Text>
				<Image boxSize='24' src={pokemon.sprite}/>
			</Flex>
		</ListItem>
	)
}

export default function PokemonList() {
	const [pokemonSearchList, setPokemonSearchList] = useState<Pokemon[]>([])
	const [singlePokemonSearch, setSinglePokemonSearch] = useState<Pokemon | null>(null)
	const [isLoading, setLoading] = useState(false)
	const baseSearchLimit = ((window.screen.width * window.screen.height) / (200 * 200))

	const pokemonListRef = useRef<HTMLUListElement>(null)

	const { isOpen, onOpen, onClose } = useDisclosure()
	const [selectedPokemon, setSelectedPokemon] = useState<Pokemon>({ id: '0', name: '', sprite: '' })

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
		
	const bgColor = useMainColor('bg')
	const borderColor = useMainColor('text')

	const [scrollPosition, setScrollPosition] = useState(0)
	const handleScroll = () => {
		const position = window.scrollY
		setScrollPosition(position)
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	async function searchSinglePokemon({ name }: { name: string }) {
		try {
			setLoading(true)
			return await pokemonHandler.findUniquePokemon(name)

		} catch(err) {
			console.log(err)
			setSinglePokemonSearch(null)

		} finally {
			setLoading(false)
		}
	}

	async function searchManyPokemon({ limit, offset }: { limit: number, offset: number }) {
		try {
			setLoading(true)
			return await pokemonHandler.findManyPokemon({ limit, offset })
			
		} catch(err) {
			console.log(err)
			setPokemonSearchList([])

		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => {
		searchManyPokemon({ limit: baseSearchLimit, offset: 0 })
			.then(pokemonList => setPokemonSearchList(list => [...list, ...(pokemonList ?? [])]))
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setPokemonTeams(Object.values(state))
	}, [state])

	useEffect(() => {
		let infiniteSearching = false

		function infiniteSearch() {
			if(isSearchingSinglePokemon || infiniteSearching || isLoading) return
			infiniteSearching = true
	
			const listBottom = pokemonListRef.current?.getBoundingClientRect().bottom
			const windowInnerHeight = window.innerHeight
	
			if(listBottom && Math.abs(windowInnerHeight - listBottom) < 10) {

				searchManyPokemon({ limit: baseSearchLimit, offset: pokemonSearchList.length })
					.then(pokemonList => {
						setPokemonSearchList(list => {
							return [...list, ...(pokemonList ?? [])]
						})
					})
					.finally(() => infiniteSearching = false)
			} else infiniteSearching = false
		}

		window.addEventListener('scroll', infiniteSearch)
		return(() => window.removeEventListener('scroll', infiniteSearch))
	}, [baseSearchLimit, isLoading, isSearchingSinglePokemon, pokemonSearchList.length])

	return (
		<Flex flexDir={'column'}>
			<Flex justifyContent={'center'} my='8' wrap={'wrap'} gap={'4'}>
				<Flex>
					<Flex mx='2'>
						<Input onChange={(e) => {
							const pokemonName = String(e.target.value).toLocaleLowerCase('en-US')
							if(pokemonAutocompleteListRef.current?.options.namedItem(pokemonName)) {
								searchSinglePokemon({ name: pokemonName }).then(pokemon => pokemon && setSinglePokemonSearch(pokemon))
								setIsSearchingSinglePokemon(true)
							} else if(isSearchingSinglePokemon) {
								setSinglePokemonSearch(null)
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
			</Flex>
			<Flex justifyContent={'center'}>
				{<UnorderedList listStyleType={'none'} display={'flex'} flexWrap={'wrap'} m='0' justifyContent={'center'} ref={pokemonListRef}>
					{(isSearchingSinglePokemon && singlePokemonSearch)
						? (
							<PokemonCard key={singlePokemonSearch.id} pokemon={singlePokemonSearch} onClick={() => {
								setSelectedPokemon(singlePokemonSearch)
								onOpen()
							}}/>
						)
						: (
							pokemonSearchList.map((pokemon) => {
								return (
									<PokemonCard key={pokemon.id} pokemon={pokemon} onClick={() => {
										setSelectedPokemon(pokemon)
										onOpen()
									}}/>
								)
							})
						)}
				</UnorderedList>}
				{scrollPosition > 500 && (
					<Box position='fixed' bottom='20px' right={['16px', '84px']} zIndex={1} onClick={() => window.scrollTo(0, 0)} borderRadius={'full'}
						borderWidth={1} borderColor={borderColor} bgColor={bgColor} textColor={borderColor} p='4' cursor={'pointer'}
					>
						<FaArrowUp/>
					</Box>
				)}
			</Flex>
			<Flex justifyContent={'center'}>
				{isLoading && <Center py='4'><Spinner /></Center>}
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
