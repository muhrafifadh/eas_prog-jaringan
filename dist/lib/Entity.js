import * as Constants from '../lib/Constants';
import Util from '../lib/Util';
import Vector from '../lib/Vector';
class Entity {
    constructor(position, velocity, acceleration, hitboxSize) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.hitboxSize = hitboxSize;
    }
    collided(other) {
        const minDistance = this.hitboxSize + other.hitboxSize;
        return (Vector.sub(this.position, other.position).mag2 <=
            minDistance * minDistance);
    }
    inWorld() {
        return (Util.inBound(this.position.x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
            Util.inBound(this.position.y, Constants.WORLD_MIN, Constants.WORLD_MAX));
    }
    boundToWorld() {
        this.position.x = Util.clamp(this.position.x, Constants.WORLD_MIN, Constants.WORLD_MAX);
        this.position.y = Util.clamp(this.position.y, Constants.WORLD_MIN, Constants.WORLD_MAX);
    }
}
export default Entity;
