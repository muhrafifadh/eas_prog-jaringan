export var SOCKET;
(function(SOCKET) {
    SOCKET["UPDATE"] = "update";
    SOCKET["NEW_PLAYER"] = "newPlayer";
    SOCKET["PLAYER_ACTION"] = "playerAction";
    SOCKET["CHAT_CLIENT_SERVER"] = "chatClientToServer";
    SOCKET["CHAT_SERVER_CLIENT"] = "chatServerToClient";
    SOCKET["DISCONNECT"] = "disconnect";
})(SOCKET || (SOCKET = {}));
export const PLAYER_TURN_RATE = 0.005;
export const PLAYER_DEFAULT_SPEED = 0.4;
export const PLAYER_SHOT_COOLDOWN = 800;
export const PLAYER_DEFAULT_HITBOX_SIZE = 20;
export const PLAYER_SHIELD_HITBOX_SIZE = 45;
export const PLAYER_MAX_HEALTH = 10;
export const BULLET_DEFAULT_DAMAGE = 1;
export const BULLET_SPEED = 1.2;
export const BULLET_MAX_TRAVEL_DISTANCE = 1000;
export const BULLET_HITBOX_SIZE = 10;
export const POWERUP_HITBOX_SIZE = 5;
export const POWERUP_MAX_COUNT = 50;
export const POWERUP_MIN_DURATION = 5000;
export const POWERUP_MAX_DURATION = 15000;
export var POWERUP_TYPES;
(function(POWERUP_TYPES) {
    POWERUP_TYPES["HEALTH_PACK"] = "HEALTH_PACK";
    POWERUP_TYPES["SHOTGUN"] = "SHOTGUN";
    POWERUP_TYPES["RAPIDFIRE"] = "RAPIDFIRE";
    POWERUP_TYPES["SPEEDBOOST"] = "SPEEDBOOST";
    POWERUP_TYPES["SHIELD"] = "SHIELD";
})(POWERUP_TYPES || (POWERUP_TYPES = {}));
export const POWERUP_DATA_RANGES = new Map([
    [POWERUP_TYPES.HEALTH_PACK, { min: 1, max: 4 }],
    [POWERUP_TYPES.SHOTGUN, { min: 1, max: 2 }],
    [POWERUP_TYPES.RAPIDFIRE, { min: 2, max: 4 }],
    [POWERUP_TYPES.SPEEDBOOST, { min: 1.2, max: 1.8 }],
    [POWERUP_TYPES.SHIELD, { min: 1, max: 4 }],
]);
export const WORLD_MIN = 0;
export const WORLD_MAX = 2000;
export const WORLD_PADDING = 30;
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const DRAWING_NAME_FONT = '14px Montserrat';
export const DRAWING_NAME_COLOR = 'black';
export const DRAWING_HP_COLOR = 'red';
export const DRAWING_HP_MISSING_COLOR = 'grey';
export const DRAWING_IMG_BASE_PATH = '/img';
export var DRAWING_IMG_KEYS;
(function(DRAWING_IMG_KEYS) {
    DRAWING_IMG_KEYS["SELF_TANK"] = "SELF_TANK";
    DRAWING_IMG_KEYS["SELF_TURRET"] = "SELF_TURRET";
    DRAWING_IMG_KEYS["OTHER_TANK"] = "OTHER_TANK";
    DRAWING_IMG_KEYS["OTHER_TURRET"] = "OTHER_TURRET";
    DRAWING_IMG_KEYS["PLAYER_SHIELD"] = "PLAYER_SHIELD";
    DRAWING_IMG_KEYS["BULLET"] = "BULLET";
    DRAWING_IMG_KEYS["TILE"] = "TILE";
})(DRAWING_IMG_KEYS || (DRAWING_IMG_KEYS = {}));
export const DRAWING_IMG_KEY_TO_ASSET = new Map([
    [DRAWING_IMG_KEYS.SELF_TANK, 'self_tank.png'],
    [DRAWING_IMG_KEYS.SELF_TURRET, 'self_turret.png'],
    [DRAWING_IMG_KEYS.OTHER_TANK, 'other_tank.png'],
    [DRAWING_IMG_KEYS.OTHER_TURRET, 'other_turret.png'],
    [DRAWING_IMG_KEYS.PLAYER_SHIELD, 'shield.png'],
    [DRAWING_IMG_KEYS.BULLET, 'bullet.png'],
    [DRAWING_IMG_KEYS.TILE, 'tile.png'],
    [POWERUP_TYPES.HEALTH_PACK, 'health_pack_powerup.png'],
    [POWERUP_TYPES.RAPIDFIRE, 'rapidfire_powerup.png'],
    [POWERUP_TYPES.SHIELD, 'shield_powerup.png'],
    [POWERUP_TYPES.SHOTGUN, 'shotgun_powerup.png'],
    [POWERUP_TYPES.SPEEDBOOST, 'speedboost_powerup.png'],
]);
export const DRAWING_TILE_SIZE = 50;
export const VIEWPORT_STICKINESS = 0.004;
(() => {
    const m = new Set(Object.keys(DRAWING_IMG_KEYS));
    for (const v in POWERUP_TYPES) {
        if (m.has(v)) {
            throw new Error('Keys in POWERUP_TYPES cannot intersect with DRAWING_IMG_KEYS');
        }
    }
})();