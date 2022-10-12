import GameLoop from './GameLoop'
import Input from './static/Input'
import Settings from './static/Settings'
import Vector2 from './Vector2'

export default class BHEngine extends GameLoop {
	public canvas: HTMLCanvasElement
	public context: CanvasRenderingContext2D

	public position: Vector2

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
		this.position = new Vector2()
	}

	public static getInstance(): BHEngine {
		return this.instance as BHEngine
	}

	public update(dt: number): void {
		const input = new Vector2()
		input.add(Vector2.RIGHT.multiply(+Input.get(Settings.get('KEYBIND_moveRight'))))
		input.add(Vector2.LEFT.multiply(+Input.get(Settings.get('KEYBIND_moveLeft'))))
		input.add(Vector2.UP.multiply(+Input.get(Settings.get('KEYBIND_moveUp'))))
		input.add(Vector2.DOWN.multiply(+Input.get(Settings.get('KEYBIND_moveDown'))))
		input.normalize()

		const isPrecise = Input.get(Settings.get('KEYBIND_precise'))
		const speed = isPrecise ? 0.25 : 0.5

		this.position.add(input.multiply(speed * dt))
	}

	public draw(): void {
		this.context.fillStyle = '#000'
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.context.fillStyle = '#ff0'
		this.context.beginPath()
		this.context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
		this.context.fill()
	}

	public onPause(): void {}

	public onResume(): void {}
}
