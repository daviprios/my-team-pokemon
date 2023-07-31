import { useEffect, useRef, useState } from 'react'
import { Center, Text,  } from '@chakra-ui/react'
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
		<Center minH='full' position={'relative'}>
			<div id={'arrowEndAnchorRef'} style={{
				position: 'absolute',
				top: 0,
				left: '30px'
			}}></div>
			<Xarrow start={'arrowStartAnchorRef'} end={'arrowEndAnchorRef'} startAnchor={anchorDirection} endAnchor={{ position: 'bottom', offset: { y: 5 }}} dashness={{ strokeLen: 7, nonStrokeLen: 12 }} headSize={5} color='red'/>
			<Text id={'arrowStartAnchorRef'} px='4' textAlign={'center'} ref={arrowStartAnchorRef}>
				Vamos criar nosso time? Basta ir na seção Meus Times.
			</Text>
		</Center>
	)
}
