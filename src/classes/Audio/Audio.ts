export default class Audio {
	public static context: AudioContext

	static {
		this.context = new AudioContext()
	}

	public static playSample(buff: AudioBuffer, volume: number = 1, pan: number = 0) {
		const source = this.context.createBufferSource()
		source.buffer = buff

		const gainNode = this.context.createGain()
		gainNode.gain.value = volume

		const panNode = this.context.createStereoPanner()
		panNode.pan.value = pan

		source.connect(panNode).connect(gainNode).connect(this.context.destination)
		source.start()
	}
}
