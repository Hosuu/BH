import Circle from './geometry2D/Circle'
import Rect from './geometry2D/Rect'

export default abstract class Projectile {
	abstract getHitbox(): Rect | Circle
}
