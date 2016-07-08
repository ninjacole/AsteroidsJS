/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.player');

ASTEROIDS.player = (function () {
    // dependencies
    var utils = ASTEROIDS.utils,
        key = ASTEROIDS.key,
        bullet = ASTEROIDS.bullet,
        weapon = ASTEROIDS.weapon,
        powerup = ASTEROIDS.Powerup,
        powerupTypes = ASTEROIDS.powerupTypes,
        shield = ASTEROIDS.shield,
        
        // private variables
        playerDeathSound = document.getElementById('playerDeathSound'),
        canvas = ASTEROIDS.canvas,
        context = ASTEROIDS.context,
        ship_single = document.getElementById('ship-single'),
        ship_single_moving = document.getElementById('ship-single-moving'),
        ship_double = document.getElementById('ship-double'),
        ship_double_moving = document.getElementById('ship-double-moving'),
        img = ship_single,
        x = canvas.width / 2,
        y = canvas.height / 2,
        vx = 0,
        vy = 0,
        width = 40,
        height = 40,
        rotation = 0,
        lives = 5,
        lastFired = Date.now(),
        accelerationCoefficient = 0.1,
        maxSpeed = 15,
        maxAccelerationCoefficient = 1,
        fireRate = 300,
        maxFireRate = 100,
        setFireRate = function (value) {
            fireRate -= value;
            if (fireRate < maxFireRate) {
                fireRate = maxFireRate;
            }
        },
        player,
        isEngineRunning = false,
        timeOfDeath = new Date().getTime(),
        respawnTime = 500,
        alive = true,
        timeOfLastSpawn = new Date().getTime(),
        safeTime = 2000;
    
    // public interface
    player = {
        isAlive: function () {
            return alive;
        },
        getX: function () {
            return x;
        },
        getY: function () {
            return y;
        },
        getVX: function () {
            return vx;
        },
        getVY: function () {
            return vy;
        },
        getLives: function () {
            return lives;
        },
        getCircleCollider: function () {
            return {
                radius: width / 2,
                x: x,
                y: y
            };
        },
        accelerate: function () {
            var vx = Math.sin((utils.convertDegreesToRads(180 - rotation))) * accelerationCoefficient,
                vy = Math.cos((utils.convertDegreesToRads(180 - rotation))) * accelerationCoefficient;
            
            this.updateVX(vx);
            this.updateVY(vy);
        },
        adjustFireRate: function (value) {
            if (fireRate + value > maxFireRate) {
                fireRate = maxFireRate;
            } else {
                fireRate += value;
            }
        },
        adjustAccelerationCoefficient: function (value) {
            if (accelerationCoefficient + value > maxAccelerationCoefficient) {
                accelerationCoefficient = maxAccelerationCoefficient;
            } else {
                accelerationCoefficient += value;
            }
        },
        updateVX: function (value) {
            vx += value;
            if (vx > maxSpeed) {
                vx = maxSpeed;
            } else if (vx < -1 * maxSpeed) {
                vx = -1 * maxSpeed;
            }
        },
        updateVY: function (value) {
            vy += value;
            if (vy > maxSpeed) {
                vy = maxSpeed;
            } else if (vy < -1 * maxSpeed) {
                vy = -1 * maxSpeed;
            }
        },
        draw: function () {
            context.save();
            context.translate(x, y);
            context.rotate(utils.convertDegreesToRads(rotation));
            context.translate(-1 * x, -1 * y);

            if (shield.isUp()) {
                shield.draw(x, y, height * 0.5 + 10);
            }
            context.drawImage(img, x - 0.5 * width, y - 0.5 * height, width, height);
            context.restore();
        },
        rotate: function (degrees) {
            rotation += degrees;
            // If we're over 360 degrees, use the remainder
            // example: 365 % 360 = remainder of 5. Rotation is 5 degrees.
            if (rotation % 360 > 0) {
                rotation = rotation % 360;
            }

            // If we're negative rotation, add 360.
            // Example, rotated to -5 degrees, becomes 355 in the circle
            if (rotation < 0) {
                rotation = 360 + rotation;
            }
        },
        isFireReady: function () {
            return new Date().getTime() - lastFired > fireRate;
        },
        isFiring: function () {
            lastFired = new Date().getTime();
        },
        getCenterBulletPoint: function () {
            var hyp = 0.5 * height,
                magx = Math.sin((utils.convertDegreesToRads(180 - rotation))) * hyp,
                magy = Math.cos((utils.convertDegreesToRads(180 - rotation))) * hyp;
            return {x: x + magx, y: y + magy};
        },
        getRightBulletPoint: function () {
            var hyp = Math.sqrt(Math.pow(0.5 * width, 2)),
                magx = Math.sin((utils.convertDegreesToRads(180 - rotation + 90))) * hyp,
                magy = Math.cos((utils.convertDegreesToRads(180 - rotation + 90))) * hyp;
            return {x: x + magx, y: y + magy};
        },
        getLeftBulletPoint: function () {
            var hyp = Math.sqrt(Math.pow(0.5 * width, 2)),
                magx = Math.sin((utils.convertDegreesToRads(180 - rotation - 90))) * hyp,
                magy = Math.cos((utils.convertDegreesToRads(180 - rotation - 90))) * hyp;
            return {x: x + magx, y: y + magy};
        },
        shoot: function () {
            if (this.isFireReady()) {
                this.isFiring();
                var playerData = {
                    centerBulletPoint: this.getCenterBulletPoint(),
                    rightBulletPoint: this.getRightBulletPoint(),
                    leftBulletPoint: this.getLeftBulletPoint(),
                    vx: vx,
                    vy: vy,
                    rotation: rotation
                };
                weapon.fire(playerData);
            }
        },
        update: function () {
            x = utils.getXChange(x, vx);
            y = utils.getYChange(y, vy);
            if (isEngineRunning && weapon.getType() === 'single') {
                img = ship_single_moving;
            } else if (isEngineRunning) {
                img = ship_double_moving;
                context.drawImage(ship_double_moving, x - 0.5 * width, y - 0.5 * height, width, height);
            } else if (weapon.getType() === 'single') {
                img = ship_single;
            } else {
                img = ship_double;
            }
        },
        isRecentlySpawned: function () {
            return new Date().getTime() - timeOfLastSpawn < safeTime;
        },
        getHeight: function () {
            return height;
        },
        getAccelerationCoefficient: function () {
            return accelerationCoefficient;
        },
        getFireRate: function () {
            return fireRate;
        },
        engineEnabled: function (value) {
            isEngineRunning = value;
        },
        setLives: function (value) {
            lives = value;
        },
        shield: shield,
        gainPowerup: function (powerupType) {
            if (powerupType === powerupTypes.SPEED) {
                this.adjustAccelerationCoefficient(0.06);
            } else if (powerupType === powerupTypes.DOUBLE) {
                weapon.setType(powerupTypes.DOUBLE);
            } else if (powerupType === powerupTypes.SPREAD) {
                weapon.setType(powerupTypes.SPREAD);
            } else if (powerupType === powerupTypes.FIRE_RATE) {
                setFireRate(50);
            } else if (powerupType === powerupTypes.EXTRA_LIFE) {
                lives += 1;
            }
        },
        die: function () {
            lives -= 1;
            x = -5000;
            y = -5000;
            vx = 0;
            vy = 0;
            fireRate = 300;
            rotation = 0;
            alive = false;
            playerDeathSound.play();
            weapon.setType('single');
            accelerationCoefficient = 0.1;
            timeOfDeath = new Date().getTime();
            img = document.getElementById('ship-single');
            if (lives > 0) {
                setTimeout(this.reset, respawnTime);
            }
        },
        reset: function () {
            timeOfLastSpawn = new Date().getTime();
            alive = true;
            x = canvas.width / 2;
            y = canvas.height / 2;
            vx = 0;
            vy = 0;
            rotation = 0;
        }
    };
    return player;
}());