import { useColorMode } from '@chakra-ui/react'

export function useMainColor(color: string){
	const { colorMode } = useColorMode()
	return `main.${color}.${colorMode}`
}