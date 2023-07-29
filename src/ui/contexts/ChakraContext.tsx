import { ChakraProvider, type StyleFunctionProps, extendTheme } from '@chakra-ui/react'
import { chakraUseColor } from '@/ui/utils/chakraUseColor'

const theme = extendTheme({
	initialColorMode: 'dark',
	useSystemColorMode: false,
	colors: {
		main: {
			color: {
				dark: chakraUseColor('red.600'),
				light: chakraUseColor('red.500')
			},
			bg: {
				dark: chakraUseColor('gray.900'),
				light: chakraUseColor('gray.200')
			},
			text: {
				dark: chakraUseColor('gray.200'),
				light: chakraUseColor('gray.900')
			}
		}
	},
	styles: {
		global: ({ colorMode }: StyleFunctionProps) => ({
			'html, body': {
				color: colorMode === 'dark' ? chakraUseColor('main.text.dark') : chakraUseColor('main.text.light'),
				bg: colorMode === 'dark' ? chakraUseColor('main.bg.dark') : chakraUseColor('main.bg.light')
			},
		})
	}
})

export function ChakraContext({
	children
}: {
  children: React.ReactNode
}) {
	return (
		<ChakraProvider theme={theme}>
			{children}
		</ChakraProvider>
	)
}
