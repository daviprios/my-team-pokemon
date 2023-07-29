import { Link as RouterLink } from 'react-router-dom'
import { Center, Link, Text } from '@chakra-ui/react'

export default function NotFound() {
	return (
		<Center width={'100vw'} height={'100vh'}>
			<Text>
        Não há Pokemons aqui. Que tal <Link as={RouterLink} to='/' textDecor={'underline'}>voltarmos ao início?</Link>
			</Text>
		</Center>
	)
}