import Samples from './audio/Samples'
import GameLoop from './GameLoop'
import GameManager from './GameManager'
import Vector2 from './geometry2D/Vector2'
import Input, { Key } from './static/Input'
import Settings from './static/Settings'

export default class BHEngine extends GameLoop {
	public canvas: HTMLCanvasElement
	public context: CanvasRenderingContext2D

	public gameManager: GameManager

	public position: Vector2
	public isPrecise: boolean

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
		Samples.batchLoad(['./assets/mp3/bomb.wav'])

		this.gameManager = new GameManager()
		this.gameManager.init('./assets/mp3/Intersect Thunderbolt.mp3')

		addEventListener('resize', this.onResize.bind(this))
	}

	public static getInstance(): BHEngine {
		return this.instance as BHEngine
	}

	protected update(dt: number): void {
		if (Input.getDown(Key.C)) Settings.set('mouseControl', !Settings.get('mouseControl'))
		this.gameManager.update(dt)
	}

	protected draw(): void {
		this.context.fillStyle = '#000'
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.context.fillText('C to change controller', 0, 64)
		this.context.fillText(
			'Current: ' + (Settings.get('mouseControl') ? 'Mouse' : 'Keyboard'),
			0,
			90
		)

		this.gameManager.draw(this.context)
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
