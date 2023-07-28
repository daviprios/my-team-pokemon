import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { ColorModeScript } from '@chakra-ui/react'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ColorModeScript />
		<App />
	</React.StrictMode>,
)