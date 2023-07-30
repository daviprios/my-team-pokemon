import { useEffect, useState } from 'react'
import { Button, Flex, Image, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Text, UnorderedList, useDisclosure } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import type { Pokemon } from '@/arch/models/PokemonModel'
import { fetchHTTP } from '@/arch/driven/adapter/fetchHTTP'
import { pokemonSearch } from '@/arch/driving/adapter/PokemonSearch'
import { pokemonService } from '@/arch/services/PokemonService'
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai'
import { useMainColor } from '@/ui/hooks/useMainColor'

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
	const [currentPokemon, setCurrentPokemon] = useState<Pokemon>({ id: '0', name: '', sprite: '' })
	const borderColor = useMainColor('text')

	function search({ limit, name, page }: FilterForm) {
		setLoading(true)
		pokemonService(pokemonSearch(fetchHTTP))
			.findManyPokemon({ limit, page, name })
			.then(res => setPokemonList(res))
			.finally(() => setLoading(false))
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
							<Input {...register('name')} borderColor={borderColor}/>
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
									setCurrentPokemon(pokemon)
									onOpen()
								}} cursor={'pointer'}>
									<Flex w={'32'} h={'32'} flexDir={'column'} borderWidth={'1px'} borderColor={borderColor} alignItems={'center'} m='4'>
										<Text w='full' textAlign={'center'}>({pokemon.id}) {pokemon.name}</Text>
										<Image h='24' w={'24'} src={pokemon.sprite}/>
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
						({currentPokemon.id}) {currentPokemon.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display={'flex'} justifyContent={'center'}>
						<Image w='full' src={currentPokemon.sprite}/>
					</ModalBody>
	
					<ModalFooter>
						<Button onClick={onClose}>
							Adicionar {currentPokemon.name} ao time
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	)
}
