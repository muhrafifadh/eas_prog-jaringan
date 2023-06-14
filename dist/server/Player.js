import * as Constants from '../lib/Constants';
import Bullet from './Bullet';
import Entity from '../lib/Entity';
import Util from '../lib/Util';
import Vector from '../lib/Vector';

class Player extends Entity {
    constructor(name, socketID) {
        super(Vector.zero(), Vector.zero(), Vector.zero(), Constants.PLAYER_DEFAULT_HITBOX_SIZE);
        this.name = name;
        this.socketID = socketID;
        this.lastUpdateTime = 0;
        this.tankAngle = 0;
        this.turretAngle = 0;
        this.turnRate = 0;
        this.speed = Constants.PLAYER_DEFAULT_SPEED;
        this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN;
        this.lastShotTime = 0;
        this.health = Constants.PLAYER_MAX_HEALTH;
        this.powerups = new Map();
        this.kills = 0;
        this.deaths = 0;
    }

    static create(name, socketID) {
        const player = new Player(name, socketID);
        player.spawn();
        return player;
    }

    updateOnInput(data) {
        this.velocity = Vector.fromPolar(this.speed * (data.up ? 1 : data.down ? -1 : 0), this.tankAngle);
        this.turnRate = Constants.PLAYER_TURN_RATE * (data.right ? 1 : data.left ? -1 : 0);
        this.turretAngle = data.turretAngle;
    }

    update(lastUpdateTime, deltaTime) {
        this.lastUpdateTime = lastUpdateTime;
        this.position.add(Vector.scale(this.velocity, deltaTime));
        this.boundToWorld();
        this.tankAngle = Util.normalizeAngle(this.tankAngle + this.turnRate * deltaTime);
        this.updatePowerups();
    }

    updatePowerups() {
        for (const [type, powerup] of this.powerups) {
            const expired = this.lastUpdateTime > powerup.expirationTime;
            switch (type) {
                case Constants.POWERUP_TYPES.HEALTH_PACK:
                    this.health = Math.min(this.health + powerup.data, Constants.PLAYER_MAX_HEALTH);
                    this.powerups.delete(type);
                    break;
                case Constants.POWERUP_TYPES.SHOTGUN:
                    if (expired) {
                        this.powerups.delete(type);
                    }
                    break;
                case Constants.POWERUP_TYPES.RAPIDFIRE:
                    if (!expired) {
                        this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN / powerup.data;
                    } else {
                        this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN;
                        this.powerups.delete(type);
                    }
                    break;
                case Constants.POWERUP_TYPES.SPEEDBOOST:
                    if (!expired) {
                        this.speed = Constants.PLAYER_DEFAULT_SPEED * powerup.data;
                    } else {
                        this.speed = Constants.PLAYER_DEFAULT_SPEED;
                        this.powerups.delete(type);
                    }
                    break;
                case Constants.POWERUP_TYPES.SHIELD:
                    if (expired || powerup.data <= 0) {
                        this.hitboxSize = Constants.PLAYER_DEFAULT_HITBOX_SIZE;
                        this.powerups.delete(type);
                    } else {
                        this.hitboxSize = Constants.PLAYER_SHIELD_HITBOX_SIZE;
                    }
                    break;
            }
        }
    }

    applyPowerup(powerup) {
        powerup.expirationTime = this.lastUpdateTime + powerup.duration;
        this.powerups.set(powerup.type, powerup);
    }

    canShoot() {
        return this.lastUpdateTime > this.lastShotTime + this.shotCooldown;
    }

    getProjectilesFromShot() {
        const bullets = [Bullet.createFromPlayer(this, 0)];
        const shotgunPowerup = this.powerups.get(Constants.POWERUP_TYPES.SHOTGUN);
        if (shotgunPowerup) {
            for (let i = 1; i <= shotgunPowerup.data; i++) {
                const angleDeviation = (i * Math.PI) / 9;
                bullets.push(Bullet.createFromPlayer(this, -angleDeviation));
                bullets.push(Bullet.createFromPlayer(this, angleDeviation));
            }
        }
        this.lastShotTime = this.lastUpdateTime;
        return bullets;
    }

    isDead() {
        return this.health <= 0;
    }

    damage(amount) {
        const shield = this.powerups.get(Constants.POWERUP_TYPES.SHIELD);
        if (shield) {
            shield.data -= 1;
        } else {
            this.health -= amount;
        }
    }

    spawn() {
        const positionRange = Constants.WORLD_MAX - Constants.WORLD_MIN - 2 * Constants.WORLD_PADDING;
        this.position = new Vector(
            Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING, Constants.WORLD_MAX - Constants.WORLD_PADDING),
            Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING, Constants.WORLD_MAX - Constants.WORLD_PADDING)
        );
        this.tankAngle = Util.randRange(0, 2 * Math.PI);
        this.health = Constants.PLAYER_MAX_HEALTH;
    }
}

export default Player;