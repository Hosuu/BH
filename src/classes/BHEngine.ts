import Samples from './Audio/Samples'
import Track from './Audio/Track'
import GameLoop from './GameLoop'
import Input from './static/Input'
import Settings from './static/Settings'
import Vector2 from './Vector2'

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
		Samples.load('./assets/mp3/Intersect Thunderbolt.mp3').then(() => {
			this.track = new Track(Samples.get('./assets/mp3/Intersect Thunderbolt.mp3')!)
		})

		addEventListener('resize', this.onResize.bind(this))
	}

	public static getInstance(): BHEngine {
		return this.instance as BHEngine
	}

	protected update(dt: number): void {
		if (!this.track) return
		if (this.track.isPaused && Input.getAnyKeyDown()) this.track.play()
		if (this.track.isPaused) return

		const input = new Vector2()
		input.add(Vector2.RIGHT.multiply(+Input.get(Settings.get('KEYBIND_moveRight'))))
		input.add(Vector2.LEFT.multiply(+Input.get(Settings.get('KEYBIND_moveLeft'))))
		input.add(Vector2.UP.multiply(+Input.get(Settings.get('KEYBIND_moveUp'))))
		input.add(Vector2.DOWN.multiply(+Input.get(Settings.get('KEYBIND_moveDown'))))
		input.normalize()

		const mouseWheel = Input.getMouseWheel()
		if (this.track && mouseWheel.frame === GameLoop.getCurrentFrameId() - 1) {
			this.track.playbackRate += mouseWheel.y / 1000
		}

		this.isPrecise = Input.get(Settings.get('KEYBIND_precise'))
		const speed = this.isPrecise ? 0.25 : 0.5

		this.position.add(input.multiply(speed * dt))
	}

	protected draw(): void {
		this.context.fillStyle = '#000'
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.context.fillStyle = this.isPrecise ? '#fff' : '#ff0'
		this.context.beginPath()
		this.context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
		this.context.fill()

		if (this.track) {
			const string = `${this.track.currentTime.toFixed(3)}/${this.track.duration.toFixed(
				3
			)} | ${this.track.playbackRate}x`
			this.context.fillStyle = '#f00'
			this.context.font = '24px Arial'
			this.context.fillText(string, 0, 32)
		}
	}

	protected onPause(): void {}

	protected onResume(): void {}

	private onResize(): void {
		this.canvas.height = innerHeight
		this.canvas.width = innerHeight * (9 / 16)
	}
}
