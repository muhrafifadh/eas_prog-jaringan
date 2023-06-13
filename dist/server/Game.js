import * as Constants from '../lib/Constants';
import Bullet from './Bullet';
import Player from './Player';
import Powerup from './Powerup';
class Game {
    constructor() {
        this.clients = new Map();
        this.players = new Map();
        this.projectiles = [];
        this.powerups = [];
        this.lastUpdateTime = 0;
        this.deltaTime = 0;
    }
    static create() {
        const game = new Game();
        game.init();
        return game;
    }
    init() {
        this.lastUpdateTime = Date.now();
    }
    addNewPlayer(name, playerSocket) {
        this.clients.set(playerSocket.id, playerSocket);
        this.players.set(playerSocket.id, Player.create(name, playerSocket.id));
    }
    removePlayer(socketID) {
        if (this.clients.has(socketID)) {
            this.clients.delete(socketID);
        }
        if (this.players.has(socketID)) {
            const p = this.players.get(socketID);
            if (p) {
                this.players.delete(socketID);
                return p.name;
            }
            return '';
        }
        return '';
    }
    getPlayerNameBySocketId(socketID) {
        const p = this.players.get(socketID);
        return p ? p.name : '';
    }
    updatePlayerOnInput(socketID, data) {
        const player = this.players.get(socketID);
        if (player) {
            player.updateOnInput(data);
            if (data.shoot && player.canShoot()) {
                const projectiles = player.getProjectilesFromShot();
                this.projectiles.push(...projectiles);
            }
        }
    }
    update() {
        const currentTime = Date.now();
        this.deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;
        const entities = [
            ...this.players.values(),
            ...this.projectiles,
            ...this.powerups,
        ];
        entities.forEach((entity) => {
            entity.update(this.lastUpdateTime, this.deltaTime);
        });
        for (let i = 0; i < entities.length; ++i) {
            for (let j = i + 1; j < entities.length; ++j) {
                let e1 = entities[i];
                let e2 = entities[j];
                if (!e1.collided(e2)) {
                    continue;
                }
                if (e1 instanceof Bullet && e2 instanceof Player) {
                    e1 = entities[j];
                    e2 = entities[i];
                }
                if (e1 instanceof Player && e2 instanceof Bullet && e2.source !== e1) {
                    e1.damage(e2.damage);
                    if (e1.isDead()) {
                        e1.spawn();
                        e1.deaths++;
                        e2.source.kills++;
                    }
                    e2.destroyed = true;
                }
                if (e1 instanceof Powerup && e2 instanceof Player) {
                    e1 = entities[j];
                    e2 = entities[i];
                }
                if (e1 instanceof Player && e2 instanceof Powerup) {
                    e1.applyPowerup(e2);
                    e2.destroyed = true;
                }
                if (e1 instanceof Bullet &&
                    e2 instanceof Bullet &&
                    e1.source !== e2.source) {
                    e1.destroyed = true;
                    e2.destroyed = true;
                }
                if ((e1 instanceof Powerup && e2 instanceof Bullet) ||
                    (e1 instanceof Bullet && e2 instanceof Powerup)) {
                    e1.destroyed = true;
                    e2.destroyed = true;
                }
            }
        }
        this.projectiles = this.projectiles.filter((projectile) => !projectile.destroyed);
        this.powerups = this.powerups.filter((powerup) => !powerup.destroyed);
        while (this.powerups.length < Constants.POWERUP_MAX_COUNT) {
            this.powerups.push(Powerup.create());
        }
    }
    sendState() {
        const players = [...this.players.values()];
        this.clients.forEach((_client, socketID) => {
            const currentPlayer = this.players.get(socketID);
            this.clients.get(socketID).emit(Constants.SOCKET.UPDATE, {
                self: currentPlayer,
                players: players,
                projectiles: this.projectiles,
                powerups: this.powerups,
            });
        });
    }
}
export default Game;
