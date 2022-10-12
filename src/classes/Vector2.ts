export default class Vector2 {
	public x: number
	public y: number

	constructor()
	constructor(x: number, y: number)
	constructor(x?: number, y?: number) {
		this.x = x ?? 0
		this.y = y ?? x ?? 0
	}

	//Static constructors
	public static get RandomDirection(): Vector2 {
		const angle = Math.random() * Math.PI * 2
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	public static FromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	public add(vec: Vector2): Vector2 {
		this.x += vec.x
		this.y += vec.y

		return this
	}

	public getIncreasedBy(vec: Vector2): Vector2 {
		return this.clone().add(vec)
	}

	public subtract(vec: Vector2): Vector2 {
		this.x -= vec.x
		this.y -= vec.y

		return this
	}

	public getDecreasedBy(vec: Vector2): Vector2 {
		return this.clone().subtract(vec)
	}

	public multiply(value: number | Vector2): Vector2 {
		if (value instanceof Vector2) {
			this.x *= value.x
			this.y *= value.y
		} else {
			this.x *= value
			this.y *= value
		}

		return this
	}

	public getMultipliedBy(value: number | Vector2): Vector2 {
		return this.clone().multiply(value)
	}

	public divide(value: number | Vector2): Vector2 {
		if (value instanceof Vector2) {
			if (value.x === 0 || value.y === 0) throw Error('Division by zero!')
			this.x /= value.x
			this.y /= value.y
		} else {
			if (value === 0) throw Error('Division by zero!')
			this.x /= value
			this.y /= value
		}

		return this
	}

	public getDividedBy(value: number | Vector2): Vector2 {
		return this.clone().divide(value)
	}

	public set(x: number, y?: number): Vector2 {
		this.x = x
		this.y = y ?? x
		return this
	}

	public rotate(angle: number): Vector2 {
		const newX = this.x * Math.cos(angle) - this.y * Math.sin(angle)
		const newY = this.x * Math.sin(angle) + this.y * Math.cos(angle)
		this.set(newX, newY)

		return this
	}

	public getRotatedBy(angle: number): Vector2 {
		return this.clone().rotate(angle)
	}

	public lerpTowards(target: Vector2, t: number): Vector2 {
		this.x += (target.x - this.x) * t
		this.y += (target.y - this.y) * t

		return this
	}

	public setMagnitude(scalar: number): Vector2 {
		this.normalize().multiply(scalar)

		return this
	}

	public getMagnitude(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2)
	}

	public normalize(): Vector2 {
		const mag = this.getMagnitude()
		if (mag != 0) this.divide(mag)

		return this
	}

	public getNormalized(): Vector2 {
		return this.clone().normalize()
	}

	public negate(): Vector2 {
		this.set(-this.x, -this.y)

		return this
	}

	public getNegated(): Vector2 {
		return this.clone().negate()
	}

	public getAngle(): number {
		return Math.atan2(this.y, this.x)
	}

	public getDistanceTo(vec: Vector2): number {
		return Math.abs(this.clone().subtract(vec).getMagnitude())
	}

	public clone(): Vector2 {
		return new Vector2(this.x, this.y)
	}

	public toString(): string {
		return `x: ${this.x}, y: ${this.y}`
	}

	public toArray(): number[] {
		return [this.x, this.y]
	}

	public toPath2D(radius: number): Path2D {
		const path = new Path2D()

		path.arc(this.x, this.y, radius, 0, Math.PI * 2)

		return path
	}

	public static sum(...vectors: Vector2[]): Vector2 {
		const v = new Vector2(0, 0)
		for (const vec of vectors) {
			v.add(vec)
		}
		return v
	}

	public static dot(v1: Vector2, v2: Vector2): number {
		return v1.x * v2.x + v1.y * v2.y
	}

	public static cross(v1: Vector2, v2: Vector2): number {
		return v1.x * v2.y - v1.y * v2.x
	}

	public static distance(v1: Vector2, v2: Vector2): number {
		return v1.getDistanceTo(v2)
	}

	public static lerp(v1: Vector2, v2: Vector2, t: number) {
		const x = v1.x + (v2.x - v1.x) * t
		const y = v1.y + (v2.y - v1.y) * t
		return new Vector2(x, y)
	}

	public static get UP(): Vector2 {
		return new Vector2(0, -1)
	}

	public static get DOWN(): Vector2 {
		return new Vector2(0, 1)
	}

	public static get RIGHT(): Vector2 {
		return new Vector2(1, 0)
	}

	public static get LEFT(): Vector2 {
		return new Vector2(-1, 0)
	}

	public static get ZERO(): Vector2 {
		return new Vector2()
	}
}
