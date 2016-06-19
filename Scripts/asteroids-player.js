/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.player');

ASTEROIDS.player = (function () {
    // private properties
    var utils = ASTEROIDS.utils,
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
        maxSpeed = 20,
        maxAccelerationCoefficient = 1,
        fireRate = 300,
        maxFireRate = 500,
        weapon = "",
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
            if (vx + value > maxSpeed) {
                vx = maxSpeed;
            } else {
                vx += value;
            }
        },
        updateVY: function (value) {
            if (vy + value > maxSpeed) {
                vy = maxSpeed;
            } else {
                vy += value;
            }
        },
        draw: function () {
            context.save();
            context.translate(x, y + 0.5 * height);
            context.rotate(utils.convertDegreesToRads(rotation));
            context.translate(-1 * x, -1 * (0.5 * height));
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x - (0.5 * width), y - height);
            context.lineTo(x + (0.5 * width), y - height);
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
            return new Date().gettime() - lastFired > fireRate;
        },
        isFiring: function () {
            lastFired = new Date().getTime();
        },
        shoot: function () {
            if (this.isFireReady()) {
                this.isFiring();
                weapon.fire();
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
//
//            if (asteroids_game.key) {
//                if (asteroids_game.key.isDown(asteroids_game.key.UP)) {
//                    this.accelerate();
//                }
//                if (asteroids_game.key.isDown(asteroids_game.key.LEFT)) {
//                    this.rotate(-5);
//                }
//                if (asteroids_game.key.isDown(asteroids_game.key.RIGHT)) {
//                    this.rotate(5);
//                }
//                if (asteroids_game.key.isDown(asteroids_game.key.DOWN)) {
//                    this.accelerationCoefficient += .1;
//                }
//                if (asteroids_game.key.isDown(asteroids_game.key.SPACE)) {
//                    this.shoot();
//                }                    
//            }
//        }
    };
    return player;
}());