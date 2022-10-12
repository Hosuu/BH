import Vector2 from './Vector2'

export default class Circle {
	public center: Vector2
	public radius: number

	constructor(center: Vector2, radius: number) {
		this.center = center
		this.radius = radius
	}

	public getArea(): number {
		return Math.PI * this.radius ** 2
	}

	public getPerimeter(): number {
		return Math.PI * this.radius * 2
	}

	public toPath2D(): Path2D {
		const path = new Path2D()

		path.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)

		return path
	}
}
