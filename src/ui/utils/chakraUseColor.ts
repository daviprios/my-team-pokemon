export function chakraUseColor(base: `${string}.${string}`) {
	const color = base.split('.').join('-')
	return `var(--chakra-colors-${color})`
}