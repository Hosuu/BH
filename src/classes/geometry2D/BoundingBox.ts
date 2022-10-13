import Circle from './Circle'
import Line from './Line'
import Rect from './Rect'
import Vector2 from './Vector2'

export default class BoundingBox {
	private vertecies: Vector2[]
	private width: number | null
	private height: number | null
	private area: number | null
	private topY: number | null
	private bottomY: number | null
	private leftX: number | null
	private rightX: number | null
	private centerPoint: Vector2 | null
	private path2D: Path2D | null

	//Constructors
	private constructor(vertecies: Vector2[]) {
		this.vertecies = vertecies
		this.width = null
		this.height = null
		this.area = null
		this.topY = null
		this.bottomY = null
		this.leftX = null
		this.rightX = null
		this.centerPoint = null
		this.path2D = null
	}

	public static fromCircle(circle: Circle): BoundingBox {
		const radius = circle.radius
		const center = circle.center
		const NW = new Vector2(-1, -1).multiply(radius).add(center)
		const NE = new Vector2(1, -1).multiply(radius).add(center)
		const SE = new Vector2(1, 1).multiply(radius).add(center)
		const SW = new Vector2(-1, 1).multiply(radius).add(center)

		return new BoundingBox([NW, NE, SE, SW])
	}

	public static fromRect(rect: Rect): BoundingBox {
		return new BoundingBox(rect.getVertecies())
	}

	public static fromLine(line: Line): BoundingBox {
		return new BoundingBox(line.getVertecies())
	}

	public static fromVertecies(vertecies: Vector2[]): BoundingBox {
		return new BoundingBox(vertecies)
	}

	//Lazy getters
	public getWidth(): number {
		if (this.width) return this.width

		this.width = this.getRightX() - this.getLeftX()

		return this.width
	}

	public getHeight(): number {
		if (this.height) return this.height

		this.height = this.getBottomY() - this.getTopY()

		return this.height
	}

	public getCenterPont(): Vector2 {
		if (this.centerPoint) return this.centerPoint.clone()

		const NW = new Vector2(this.getLeftX(), this.getTopY())
		const SE = new Vector2(this.getRightX(), this.getBottomY())

		this.centerPoint = Vector2.lerp(NW, SE, 0.5)

		return this.centerPoint.clone()
	}

	public getTopY(): number {
		if (this.topY) return this.topY

		const vertexYs = this.vertecies.map((v) => v.y)
		this.topY = Math.min(...vertexYs)

		return this.topY
	}

	public getBottomY(): number {
		if (this.bottomY) return this.bottomY

		const vertexYs = this.vertecies.map((v) => v.y)
		this.bottomY = Math.max(...vertexYs)

		return this.bottomY
	}

	public getLeftX(): number {
		if (this.leftX) return this.leftX

		const vertexXs = this.vertecies.map((v) => v.x)
		this.leftX = Math.min(...vertexXs)

		return this.leftX
	}

	public getRightX(): number {
		if (this.rightX) return this.rightX

		const vertexXs = this.vertecies.map((v) => v.x)
		this.rightX = Math.max(...vertexXs)

		return this.rightX
	}

	public getArea(): number {
		if (this.area) return this.area

		this.area = (this.getRightX() - this.getLeftX()) * (this.getBottomY() - this.getTopY())

		return this.area
	}

	public getPath2D(): Path2D {
		if (this.path2D) return this.path2D

		const path = new Path2D()

		const NW = new Vector2(this.getLeftX(), this.getTopY())
		const NE = new Vector2(this.getRightX(), this.getTopY())
		const SE = new Vector2(this.getRightX(), this.getBottomY())
		const SW = new Vector2(this.getLeftX(), this.getBottomY())

		path.moveTo(NW.x, NW.y)
		path.lineTo(NE.x, NE.y)
		path.lineTo(SE.x, SE.y)
		path.lineTo(SW.x, SW.y)
		path.closePath()

		this.path2D = path

		return this.path2D
	}

	//Collision
	public static AABBtest(bb1: BoundingBox, bb2: BoundingBox) {
		return (
			bb1.getLeftX() < bb2.getRightX() &&
			bb1.getRightX() > bb2.getLeftX() &&
			bb1.getTopY() < bb2.getBottomY() &&
			bb1.getBottomY() > bb2.getTopY()
		)
	}
}
