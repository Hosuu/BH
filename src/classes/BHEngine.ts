import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import Samples from './Audio/Samples'
import GameLoop from './GameLoop'
import GameManager from './GameManager'
import Input, { Key } from './static/Input'
import Renderer from './static/Renderer'
import Settings from './static/Settings'

export default class BHEngine extends GameLoop {
	public gameManager: GameManager

	constructor() {
		super()
		GameLoop.instance = this

		Samples.batchLoad(['./assets/mp3/bomb.wav'])

		this.gameManager = new GameManager()
		this.gameManager.init('./assets/mp3/Intersect Thunderbolt.mp3')
	}

	public static getInstance(): BHEngine {
		return this.instance as BHEngine
	}

	protected update(dt: number): void {
		if (Input.getDown(Key.C)) Settings.set('mouseControl', !Settings.get('mouseControl'))
		this.gameManager.update(dt)
	}

	protected draw(): void {
		const ctx = Renderer.getContext()

		//Clear screen
		ctx.save()
		ctx.fillStyle = '#000'
		ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
		ctx.restore()

		ctx.save()
		ctx.font = '24px Arial'
		ctx.fillStyle = '#f00'
		ctx.fillText('C to change controller', 0, 64)
		ctx.fillText('Current: ' + (Settings.get('mouseControl') ? 'Mouse' : 'Keyboard'), 0, 90)
		ctx.restore()

		this.gameManager.draw(ctx)
	}

	protected onPause(): void {}

	protected onResume(): void {}
}
