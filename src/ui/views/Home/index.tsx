import { useEffect, useRef, useState } from 'react'
import { Center, Flex, Text } from '@chakra-ui/react'
import Xarrow, { anchorType } from 'react-xarrows'

export default function Home() {
	const arrowStartAnchorRef = useRef<HTMLParagraphElement>(null)
	const [anchorDirection, setAnchorDirection] = useState<anchorType>('auto')

	useEffect(() => {
		setAnchorDirection((window.screen.width - 100 < (arrowStartAnchorRef.current?.getBoundingClientRect().width ?? 0))
			? { position: 'top', offset: { y: -5 }}
			: { position: 'left', offset: { x: -10 }})
	}, [])

	return (
		<Center minH='full' position={'relative'} display={'flex'} flexDir={'column'}>
			<div id={'arrowEndAnchorRef'} style={{
				position: 'absolute',
				top: 0,
				left: '30px'
			}}></div>
			<Xarrow start={'arrowStartAnchorRef'} end={'arrowEndAnchorRef'} startAnchor={anchorDirection} endAnchor={{ position: 'bottom', offset: { y: 5 }}} dashness={{ strokeLen: 7, nonStrokeLen: 12 }} headSize={5} color='red'/>
			<Text id={'arrowStartAnchorRef'} mb='8'>Siga a seta para abrir o menu</Text>
			<Flex px='4' flexDir={'column'} mb='4' textAlign={'center'} ref={arrowStartAnchorRef}>
				<Text textAlign={'center'} mb='3'>
					Tem duvida do que fazer?
				</Text>
				<Text textAlign={'center'} mb='3'>
					Crie um novo time pokemon (você pode criar vários) na seção {'"Meu Time"'}.
					Depois vá até a seção {'"Pokemon'} para adicionar até 6 Pokemons aos times.
				</Text>
				<Text textAlign={'center'}>
					Para adicionar ou remover Pokemons basta seleciona-los clicando.
				</Text>
			</Flex>
		</Center>
	)
}
