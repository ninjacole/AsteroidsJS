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
        
        // private variables
        playerDeathSound = document.getElementById('playerDeathSound'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        img = document.getElementById('ship-single'),
        x = canvas.width / 2,
        y = canvas.height / 2,
        vx = 0,
        vy = 0,
        width = 40,
        height = 40,
        rotation = 0,
        lastFired = new Date().getTime(),
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
        timeOfDeath = new Date().getTime(),
        respawnTime = 3000,
        alive = true,
        engineRunning = false;
    
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
            context.drawImage(img, x - 0.5 * width, y - 0.5 * height, width, height);
//            
//            if (engineRunning) {
//                context.beginPath();
//                context.fillStyle = 'red';
//                context.moveTo(x - (0.5 * width), y + height);
//                context.lineTo(x, y + height + (0.5 * height));
//                context.lineTo(x + (0.5 * width), y + height);
//                context.lineTo(x - (0.5 * width), y + height);
//                context.fill();
//                context.closePath();
//            }
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
            x += vx;
            y += vy;

            if (x + vx > canvas.width) {
                x = 0;
            }
            if (x + vx < 0) {
                x = canvas.width;
            }
            if (y + vy > canvas.height) {
                y = 0;
            }
            if (y + vy < 0) {
                y = canvas.height;
            }
            
            if (key.isDown(key.UP)) {
                this.accelerate();
                engineRunning = true;
            } else {
                engineRunning = false;
            }
            if (key.isDown(key.LEFT)) {
                this.rotate(-5);
            }
            if (key.isDown(key.RIGHT)) {
                this.rotate(5);
            }
            if (key.isDown(key.SPACE)) {
                this.shoot();
            }
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
        gainPowerup: function (powerup) {
            powerup.playSound();
            if (powerup.getType() === powerupTypes.SPEED) {
                this.adjustAccelerationCoefficient(0.06);
            }
            if (powerup.getType() === powerupTypes.DOUBLE) {
                weapon.setType(powerupTypes.DOUBLE);
                img = document.getElementById('ship-double');
            }
            if (powerup.getType() === powerupTypes.SPREAD) {
                weapon.setType(powerupTypes.SPREAD);
                img = document.getElementById('ship-double');
            }
            if (powerup.getType() === powerupTypes.FIRE_RATE) {
                setFireRate(50);
            }
        },
        die: function () {
            alive = false;
            x = -1000;
            y = -1000;
            playerDeathSound.play();
            weapon.setType('single');
            accelerationCoefficient = 0.1;
            fireRate = 300;
            vx = 0;
            vy = 0;
            rotation = 0;
            timeOfDeath = new Date().getTime();
            img = document.getElementById('ship-single');
            setTimeout(function () {
                alive = true;
                x = canvas.width / 2;
                y = canvas.height / 2;
            }, respawnTime);
        }
    };
    return player;
}());