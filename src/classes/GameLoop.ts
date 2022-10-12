export default abstract class GameLoop {
	protected static instance: GameLoop

	private static isPaused: boolean
	private static lastUpdateTimeStamp: number | null
	private static lastRequestedFrameId: number
	private static currentFrameId: number
	private static framesCount: number
	private static deltaTime: number
	private static timeElapsed: number

	public static pauseOnFocusLoss: boolean
	public static resumeOnFocusGain: boolean

	static {
		this.isPaused = true
		this.lastUpdateTimeStamp = null
		this.lastRequestedFrameId = 0
		this.currentFrameId = 0
		this.framesCount = 0
		this.deltaTime = 0
		this.timeElapsed = 0

		this.pauseOnFocusLoss = true
		this.resumeOnFocusGain = true

		window.addEventListener('focus', () => {
			if (this.resumeOnFocusGain) this.resume.bind(this)
		})
		window.addEventListener('blur', () => {
			if (this.pauseOnFocusLoss) this.pause.bind(this)
		})

		this.resume()
	}

	constructor() {
		GameLoop.instance = this
	}

	public abstract update?(dt: number): void
	public abstract draw?(): void
	public abstract onPause?(): void
	public abstract onResume?(): void

	protected static mainLoop(timeStamp: DOMHighResTimeStamp): void {
		const dt: number = timeStamp - (this.lastUpdateTimeStamp ?? timeStamp)
		this.deltaTime = dt
		this.timeElapsed += dt

		this.currentFrameId = this.framesCount + 1
		this.instance.update?.(dt)
		this.instance.draw?.()

		this.lastUpdateTimeStamp = timeStamp
		this.framesCount++
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
	}

	protected static pause(): void {
		if (this.isPaused) return

		window.cancelAnimationFrame(this.lastRequestedFrameId)
		this.isPaused = true
	}

	protected static resume(): void {
		if (!this.isPaused) return

		this.lastUpdateTimeStamp = performance.now()
		this.lastRequestedFrameId = window.requestAnimationFrame(this.mainLoop.bind(this))
		this.isPaused = false
	}

	public static getTimeElapsed(): number {
		return this.timeElapsed
	}

	public static getFramesCount(): number {
		return this.framesCount
	}

	public static getCurrentFrameId(): number {
		return this.currentFrameId
	}

	public static getDeltaTime(): number {
		return this.deltaTime
	}
}
