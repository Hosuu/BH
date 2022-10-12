import Vector2 from './Vector2'

export default class Line {
	public start: Vector2
	public end: Vector2

	constructor(start: Vector2, end: Vector2) {
		this.start = start
		this.end = end
	}

	public getDirection(): number {
		return this.end.getDecreasedBy(this.start).getAngle()
	}

	public getLength(): number {
		return Vector2.distance(this.start, this.end)
	}

	public getVertecies(): Vector2[] {
		return [this.start, this.end]
	}

	public toPath2d(): Path2D {
		const path = new Path2D()

		path.moveTo(this.start.x, this.start.y)
		path.lineTo(this.end.x, this.end.y)

		return path
	}
}
