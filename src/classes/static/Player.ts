import {
	GAME_HEIGHT,
	GAME_WIDTH,
	PLAYER_PRECISE_SPEED,
	PLAYER_RADIUS,
	PLAYER_SPEED,
} from '../../constants'
import { clamp } from '../../utils'
import Audio from '../audio/Audio'
import Samples from '../audio/Samples'
import GameManager from '../GameManager'
import Circle from '../geometry2D/Circle'
import Vector2 from '../geometry2D/Vector2'
import Projectile from '../Projectile'
import Input, { Button } from './Input'
import Renderer from './Renderer'
import Settings from './Settings'

export default class Player {
	private static position: Vector2
	private static input: Vector2
	private static preciseMode: boolean
	private static bombs: number
	private static hitbox: Circle

	public static init(bombs: number) {
		this.position = new Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2)
		this.input = new Vector2()
		this.preciseMode = false
		this.bombs = bombs
		this.hitbox = new Circle(this.position, PLAYER_RADIUS)
	}

	public static update(dt: number) {
		//Speed
		this.preciseMode =
			Input.get(Settings.get('KEYBIND_precise')) ||
			(Settings.get('mouseControl') && Input.get(Button.Left))

		const speed = this.preciseMode ? PLAYER_PRECISE_SPEED : PLAYER_SPEED

		//Direction
		this.input.set(0, 0)
		if (Settings.get('mouseControl')) {
			const mousePos = Renderer.screenToGamePoint(Input.getCursorPosition())
			const vecToMouse = mousePos.subtract(this.position)
			this.input = vecToMouse.getNormalized().multiply(speed * dt)

			//Mouse snaping fix
			const inputMag = this.input.getMagnitude()
			const toMouseMag = vecToMouse.getMagnitude()
			if (inputMag > toMouseMag) this.input.multiply(toMouseMag / inputMag)
		} else {
			this.input.add(Vector2.RIGHT.multiply(+Input.get(Settings.get('KEYBIND_moveRight'))))
			this.input.add(Vector2.LEFT.multiply(+Input.get(Settings.get('KEYBIND_moveLeft'))))
			this.input.add(Vector2.UP.multiply(+Input.get(Settings.get('KEYBIND_moveUp'))))
			this.input.add(Vector2.DOWN.multiply(+Input.get(Settings.get('KEYBIND_moveDown'))))
			this.input.normalize().multiply(speed * dt)
		}

		if (Input.getDown(Settings.get('KEYBIND_bomb')) && this.bombs > 0) {
			Audio.playSample(Samples.get('./assets/mp3/bomb.wav')!, 0.2)
			GameManager.instance.useBomb()
			this.bombs--
		}

		this.position.add(this.input)
		this.position.x = clamp(this.position.x, 0, GAME_WIDTH)
		this.position.y = clamp(this.position.y, 0, GAME_HEIGHT)
	}

	public static draw() {
		const ctx = Renderer.getContext()
		ctx.save()

		ctx.fillStyle = this.preciseMode ? '#fff' : '#ff0'
		ctx.beginPath()
		ctx.arc(this.position.x, this.position.y, PLAYER_RADIUS, 0, Math.PI * 2, false)
		ctx.fill()

		ctx.restore()
	}

	public static getHitbox(): Circle {
		return this.hitbox
	}

	public static onHit(object: Projectile) {
		if (Settings.get('autoBomb') && this.bombs > 0) {
			GameManager.instance.useBomb()
			this.bombs--
			return
		}
		console.log(object)
		//GAMEOVER
	}
}
