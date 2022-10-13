import Circle from './geometry2D/Circle'
import Rect from './geometry2D/Rect'

export default abstract class Projectile {
	abstract getHitbox(): Rect | Circle
	abstract update(dt: number): void
	abstract draw(ctx: CanvasRenderingContext2D): void
}
