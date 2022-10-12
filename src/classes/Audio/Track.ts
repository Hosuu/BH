import Audio from './Audio'

export default class Track {
	private startedAt: number
	private pausedAt: number

	private readonly buffer: AudioBuffer
	private sourceNode: AudioBufferSourceNode | null
	private gainNode: GainNode
	private panNode: StereoPannerNode
	private customInputNode: AudioNode | null
	private customOutputNode: AudioNode | null

	private _playbackRate: number

	constructor(buffer: AudioBuffer) {
		this.buffer = buffer
		this.sourceNode = null

		this.gainNode = Audio.context.createGain()
		this.gainNode.connect(Audio.context.destination)

		this.panNode = Audio.context.createStereoPanner()
		this.panNode.connect(this.gainNode)

		this.customInputNode = null
		this.customOutputNode = null

		this.startedAt = 0
		this.pausedAt = 0
		this._playbackRate = 1
	}

	private onEnd(): void {
		if (this.progress >= 1) this.seek(this.duration).pause()
	}

	public play(): Track {
		if (this.sourceNode) return this

		this.sourceNode = Audio.context.createBufferSource()
		this.sourceNode.buffer = this.buffer
		this.sourceNode.playbackRate.value = this._playbackRate

		this.sourceNode.connect(this.customInputNode ?? this.panNode)
		this.sourceNode.onended = this.onEnd.bind(this)

		if (this.pausedAt) {
			this.startedAt = Audio.context.currentTime - this.pausedAt / this._playbackRate
			this.sourceNode?.start(0, this.pausedAt)
		} else {
			this.startedAt = Audio.context.currentTime
			this.sourceNode.start()
		}

		return this
	}

	public pause(): Track {
		if (!this.sourceNode) return this

		this.sourceNode.stop()
		this.sourceNode.disconnect(this.panNode)
		this.sourceNode = null
		this.pausedAt = (Audio.context.currentTime - this.startedAt) * this._playbackRate

		return this
	}

	public seek(seconds: number): Track {
		const wasPlaying = Boolean(this.sourceNode)
		this.pause()
		this.pausedAt = seconds
		if (wasPlaying) this.play()

		return this
	}

	public registerCustomNode(input: AudioNode, output: AudioNode) {
		const wasPlaying = Boolean(this.sourceNode)
		this.pause()

		if (this.customOutputNode) this.customOutputNode.disconnect(this.panNode)

		this.customInputNode = input
		this.customOutputNode = output

		this.customOutputNode.connect(this.panNode)
		if (wasPlaying) this.play()
	}

	/////////////////////////////

	public get currentTime(): number {
		if (this.sourceNode)
			return (Audio.context.currentTime - this.startedAt) * this._playbackRate
		else return this.pausedAt
	}

	public get duration(): number {
		return this.buffer.duration
	}

	public get progress(): number {
		return this.currentTime / this.duration
	}

	public get isPaused(): boolean {
		return Boolean(!this.sourceNode)
	}

	////////////////////////////

	public get playbackRate(): number {
		return this._playbackRate
	}

	public set playbackRate(rate: number) {
		if (this.sourceNode) {
			this.pause()
			this._playbackRate = rate
			this.play()
		} else this._playbackRate = rate
	}

	public get volume(): number {
		return this.gainNode.gain.value
	}

	public set volume(value: number) {
		this.gainNode.gain.value = value
	}

	public get pan(): number {
		return this.panNode.pan.value
	}

	public set pan(value: number) {
		this.panNode.pan.value = value
	}
}
