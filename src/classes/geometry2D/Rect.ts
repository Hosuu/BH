import Vector2 from './Vector2'

export default class Rect {
	public position: Vector2
	public size: Vector2
	public anchor: Vector2
	public angle: number

	constructor(position: Vector2, size: Vector2, angle?: number, anchor?: Vector2) {
		this.position = position
		this.size = size
		this.angle = angle ?? 0
		this.anchor = anchor ?? new Vector2(0.5, 0.5)
	}

	public getWidth(): number {
		return this.size.x
	}

	public getHeight(): number {
		return this.size.y
	}

	public getArea(): number {
		return this.size.x * this.size.y
	}

	public getVertecies(): Vector2[] {
		const pos = this.position
		const anch = this.anchor
		const size = this.size

		const v1 = pos.getDecreasedBy(new Vector2(0, 0).subtract(anch).multiply(size))
		const v2 = pos.getDecreasedBy(new Vector2(1, 0).subtract(anch).multiply(size))
		const v3 = pos.getDecreasedBy(new Vector2(1, 1).subtract(anch).multiply(size))
		const v4 = pos.getDecreasedBy(new Vector2(0, 1).subtract(anch).multiply(size))

		return [v1, v2, v3, v4]
	}

	public toPath2D(): Path2D {
		const path = new Path2D()
		const vertecies = this.getVertecies()

		path.moveTo(vertecies[0].x, vertecies[0].y)
		for (let i = 1; i < vertecies.length; i++) {
			path.lineTo(vertecies[i].x, vertecies[i].y)
		}
		path.closePath()

		return path
	}
}
