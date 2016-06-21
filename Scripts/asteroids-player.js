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
        powerupSound = document.getElementById('powerupSound'),
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        x = canvas.width / 2,
        y = canvas.height / 2,
        vx = 0,
        vy = 0,
        width = 15,
        height = 30,
        rotation = 0,
        lastFired = new Date().getTime(),
        accelerationCoefficient = 0.1,
        maxSpeed = 15,
        maxAccelerationCoefficient = 1,
        fireRate = 300,
        maxFireRate = 500,
        player;
    
    // public interface
    player = {
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
            var vx = Math.sin((Math.PI / 180) * (180 - rotation)) * accelerationCoefficient,
                vy = Math.cos((Math.PI / 180) * (180 - rotation)) * accelerationCoefficient;
            
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
        updateWeapon: function (weaponType) {
            // change weapon to be new weapon type
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
            context.translate(x, y + 0.5 * height);
            context.rotate(utils.convertDegreesToRads(rotation));
            context.translate(-1 * x, -1 * (y + 0.5 * height));
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x - (0.5 * width), y + height);
            context.lineTo(x + (0.5 * width), y + height);
            context.lineTo(x, y);
            context.fill();
            context.closePath();
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
        shoot: function () {
            if (this.isFireReady()) {
                this.isFiring();
                var playerData = {
                    x: x,
                    y: y + 0.5 * height,
                    vx: vx,
                    vy: vy
                };
                weapon.fire(playerData, rotation);
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
            }
            if (key.isDown(key.LEFT)) {
                this.rotate(-5);
            }
            if (key.isDown(key.RIGHT)) {
                this.rotate(5);
            }
            if (key.isDown(key.DOWN)) {
                console.log(this.getAccelerationCoefficient());
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
        gainPowerup: function (powerup) {
            powerup.playSound();
            if (powerup.getType() === powerupTypes.SPEED) {
                this.adjustAccelerationCoefficient(0.06);
            }
            if (powerup.getType() === powerupTypes.DOUBLE) {
                weapon.setType(powerupTypes.DOUBLE);
            }
            if (powerup.getType() === powerupTypes.REAR) {
                weapon.setType(powerupTypes.REAR);
            }
            if (powerup.getType() === powerupTypes.SPREAD) {
                weapon.setType(powerupTypes.SPREAD);
            }
        }
//        gainPowerup: function (powerup) {
//            powerupSound.play();
//            if (powerup.ability === 'speed') {
//                this.setAccelerationCoefficient(0.1);
//                ASTEROIDS.powerupMessages.push(new ASTEROIDS.powerupMessage(this.x, this.y, "Speed+! Current speed is " + this.accelerationCoefficient.toFixed(1) * 10));
//            }
//            if (powerup.ability === 'double') {
//                this.weaponType = 'double';
//                asteroids_game.powerupMessages.push(new asteroids_game.powerupMessage(this.x, this.y, "Double gun!"));
//            }
//            if (powerup.ability === 'rear') {
//                this.weaponType = 'rear';
//                asteroids_game.powerupMessages.push(new asteroids_game.powerupMessage(this.x, this.y, "Rear gun!"));
//            }
//            if (powerup.ability === 'spread') {
//                this.weaponType = 'spread';
//                asteroids_game.powerupMessages.push(new asteroids_game.powerupMessage(this.x, this.y, "Spread gun!"));
//            }
//        }
//        
//                this.update = function () {
//            var canvas = asteroids_game.getCanvas();
//            this.x += this.vx;
//            this.y += this.vy;
//
//            if (this.x + this.vx > canvas.width) {
//                this.x = 0;
//            }
//            if (this.x + this.vx < 0) {
//                this.x = canvas.width;
//            }
//            if (this.y + this.vy > canvas.height) {
//                this.y = 0;
//            }
//            if (this.y + this.vy < 0) {
//                this.y = canvas.height;
//            }
//
//            if (asteroids_game.powerups) {
//                for (var i = 0; i < asteroids_game.powerups.length; i++) {
//                    var dx = asteroids_game.powerups[i].x - this.x;
//                    var dy = asteroids_game.powerups[i].y - this.y;
//                    var distance = Math.sqrt(dx * dx + dy * dy);
//
//                    if (distance < asteroids_game.powerups[i].radius + this.h) {
//                        this.gainPowerup(asteroids_game.powerups[i]);
//                        asteroids_game.powerups.splice(i, 1);
//                    }
//                }                    
//            }
//
//            if (asteroids_game.asteroids) {
//                for (var i = 0; i < asteroids_game.asteroids.length; i++) {
//                    var dx = asteroids_game.asteroids[i].x - this.x;
//                    var dy = asteroids_game.asteroids[i].y - this.y;
//                    var distance = Math.sqrt(dx * dx + dy * dy);
//
//                    if (distance < asteroids_game.asteroids[i].width * .5) {
//                        this.vx = 0;
//                        this.vy = 0;
//                        this.x = canvas.width / 2;
//                        this.y = canvas.height / 2;
//                    }
//                }                    
//            }

//        }
    };
    return player;
}());