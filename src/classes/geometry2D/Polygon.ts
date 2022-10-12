import Vector2 from './Vector2'

export default class Polygon {
	public vertecies: Vector2[]
	public origin: Vector2
	public angle: number

	constructor(vertecies: Vector2[], origin?: Vector2, angle?: number) {
		this.origin = origin ?? Vector2.sum(...vertecies).divide(vertecies.length)
		this.angle = angle ?? 0
		for (const vert of vertecies) {
			this.vertecies.push(vert.getDecreasedBy(this.origin).rotate(this.angle))
		}
	}

	public getVertecies(): Vector2[] {
		return this.vertecies.map((v) => v.clone().add(this.origin))
	}

	public toPath2D(): Path2D {
		const path = new Path2D()
		const vertecies = this.getVertecies()

		path.moveTo(vertecies[0].x, vertecies[0].y)
		for (let i = 1; i < 4; i++) {
			path.lineTo(vertecies[i].x, vertecies[i].y)
		}
		path.closePath()

		return path
	}
}
