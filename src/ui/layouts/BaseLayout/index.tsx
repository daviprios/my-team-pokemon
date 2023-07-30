import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Text, useDisclosure, Grid, GridItem, Flex, Link, UnorderedList, ListItem, Spacer, Button } from '@chakra-ui/react'
import { AiOutlineMenu } from 'react-icons/ai'
import { Outlet } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'

import { ColorModeSwitcher } from '@/ui/components/ColorModeSwitcher'
import { useMainColor } from '@/ui/hooks/useMainColor'

function Item({
	to,
	children,
	onClose
}: {
	to: string
	children: React.ReactNode
	onClose: () => void
}) {
	const text = useMainColor('text')

	return (
		<ListItem borderBottomWidth={'1px'} borderBottomColor={text}>
			<Link as={RouterLink} to={to} w={'full'} h='full' display={'inline-block'} pl='4' py='8' onClick={onClose}>{children}</Link>
		</ListItem>
	)
}

export default function BaseLayout() {
	const { isOpen, onClose, onOpen } = useDisclosure()

	const color = useMainColor('color')
	const bg = useMainColor('bg')

	return (
		<>
			<Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth='1px' borderBottomColor={'gray.900'} bgColor={color}>
						<Flex ml='-2' alignItems={'center'}>
							<Button bg={'transparent'} onClick={onClose}>
								<AiOutlineMenu />
							</Button>
							<Text ml={2}>Menu</Text>
							<Spacer/>
							<ColorModeSwitcher/>
						</Flex>
					</DrawerHeader>
					<DrawerBody p='0' bgColor={bg}>
						<UnorderedList listStyleType={'none'} mx='0' p='2'>
							<Item onClose={onClose} to='/'>Home</Item>
							<Item onClose={onClose} to='/pokemon'>Pokemon</Item>
							<Item onClose={onClose} to='/teams'>Meus Times</Item>
						</UnorderedList>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
			<Grid h={'100vh'} gridTemplateRows={'80px auto'}>
				<GridItem py='4' bgColor={color}>
					<Flex pl='2' h='full' alignItems='center' justifyContent='left'>
						<Button bg={'transparent'} onClick={onOpen}>
							<AiOutlineMenu/>
						</Button>
						<Text pl='2' fontWeight={'bold'} fontSize={'2xl'}>Pokemon</Text>
					</Flex>
				</GridItem>
				<GridItem>
					<Outlet/>
				</GridItem>
			</Grid>
		</>
	)
}