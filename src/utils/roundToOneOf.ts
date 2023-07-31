export function roundToNearestFloor(value: number, references: number[]): number {
	const sortedReferences = references.sort((a, b) => a - b).reverse()

	let lastValue = sortedReferences[0]
	for(const reference of sortedReferences) {
		if(value < reference) {
			lastValue = reference
			continue
		}
		return reference
	}
	return lastValue
}