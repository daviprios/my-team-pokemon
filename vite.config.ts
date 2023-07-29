import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker'

export default defineConfig({
	plugins: [
		react(),
		checker({
			overlay: { initialIsOpen: false },
			typescript: true,
			eslint: {
				lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
			},
		})
	],
	resolve: {
		alias: {
			'@': resolve('src')
		}
	},
	build: {
		outDir: 'build',
	},
})