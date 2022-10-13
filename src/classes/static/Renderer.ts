import { ASPECT_RATIO, GAME_HEIGHT } from '../../constants'
import Vector2 from '../geometry2D/Vector2'

export default class Renderer {
	private static canvas: HTMLCanvasElement
	private static context: CanvasRenderingContext2D
	private static boundingRect: DOMRect

	static {
		this.canvas = document.createElement('canvas')
		this.context = this.canvas.getContext('2d')!

		const appElement = document.querySelector('#app')
		if (!appElement) throw new Error('Cannot query #app element!')

		appElement.append(this.canvas)
		addEventListener('resize', this.onResize.bind(this))

		setTimeout(() => {
			//Gettings bounding rect fix /shrug
			this.onResize()
		}, 10)
	}

	private static onResize(): void {
		this.canvas.height = innerHeight
		this.canvas.width = innerHeight * ASPECT_RATIO

		const scale = this.getScale()
		this.context.scale(scale, scale)
		this.boundingRect = this.canvas.getBoundingClientRect()
	}

	public static getScale(): number {
		return innerHeight / GAME_HEIGHT
	}

	public static getCanvas(): HTMLCanvasElement {
		return this.canvas
	}

	public static getContext(): CanvasRenderingContext2D {
		return this.context
	}

	public static screenToGamePoint(point: Vector2): Vector2 {
		const { x, y } = point
		const { x: brx, y: bry } = this.boundingRect
		const scale = this.getScale()
		console.log(x, brx, y, bry, scale)

		return new Vector2((x - brx) / scale, (y - bry) / scale)
	}
}
