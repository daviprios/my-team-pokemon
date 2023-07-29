import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ChakraContext } from '@/ui/contexts/ChakraContext'

import BaseLayout from './layouts/BaseLayout'
import NotFound from './views/NotFound'
import Home from './views/Home'
import PokemonList from './views/PokemonList'
import MyTeams from './views/MyTeams'

export function App() {
	return (
		<ChakraContext>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<BaseLayout/>}>
						<Route index element={<Home/>}/>
						<Route path='pokemon' element={<PokemonList/>}/>
						<Route path='teams' element={<MyTeams/>}/>
					</Route>
					<Route path='*' element={<NotFound/>}/>
				</Routes>
			</BrowserRouter>
		</ChakraContext>
	)
}
