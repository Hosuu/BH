export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

export function formatTime(seconds: number): string {
	seconds = Math.floor(seconds)
	const mins = Math.floor(seconds / 60)
	const secs = seconds - mins * 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
