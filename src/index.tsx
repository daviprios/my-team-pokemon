import * as ReactDOM from 'react-dom/client'

import { ColorModeScript } from '@chakra-ui/react'
import { App } from './ui/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<>
		<ColorModeScript />
		<App />
	</>,
)