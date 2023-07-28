import {
	ChakraProvider,
	Box,
	Text,
	VStack,
	Grid,
	theme,
} from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher'

export function App() {
	return (
		<ChakraProvider theme={theme}>
			<Box textAlign="center" fontSize="xl">
				<Grid minH="100vh" p={3}>
					<ColorModeSwitcher justifySelf="flex-end" />
					<VStack spacing={8}>
						<Text>
							Pokemon
						</Text>
					</VStack>
				</Grid>
			</Box>
		</ChakraProvider>
	)
}
