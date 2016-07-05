/*jslint node: true */
'use strict';

// global object reference or creation
var ASTEROIDS = ASTEROIDS || {};

ASTEROIDS.namespace('ASTEROIDS.enemy');

ASTEROIDS.enemy = function () {
    // dependencies
    var key = ASTEROIDS.key,
        bullet = ASTEROIDS.bullet,
        weapon = ASTEROIDS.weapon,
        powerup = ASTEROIDS.Powerup,
        powerupTypes = ASTEROIDS.powerupTypes,
        player = ASTEROIDS.player,
        
        // private variables
        canvas = document.getElementById('gameCanvas'),
        context = canvas.getContext('2d'),
        img = document.getElementById('enemy'),
        x = Math.random() > 0.5 ? 50 : canvas.width - 50,
        y = Math.random() > 0.5 ? 50 : canvas.height - 50,
        vx = Math.random() * 3,
        vy = Math.random() * 3,
        width = 40,
        height = 40,
        lastFired = Date.now(),
        accelerationCoefficient = 0.1,
        maxSpeed = 15,
        maxAccelerationCoefficient = 1,
        fireRate = 1500,
        maxFireRate = 100,
        setFireRate = function (value) {
            fireRate -= value;
            if (fireRate < maxFireRate) {
                fireRate = maxFireRate;
            }
        },
        lastChangedDirection = Date.now(),
        directionChangeRate = 5000,
        enemy,
        init;
    
    // public interface
    enemy = {
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
        getWidth: function () {
            return width;
        },
        getHeight: function () {
            return height;
        },
        changeDirection: function () {
            lastChangedDirection = Date.now();
            var vxchange = Math.random() * 3,
                vychange = Math.random() * 3;
            if (Math.random() > 0.5) {
                vychange *= -1;
            }
            if (Math.random() > 0.5) {
                vxchange *= -1;
            }
            vx = vxchange;
            vy = vychange;
        },
        draw: function () {
            context.save();
            context.drawImage(img, x - 0.5 * width, y - 0.5 * height, width, height);
            context.restore();
        },
        canShoot: function () {
            return Date.now() - lastFired > fireRate;
        },
        shoot: function () {
            if (this.canShoot()) {
                lastFired = Date.now();
                weapon.fireEnemyBullet(x, y, player.getX(), player.getY());
            }
        },
        canChangeDirection: function () {
            return Date.now() - lastChangedDirection > directionChangeRate;
        },
        update: function () {
            if (this.canChangeDirection()) {
                this.changeDirection();
            }
            if (this.canShoot()) {
                this.shoot();
            }
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
        },
        getFireRate: function () {
            return fireRate;
        }
    };
    return enemy;
};