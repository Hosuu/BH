import Audio from './audio/Audio'
import Samples from './audio/Samples'
import Track from './audio/Track'
import GameLoop from './GameLoop'
import Vector2 from './geometry2D/Vector2'
import Input, { Key } from './static/Input'
import Player from './static/Player'
import Settings from './static/Settings'

export default class BHEngine extends GameLoop {
	public canvas: HTMLCanvasElement
	public context: CanvasRenderingContext2D

	public position: Vector2
	public isPrecise: boolean
	public track: Track | null

	constructor() {
		super()
		GameLoop.instance = this

		const canvas = document.createElement('canvas')
		canvas.height = innerHeight
		canvas.width = innerHeight * (9 / 16)
		document.querySelector('#app')!.append(canvas)
		const ctx = canvas.getContext('2d')!
		ctx.fillStyle = '#000'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		this.canvas = canvas
		this.context = ctx
		this.position = new Vector2(canvas.width * 0.5, canvas.height * 0.8)
		this.isPrecise = false
		this.track = null
		Samples.batchLoad(['./assets/mp3/Intersect Thunderbolt.mp3', './assets/mp3/bomb.wav']).then(
			() => {
				this.track = new Track(Samples.get('./assets/mp3/Intersect Thunderbolt.mp3')!)
				this.track.volume = 0.1
			}
		)

		addEventListener('resize', this.onResize.bind(this))
	}

	public static getInstance(): BHEngine {
		return this.instance as BHEngine
	}

	protected update(dt: number): void {
		if (!this.track) return
		if (this.track.isPaused && Input.getAnyKeyDown() && this.track.progress < 1)
			this.track.play()
		if (this.track.isPaused) return

		if (Input.getDown(Key.C)) Settings.set('mouseControl', !Settings.get('mouseControl'))

		if (Input.getDown(Settings.get('KEYBIND_bomb')))
			Audio.playSample(Samples.get('./assets/mp3/bomb.wav')!, 0.2)

		Player.update(dt)
	}

	protected draw(): void {
		this.context.fillStyle = '#000'
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		Player.draw(this.context)

		if (this.track) {
			const string = `${this.track.currentTime.toFixed(3)}/${this.track.duration.toFixed(
				3
			)} | ${this.track.playbackRate}x`
			this.context.fillStyle = '#f00'
			this.context.font = '24px Arial'
			this.context.fillText(string, 0, 32)
		} else {
			const string = `Loading music...`
			this.context.fillStyle = '#f00'
			this.context.font = '24px Arial'
			this.context.fillText(string, 0, 32)
		}

		this.context.fillText('C to change controller', 0, 64)
		this.context.fillText(
			'Current: ' + (Settings.get('mouseControl') ? 'Mouse' : 'Keyboard'),
			0,
			90
		)
	}

	protected onPause(): void {}

	protected onResume(): void {}

	private onResize(): void {
		const x = this.position.x / this.canvas.width
		const y = this.position.y / this.canvas.height
		this.canvas.height = innerHeight
		this.canvas.width = innerHeight * (9 / 16)
		this.position.x = x * this.canvas.width
		this.position.y = y * this.canvas.height
	}
}
