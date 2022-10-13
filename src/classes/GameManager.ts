import { GAME_HEIGHT, GAME_WIDTH } from '../constants'
import { formatTime } from '../utils'
import Samples from './audio/Samples'
import Track from './audio/Track'
import Projectile from './Projectile'
import Input from './static/Input'
import Player from './static/Player'

export default class GameManager {
	public static instance: GameManager

	private lastTrackTimeStamp: number
	private track: Track | null
	private isPlaying: boolean

	private projectiles: Projectile[]

	constructor() {
		GameManager.instance = this
		this.lastTrackTimeStamp = 0
		this.track = null
		this.isPlaying = false
		this.projectiles = []
	}

	public async init(m: string) {
		Player.init(3)
		console.log('Loading file: ' + m)
		await Samples.load(m)
		this.track = new Track(Samples.get(m)!)
		this.track.volume = 0.2
	}

	public play(): void {
		if (this.isPlaying || !this.track) return

		this.isPlaying = true
		this.track.play()
	}

	public update(dt: number): void {
		if (!this.isPlaying && Input.getAnyKeyDown()) this.play()
		if (!this.isPlaying || !this.track) return

		const musicDt: number = this.track.currentTime - this.lastTrackTimeStamp
		musicDt
		this.lastTrackTimeStamp = this.track.currentTime

		for (const proj of this.projectiles) proj.update(dt)
		Player.update(dt)
	}

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.font = '24px Arial'

		if (!this.track) {
			ctx.fillStyle = '#f00'
			ctx.fillText('Loading music file', 0, 32)
			return
		}
		if (!this.isPlaying) {
			ctx.fillStyle = '#f00'
			ctx.fillText('Any button to start', 0, 32)
			return
		} else {
			ctx.fillStyle = '#f00'
			ctx.fillText(`Bombs: ${Player.getBombsLeft()}`, 0, GAME_HEIGHT - 64)
		}
		ctx.restore()

		for (const proj of this.projectiles) proj.draw()
		Player.draw()

		//Progress bar
		ctx.save()
		ctx.fillStyle = '#66f'
		ctx.fillRect(0, GAME_HEIGHT - 5, GAME_HEIGHT * this.track.progress, 5)
		ctx.fillText(formatTime(this.track.currentTime), 5, GAME_HEIGHT - 15)
		ctx.textAlign = 'right'
		ctx.fillText(formatTime(this.track.duration), GAME_WIDTH - 5, GAME_HEIGHT - 15)
		ctx.restore()
	}

	public useBomb() {}
}

//Inzynierskie zastowowanie OUT :)
